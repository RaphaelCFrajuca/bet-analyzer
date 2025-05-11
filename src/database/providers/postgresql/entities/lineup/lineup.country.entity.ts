import { Country } from "src/providers/interfaces/lineup.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("lineup_country")
export class LineupCountryEntity implements Country {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "varchar", length: 3, nullable: false })
    alpha2: string;

    @Column({ type: "varchar", length: 3, nullable: false })
    alpha3: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    slug: string;
}
