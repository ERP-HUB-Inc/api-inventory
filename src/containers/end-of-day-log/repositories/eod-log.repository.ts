import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { EODLog } from '../entities/eod-log.entity';

@Injectable()
export class EODLogRepository {
  entityName = 'EODLog';

  selectField: string[] = [
    'id',
    'productVariantId',
    'userId',
    'startQuantity',
    'inQuantity',
    'outQuantity',
    'endQuantity',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor(
    @InjectRepository(EODLog)
    public readonly repository: Repository<EODLog>
  ) {}

  findTodayEOD(itemId: string, currentDate: string): Promise<EODLog> {
    const startDate = new Date(`${currentDate}T00:00:00`);
    const endDate = new Date(`${currentDate}T23:59:59`);
  
    return this.repository.findOne({
      where: {
        itemId,
        createdAt: Between(startDate, endDate),
      },
      select: this.selectField as (keyof EODLog)[],
    });
  }
}
