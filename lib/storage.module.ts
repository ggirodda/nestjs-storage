import { Module, DynamicModule, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { STORAGE_MODULE_OPTIONS } from './storage.constants';
import { StorageModuleAsyncOptions } from './storage.interfaces';
import { StorageSubscriber } from './storage.subscriber';

@Global()
@Module({
  providers: [StorageService, StorageSubscriber],
  exports: [StorageService],
})
export class StorageModule {
  static registerAsync(options: StorageModuleAsyncOptions): DynamicModule {
    return {
      module: StorageModule,
      imports: options.imports,
      providers: [
        {
          provide: STORAGE_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      exports: [STORAGE_MODULE_OPTIONS],
    };
  }
}
