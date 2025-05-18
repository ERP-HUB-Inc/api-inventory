export abstract class BaseMapper<E, D> {
    abstract toDto(entity: E): D;

    toDtoMany(entities: E[]): D[] {
      return entities.map((entity) => this.toDto(entity));
    }
}
