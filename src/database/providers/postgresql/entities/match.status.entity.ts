import { Status } from "src/providers/interfaces/events-list.interface";
import { Column, Entity, OneToOne } from "typeorm";
import { MatchEntity } from "./match.entity";

@Entity("match_status")
export class MatchStatusEntity implements Status {
    @Column({ type: "int", nullable: false })
    code: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    description: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    type: string;

    @OneToOne(() => MatchEntity, match => match.status, { nullable: false })
    match: MatchStatusEntity;
}
