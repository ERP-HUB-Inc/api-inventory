import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Brand } from "@entities/item/bran.entity";

@Injectable()
export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    public readonly repository: Repository<Brand>
  ) {}
}
