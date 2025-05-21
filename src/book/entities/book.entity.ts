import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'books', paranoid: true })
export class Book extends Model<Book> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare author: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare publisher: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare available: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  declare genre: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare imageUrl: string;

  @DeletedAt
  declare deletedAt: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
