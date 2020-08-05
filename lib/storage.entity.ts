import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { StorageInterface } from './storage.interfaces';

export class Storage implements StorageInterface {
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'picture',
    description: 'file fieldname',
    type: String
  })
  @Column()
  fieldname: string;

  @ApiProperty({
    example: 'picture.ong',
    description: 'file originalname',
    type: String
  })
  @Column()
  originalname: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'file mime type',
    type: String
  })
  @Column()
  mimetype: string;

  @ApiProperty({
    example: 'folder/6f329ad89bf8fd44f5dd541674dcbf52.png',
    description: 'file path',
    type: String
  })
  @Column()
  path: string;

  @ApiProperty({
    example: 'http://somedomain.com/folder/6f329ad89bf8fd44f5dd541674dcbf52.png',
    description: 'file publiic url',
    type: String
  })
  url: string;
}
