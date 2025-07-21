import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesResolver } from './addresses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AddressesResolver, AddressesService, JwtService],
  imports: [TypeOrmModule.forFeature([Address])],
})
export class AddressesModule {}
