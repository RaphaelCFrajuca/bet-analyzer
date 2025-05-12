import { Status } from "src/providers/interfaces/events-list.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("match_status")
export class MatchStatusEntity implements Status {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "int", nullable: false })
    code: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    description: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    type: string;
}
