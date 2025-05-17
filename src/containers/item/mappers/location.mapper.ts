import { plainToInstance } from "class-transformer";
import { LocationResponseDto, LocationUpdateDto } from "../dto/LocationDto";
import Location from "../../../core/setting/models/Location";

export function fromLocationCreateDtoToLocation(dto: LocationUpdateDto): Location {
    return plainToInstance(Location, dto, { excludeExtraneousValues: true })
}

export function fromLocationUpdateDtoToLocation(dto: LocationUpdateDto): Location {
    return plainToInstance(Location, dto, { excludeExtraneousValues: true })
}

export function fromLocationToLocationResponseDto(data: Location): LocationResponseDto {
    return plainToInstance(LocationResponseDto, data, { excludeExtraneousValues: true })
}

export function fromLocationToLocationResponsesDto(data: Location[]): LocationResponseDto[] {
    return plainToInstance(LocationResponseDto, data, { excludeExtraneousValues: true })
}