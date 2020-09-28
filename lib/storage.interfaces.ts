import { ModuleMetadata } from '@nestjs/common/interfaces';
import { MulterModuleOptions } from '@nestjs/platform-express';

export interface StorageModuleFileSystemBaseConfig {
  strategy: string;
  fileSystem?: string;
}

export interface StorageModuleAzureConfig extends StorageModuleFileSystemBaseConfig {
  connectionString: string;
  container: string;
  sasTime?: number;
  isPublic?: boolean;
}

export interface StorageModuleLocalConfig extends StorageModuleFileSystemBaseConfig {
  baseUrl: string;
  publicDir: string;
  destinationDir: string;
}

export type StorageModuleFileSystemConfig = StorageModuleLocalConfig | StorageModuleAzureConfig

export interface StorageModuleFileSystemConfigMap { [key: string]: StorageModuleFileSystemConfig; }

export interface StorageModuleConfig {
  defaultFileSystem?: string;
  maxFileSize?: number;
  fileSystems?: StorageModuleFileSystemConfigMap
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
  fileSystem: string;
  path?: string;
  filename?: string;
}

export interface StorageFields {
  fieldname: string;
  originalname: string;
  mimetype: string;
  path: string;
  fileSystem: string;
}

export interface StorageInterface extends StorageFields {
  url: string;
}

export interface StrategyInterface {
  getPublicUrl: (path: string) => Promise<string>;
  getMulterConfig: () => MulterModuleOptions;
  getStorageClassFieldsFromUploadedFile: (
    fields: UploadFileFields,
  ) => StorageFields;
}

export interface StorageModuleFileSystemStrategyMap { [key: string]: StrategyInterface; }

export interface MulterInterface {
  _handleFile: (req: any, file: any, cb: any) => void;
  _removeFile: (req: any, file: any, cb: any) => void;
}
