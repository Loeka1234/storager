import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../transformers/ColumnNumericTransformer";
import { User } from "./User";

@Entity()
export class File extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({ nullable: false, unique: true })
	fileName!: string;

	@Column({ nullable: false })
	realName!: string;

	@Column({ nullable: false })
	mimeType!: string;

	@Column({ nullable: false })
	path!: string;

	@Column({
		nullable: false,
		type: "decimal",
		scale: 3,
		transformer: new ColumnNumericTransformer(),
	}) // Size in KB
	size!: number;

	@ManyToOne(() => User, user => user.files, { nullable: false })
	user!: User;
}
