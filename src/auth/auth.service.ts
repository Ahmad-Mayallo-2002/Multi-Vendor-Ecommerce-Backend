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
import { LoginInput } from '../assets/inputTypes/login.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { Role } from '../assets/enum/role.enum';
import { Payload } from '../assets/types/payload.type';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/assets/objectTypes/accessToken.type';
import { CloudinaryService } from '../cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { CreateVendorInput } from '../vendors/dto/create-vendor.input';
import { Cart } from '../cart/entities/cart.entity';

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
    if (!user) throw new UnauthorizedException('Invalid Email');

    const comparePass = await compare(input.password, user.password);
    if (!comparePass) throw new UnauthorizedException('Invalid Password');

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
    const accessToken = await this.generateAccessToken(payload);
    let response = {
      id: user.id,
      role: user.role,
      token: String(accessToken),
    };
    return !user.vendor ? response : { ...response, vendorId: user.vendor.id };
  }

  async seedAdmin(userId: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User is not Found');
    const superAdmins = await this.userRepo.find({
      where: { role: Role.SUPER_ADMIN },
    });
    if (superAdmins.length > 1)
      throw new NotFoundException('Only One Can be Super Admin.');

    if (user.role !== Role.SUPER_ADMIN) {
      await this.userRepo.update({ id: userId }, { role: Role.SUPER_ADMIN });
      return 'You Are Now Super Admin';
    }
    return 'You Already are Super Admin.';
  }
}
