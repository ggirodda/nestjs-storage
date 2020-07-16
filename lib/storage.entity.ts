import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { StorageInterface } from './storage.interfaces';

export class Storage implements StorageInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldname: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  path: string;

  url: string;
}
