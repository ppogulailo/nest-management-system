import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserRole } from '@prisma/client';
import { USER_NOT_FOUND_OR_NOT_A_BOSS } from '../../user/const/user.const';

@Injectable()
export class BossIdValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }

    // Perform ID validation using PrismaService
    const user = await this.prisma.user.findUnique({
      where: { id: value, role: UserRole.Boss },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND_OR_NOT_A_BOSS);
    }

    return value;
  }
}
