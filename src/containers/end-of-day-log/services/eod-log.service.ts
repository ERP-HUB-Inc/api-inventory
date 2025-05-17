
import { Injectable } from '@nestjs/common';
import { EODLogRepository } from '../repositories/eod-log.repository';
import { EODLog } from '../entities/eod-log.entity';

@Injectable()
export class EODLogService {
  constructor(
    private readonly eodLogRepository: EODLogRepository
  ) {}

  /**
   * Creates a new EODLog entry.
   * @param data - Partial data for the EODLog entity.
   * @returns The created EODLog entity.
   */
  async create(data: Partial<EODLog>): Promise<EODLog> {
    return this.eodLogRepository.repository.save(data);
  }

  /**
   * Finds a single EODLog entry by its ID.
   * @param id - The ID of the EODLog entry.
   * @returns The found EODLog entity or null if not found.
   */
  async findOne(id: string): Promise<EODLog | null> {
    return this.eodLogRepository.repository.findOne({
      where: { id },
      select: this.eodLogRepository.selectField as (keyof EODLog)[]
    });
  }

  /**
   * Retrieves all EODLog entries.
   * @returns An array of all EODLog entities.
   */
  async findAll(): Promise<EODLog[]> {
    return this.eodLogRepository.repository.find({
      select: this.eodLogRepository.selectField as (keyof EODLog)[]
    });
  }

  /**
   * Updates an existing EODLog entry by its ID.
   * @param id - The ID of the EODLog entry to update.
   * @param data - Partial data to update the EODLog entity.
   * @returns The updated EODLog entity.
   */
  async update(id: string, data: Partial<EODLog>): Promise<EODLog> {
    await this.eodLogRepository.repository.update(id, data);
    return this.findOne(id);
  }

  /**
   * Deletes an EODLog entry by its ID.
   * @param id - The ID of the EODLog entry to delete.
   * @returns void
   */
  async delete(id: string): Promise<void> {
    await this.eodLogRepository.repository.delete(id);
  }

  /**
   * Finds today's EODLog entry for a specific item.
   * @param itemId - The ID of the item.
   * @param currentDate - The current date in 'YYYY-MM-DD' format.
   * @returns The EODLog entry for today, if found.
   */
  async findTodayEOD(itemId: string, currentDate: string): Promise<EODLog> {
    return this.eodLogRepository.findTodayEOD(itemId, currentDate);
  }
}
