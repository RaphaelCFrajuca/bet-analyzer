import { Column, Entity } from "typeorm";

@Entity("auth")
export class Auth {
    @Column({ type: "uuid", primary: true, generated: true, nullable: false })
    id: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    username: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password: string;
}
