import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { CreateVendorInput } from '../vendors/dto/create-vendor.input';
import { Cart } from '../cart/entities/cart.entity';
import { log } from 'console';
import { sendVerificationCodeMail } from '../common/nodemailer/sendVerificationCode';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
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

  async sendVerificationCode(email: string): Promise<string> {
    let code: string = await sendVerificationCodeMail(email);
    await this.cache.set('verificationCode', code);
    log(code);
    await this.cache.set('email', email);
    return 'Verification Code is Sent';
  }

  async comapreVerificationCode(code: string): Promise<boolean> {
    const cachedCode = await this.cache.get('verificationCode');
    return cachedCode === code;
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const email = (await this.cache.get('email')) as string;
    if (!email) throw new Error('Email is not Exist Try Again');
    const user = (await this.userRepo.findOneBy({ email })) as User;
    const comparePass = await compare(oldPassword, user?.password);
    if (!comparePass) throw new Error('Invalid Password');
    await this.userRepo.update(
      { email: email },
      { password: await hash(newPassword, 10) },
    );
    return true;
  }

  async seedAdmin(): Promise<string> {
    const admin = await this.userRepo.findOne({
      where: { role: Role.SUPER_ADMIN },
    });
    if (!admin) {
      const newAdmin = this.userRepo.create({
        username: process.env.SUPER_ADMIN_USERNAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        password: await hash(`${process.env.SUPER_ADMIN_PASSWORD}`, 10),
        role: Role.SUPER_ADMIN,
      });
      await this.userRepo.save(newAdmin);
      return 'Super Admin is Created';
    }
    throw new Error('No More Than One Super Admin');
  }
}
