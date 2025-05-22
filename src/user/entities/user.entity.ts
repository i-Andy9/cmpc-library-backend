import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  declare username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare email?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare resetToken: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare resetTokenExpires: Date | null;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'user' })
  declare role: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE })
  declare deletedAt: Date | null;
}
