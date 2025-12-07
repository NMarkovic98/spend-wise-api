import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password_hash!: string;

  @Column({ nullable: true })
  fullname!: string;

  @Column({ nullable: true })
  google_id!: string;

  @CreateDateColumn()
  created_at!: Date;
}
