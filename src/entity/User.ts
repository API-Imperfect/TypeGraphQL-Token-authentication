import {
    BaseEntity,
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType, Root } from "type-graphql";
import bcrypt from "bcryptjs";

export enum userRoles {
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
}

registerEnumType(userRoles, {
    name: "userRoles", // this one is mandatory
    description: "User roles Director or astronaut", // this one is optional
});

const TEACHER = "TEACHER";
const STUDENT = "STUDENT";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID) @PrimaryGeneratedColumn("uuid") id: string;

    @Field() @Column("text") firstName: string;

    @Field() @Column("text") lastName: string;

    @Field()
    @Index({ unique: true })
    @Column({
        unique: true,
        nullable: false,
    })
    email: string;

    @Field(() => userRoles)
    @Column({
        type: "text",
        enum: [TEACHER, STUDENT],
        default:userRoles.STUDENT,
    })
    roles: userRoles;

    @Column() password: string;

    @Column("bool", {default:false}) confirmed: boolean;

    @Column("int", { default: 0 }) tokenVersion: number;

    @Field() @CreateDateColumn({ name: "created_at" }) createdAt: Date;
    @Field() @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;
    @Field() @DeleteDateColumn({ name: "deleted_at"}) deleted_at?: Date;

    @Field() name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;

    }

    private static hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    public comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    @BeforeInsert() @BeforeUpdate()
    async savePassword(): Promise<void> {
        if (this.password) {
            this.password = await User.hashPassword(this.password);
        }
    }
}
