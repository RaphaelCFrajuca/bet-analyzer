import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("auth")
export class Auth {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    username: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password: string;
}
