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
import { getStrategy } from './strategies';
import { plainToClass } from 'class-transformer';

type StorageClass<T> = new (service: StorageService) => T;

@Injectable()
export class StorageService {
  private config: StorageModuleConfig;
  private strategy: StrategyInterface;
  constructor(
    @Inject(STORAGE_MODULE_OPTIONS)
    private readonly initialConfig: StorageModuleConfig,
  ) {
    this.config = {
      fileSystem: STORAGE_KINDS.LOCAL,
      maxFileSize: '8000000',
      local: {
        publicDir: 'public',
        destinationDir: 'storage',
        baseUrl: 'http://localhost',
      },
      ...this.initialConfig,
    };
    this.strategy = getStrategy(this.config);
  }

  getMulterConfig(): MulterModuleOptions {
    return {
      ...this.strategy.getMulterConfig(),
      limits: {
        fileSize: parseInt(this.config.maxFileSize),
      },
    };
  }

  getStorageClassFromUploadedFile<T>(
    storageClass: StorageClass<T>,
    uploadFileFields: UploadFileFields | null,
  ): T | null | undefined {
    if (uploadFileFields) {
      const classFields: StorageInterface = this.strategy.getStorageClassFieldsFromUploadedFile(
        uploadFileFields,
      ) as StorageInterface;
      return plainToClass(storageClass, classFields);
    } else if (uploadFileFields === null) {
      return null;
    }
  }

  async replaceBySasUrl(path: string): Promise<string> {
    return this.strategy.generateSharedAccessSignature(path);
  }
}
