import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType, registerEnumType, Root } from "type-graphql";

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

    @Field(() => userRoles)
    @Column({
        type: "text",
        enum: [TEACHER, STUDENT],
    })
    target: userRoles;

    @Column() password: string;

    @Field() name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }
}
