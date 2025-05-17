import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Tag from "../entities/Tag";
import { RecordStatus } from "../../../core/setting/enums";

@EntityRepository(Tag)
export default class TagRepository extends BaseRepository<Tag> {

    entityName: string = "Tag";

    selectField: string[] = [
        "id",
        "tag",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }

    async create(data: Tag, columnCheckExist?: Object): Promise<Tag> {
        this.clientId = data["clientId"];
        if (this.clientId == null) {
            console.log("\x1b[31m", "=======You now created record by have not indentify with clientID========");
        }

        console.log("NNNNNNNNN", data["tag"])
        if (data["tag"] != null || data["tag"] != "") {
            var tag = await this.findOneByFieldName({ tag: data['tag'] });
            console.log("TTTTTTTT", tag)
            if (tag != null) {
                if (tag.status == RecordStatus.Archive) {
                    tag.status = RecordStatus.Active
                    tag = await this.connection.manager.save(this.entityName, data);
                }

                return tag
            }
        }

        return super.create(data);
    }
}