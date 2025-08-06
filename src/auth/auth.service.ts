import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginInput } from '../common/inputTypes/login.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { Role } from '../common/enum/role.enum';
import { Payload } from '../common/types/payload.type';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/common/objectTypes/accessToken.type';
import { CloudinaryService } from '../cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { CreateVendorInput } from '../vendors/dto/create-vendor.input';
import { Cart } from '../cart/entities/cart.entity';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async signupUser(input: CreateUserInput, role?: Role): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { email: input.email },
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await hash(input.password, 10);

    const user = this.userRepo.create({
      ...input,
      password: hashedPassword,
      role: role ?? Role.USER,
    });

    const newUser = await this.userRepo.save(user);

    const newCart = this.cartRepo.create({ userId: newUser.id, totalPrice: 0 });

    await this.cartRepo.save(newCart);

    return newUser;
  }
  // Split in Code Signup Vendor
  async signupVendor(
    userInput: CreateUserInput,
    vendorInput: CreateVendorInput,
  ): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({
      where: [
        { companyName: vendorInput.companyName },
        { contactEmail: vendorInput.contactEmail },
        { contactPhone: vendorInput.contactPhone },
      ],
    });
    if (vendor)
      throw new ConflictException(
        'Vendor with the same company name, email, or phone already exists',
      );

    const user = await this.signupUser(userInput, Role.VENDOR);

    const { secure_url, public_id } = await this.cloudinaryService.uploadFile(
      await vendorInput.logo,
    );
    const newVendor = this.vendorRepo.create({
      ...vendorInput,
      logo: secure_url,
      user,
      public_id,
    });
    return await this.vendorRepo.save(newVendor);
  }

  async validateUser(input: LoginInput): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: input.email },
      relations: ['vendor'],
    });
    if (!user) throw new NotFoundException('Invalid Email');

    const comparePass = await compare(input.password, user.password);
    if (!comparePass) throw new Error('Invalid Password');
    return user;
  }

  async generateAccessToken(payload: Payload): Promise<String> {
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async login(input: LoginInput): Promise<AccessToken> {
    const user = (await this.validateUser(input)) as User;

    const payload: Payload = {
      sub: {
        userId: user.id,
        role: user.role,
      },
    };
    if (user.vendor) payload.sub.vendorId = user.vendor.id;
    const accessToken = await this.generateAccessToken(payload);
    let response = {
      id: user?.id,
      role: user?.role,
      token: String(accessToken),
    };
    if (user.vendor) {
      return {
        ...response,
        vendorId: user.vendor?.id,
      };
    } else {
      return response;
    }
  }

  async seedAdmin(): Promise<string> {
    const admin = await this.userRepo.findOne({
      where: { role: Role.SUPER_ADMIN },
    });
    if (!admin) {
      const newAdmin = this.userRepo.create({
        username: 'superadmin',
        email: 'admin@gmail.com',
        password: await hash('123456789', 10),
        role: Role.SUPER_ADMIN,
      });
      await this.userRepo.save(newAdmin);
      return 'Super Admin is Created';
    }
    return 'No More Than One Super Admin';
  }
}
