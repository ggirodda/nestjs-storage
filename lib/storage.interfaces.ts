import { ModuleMetadata } from '@nestjs/common/interfaces';
import { MulterModuleOptions } from '@nestjs/platform-express';

export interface StorageModuleAzureConfig {
  connectionString: string;
  container: string;
  sasTime?: string;
}
export interface StorageModuleLocalConfig {
  baseUrl: string;
  publicDir: string;
  destinationDir: string;
}

export interface StorageModuleConfig {
  fileSystem?: string;
  maxFileSize?: string;
  local?: StorageModuleLocalConfig;
  azure?: StorageModuleAzureConfig;
}

export interface StorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<StorageModuleConfig> | StorageModuleConfig;
  inject?: any[];
}

export interface UploadFileFields {
  fieldname: string;
  originalname: string;
  mimetype: string;
  path?: string;
  filename?: string;
}

export interface StorageFields {
  fieldname: string;
  originalname: string;
  mimetype: string;
  path: string;
}

export interface StorageInterface extends StorageFields {
  url: string;
}

export interface StrategyInterface {
  generateSharedAccessSignature: (blobName: string) => Promise<string>;
  getMulterConfig: () => MulterModuleOptions;
  getStorageClassFieldsFromUploadedFile: (
    fields: UploadFileFields,
  ) => StorageFields;
}

export interface MulterInterface {
  _handleFile: (req: any, file: any, cb: any) => void;
  _removeFile: (req: any, file: any, cb: any) => void;
}
