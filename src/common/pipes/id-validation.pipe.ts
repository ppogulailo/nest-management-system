import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { idValidationConstant } from '../const/id-validation.constant';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }

    // Perform ID validation using PrismaService
    const user = await this.prisma.user.findUnique({
      where: { id: value },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException(idValidationConstant);
    }

    return value;
  }
}
