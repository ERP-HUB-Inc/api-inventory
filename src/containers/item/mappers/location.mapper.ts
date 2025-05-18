import { plainToInstance } from 'class-transformer';
import { LocationResponseDto, LocationUpdateDto } from '../dto';
import { Location } from '@item/entities/location.entity';

// Mapping: Create DTO → Entity
export function fromLocationCreateDtoToLocation(dto: LocationUpdateDto): Location {
  return plainToInstance(Location, dto, { excludeExtraneousValues: true });
}

// Mapping: Update DTO → Entity
export function fromLocationUpdateDtoToLocation(dto: LocationUpdateDto): Location {
  return plainToInstance(Location, dto, { excludeExtraneousValues: true });
}

// Mapping: Entity → Response DTO
export function fromLocationToLocationResponseDto(data: Location): LocationResponseDto {
  return plainToInstance(LocationResponseDto, data, {
    excludeExtraneousValues: true,
  });
}

// Mapping: Entity[] → Response DTO[]
export function fromLocationToLocationResponsesDto(data: Location[]): LocationResponseDto[] {
  return plainToInstance(LocationResponseDto, data, {
    excludeExtraneousValues: true,
  });
}