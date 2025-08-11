import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Following } from '../following/entities/following.entity';
import { BullModule } from '@nestjs/bullmq';
import { ProductsProcessor } from '../common/processors/products.processor';

@Module({
  providers: [
    ProductsResolver,
    ProductsService,
    JwtService,
    CloudinaryService,
    ProductsProcessor,
  ],
  imports: [
    TypeOrmModule.forFeature([Product, Vendor, Following]),
    BullModule.registerQueue({ name: 'products' }),
  ],
})
export class ProductsModule {}
