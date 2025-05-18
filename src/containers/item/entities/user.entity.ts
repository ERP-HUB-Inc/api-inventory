import {
    Entity,
    Column
} from "typeorm";
import { BaseEntity } from "@common/entities/base.entity";

@Entity("User")
export class User extends BaseEntity {
    constructor(
        fullName?: string,
        userName?: string,
        password?: string,
        clientId?: string,
        description?: string,
        isMustChangePW?: number,
        isCanNotChangePW?: number,
        isMustChangePWNextLogin?: number
    ) {
        super();
        this.fullName = fullName;
        this.userName = userName;
        this.clientId = clientId;
        this.password = password;
        this.description = description;
        this.isMustChangePW = isMustChangePW;
        this.isCanNotChangePW = isCanNotChangePW;
        this.isMustChangePWNextLogin = isMustChangePWNextLogin;
    }

    static DEFAULT_PASSWORD = "default";

    @Column()
    userName: string;

    @Column()
    fullName: string;

    @Column({ default: 0 })
    isOnLine: number;

    @Column()
    clientId: string;

    @Column()
    password: string;

    @Column()
    telegramUserName: string;

    @Column()
    telegramChatId: string;

    @Column()
    description: string;

    @Column()
    isAllowEditPrice: number;

    @Column()
    isMustChangePW: number;

    @Column()
    isCanNotChangePW: number;

    @Column()
    isMustChangePWNextLogin: number;

    @Column()
    passwordExpiredAt: Date;

    @Column()
    isPasswordExpired: number;

    @Column()
    isFullAccess: number;

    @Column()
    isSystem: number;

    @Column()
    locationId: string;
}