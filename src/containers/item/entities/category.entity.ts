import {
    Column,
    Entity,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Expose } from "class-transformer";
import Product from "./Product";
import Model from "../../../core/common/models/Model";
import TransactionEntry from "../../../sales/transaction/models/TransactionEntry";

@Entity("Category")
export default class Category extends Model {

    @Column()
    clientId: string;

    @Column()
    @Expose()
    parentId: string;
    
    @Column()
    @Expose()
    name: string;

    @Column()
    @Expose()
    namekm: string;

    @Column()
    @Expose()
    namebm: string;

    @Column()
    @Expose()
    image: string;

    @Column()
    @Expose()
    description: string;

    @Column()
    @Expose()
    label: string;

    @Column({ type: "boolean" })
    @Expose()
    isDefault: boolean;

    @Column()
    @Expose()
    isFeature: boolean;

    @OneToMany(() => Category, children => children.parent)
    children: Category[];

    @ManyToOne(() => Category, parent => parent.children)
    @Expose()
    parent: Category;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @OneToMany(() => TransactionEntry, transactionEntry => transactionEntry.category)
    transactionEntries: TransactionEntry[];
}
