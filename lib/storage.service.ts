import { Injectable, Inject } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { STORAGE_MODULE_OPTIONS } from './storage.constants';
import {
  StorageModuleConfig,
  StrategyInterface,
  StorageInterface,
  UploadFileFields,
} from './storage.interfaces';
import { STORAGE_KINDS } from './storage.constants';
import { getFileSystems } from './strategies';
import { plainToClass } from 'class-transformer';

type StorageClass<T> = new (service: StorageService) => T;

@Injectable()
export class StorageService {
  private config: StorageModuleConfig;
  private fileSystems: { [key: string]: StrategyInterface };
  constructor(
    @Inject(STORAGE_MODULE_OPTIONS)
    private readonly initialConfig: StorageModuleConfig,
  ) {
    this.config = {
      defaultFileSystem: "local",
      maxFileSize: 8000000,
      fileSystems: {
        local: {
          fileSystem: "local",
          strategy: STORAGE_KINDS.LOCAL,
          publicDir: 'public',
          destinationDir: 'storage',
          baseUrl: 'http://localhost',
        },
      },
      ...this.initialConfig,
    };
    this.fileSystems = getFileSystems(this.config);
  }

  getMulterConfig(fileSystem?: string): MulterModuleOptions {
    fileSystem = fileSystem || this.config.defaultFileSystem
    return {
      ...this.fileSystems[fileSystem].getMulterConfig(),
      limits: {
        fileSize: this.config.maxFileSize,
      },
    };
  }

  getStorageClassFromUploadedFile<T>(
    storageClass: StorageClass<T>,
    uploadFileFields: UploadFileFields | null,
  ): T | null | undefined {
    if (uploadFileFields) {
      const { fileSystem } = uploadFileFields;
      const classFields: StorageInterface = this.fileSystems[fileSystem].getStorageClassFieldsFromUploadedFile(
        uploadFileFields,
      ) as StorageInterface;
      return plainToClass(storageClass, classFields);
    } else if (uploadFileFields === null) {
      return null;
    }
  }

  async getPublicUrl(path: string, fileSystem: string): Promise<string> {
    return this.fileSystems[fileSystem].getPublicUrl(path);
  }
}
