import DataLoader from 'dataloader';
import { Request, Response } from 'express';
import { Vendor } from '../../vendors/entities/vendor.entity';

export type VendorLoader = {
  req: Request;
  res: Response;
  vendorLoader: DataLoader<string, Vendor[]>;
};
