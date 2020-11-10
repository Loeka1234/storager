import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../transformers/ColumnNumericTransformer";
import { File } from "./File";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	username!: string;

	@Column()
	password!: string;

	@Column({
		default: 0,
		nullable: false,
		type: "decimal",
		scale: 3,
		transformer: new ColumnNumericTransformer(),
	}) // Used storage in KB
	usedStorage!: number;

	@Column({ default: 5000000, nullable: false }) // Max storage in KB
	maxStorage!: number;

	@OneToMany(() => File, file => file.user)
	files: File[];
}
