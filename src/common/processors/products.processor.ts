import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { CloudinaryService } from '../../cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { Repository } from 'typeorm';
import { Job } from 'bullmq';
import { v2 } from 'cloudinary';
import { Readable } from 'typeorm/platform/PlatformTools';

@Processor('products')
export class ProductsProcessor extends WorkerHost {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'upload-product-image':
        return await this.handleImageUpload(job);
      case 'delete-product-image':
        return await this.handleImageDelete(job);
      case 'update-product':
        return await this.handleProductUpdate(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    console.log(`Get New Job ${job.id}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`Job ${job.name} is on Progress ${job.progress}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.name} is Completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Job ${job.name} is Failed`);
  }

  private async handleImageUpload(job: Job) {
    try {
      const { file, input, vendorId } = job.data;

      await job.updateProgress(10);

      const buffer = Buffer.from(file.buffer, 'base64'); // decode buffer
      const stream = Readable.from(buffer); // recreate stream

      const { secure_url, public_id }: any =
        await this.cloudinaryService.uploadStream(stream, file.filename);

      await job.updateProgress(70);

      const product = this.productRepo.create({
        ...input,
        image: secure_url,
        public_id,
        vendorId,
      });

      await this.productRepo.save(product);

      await job.updateProgress(100);

      return 'Image upload and product save complete';
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      throw new Error(error); // Re-throw to let BullMQ handle it
    }
  }

  private async handleProductUpdate(job: Job) {
    try {
      const { input, file, productId } = job.data;

      await job.updateProgress(10);
      const existing = await this.productRepo.findOneOrFail({
        where: { id: productId },
      });

      if (!input && !file) throw new Error('No data to update');

      if (file) {
        // Delete old image
        await v2.api.delete_resources([existing.public_id]);

        await job.updateProgress(30);

        // Recreate stream
        const buffer = Buffer.from(file.buffer, 'base64');
        const stream = Readable.from(buffer);

        const { secure_url, public_id }: any =
          await this.cloudinaryService.uploadStream(stream, file.filename);
        input.image = secure_url;
        existing.public_id = public_id;
      }

      const updated = this.productRepo.merge(existing, input.data);
      await job.updateProgress(80);

      await this.productRepo.save(updated);
      await job.updateProgress(100);

      return 'Product update complete';
    } catch (error) {
      console.error('Error in handleProductUpdate:', error);
      throw new Error(error.message);
    }
  }

  private async handleImageDelete(job: Job) {
    const { public_id } = job.data;
    await v2.api.delete_resources([public_id]);
    return 'Image is Deleted';
  }
}
