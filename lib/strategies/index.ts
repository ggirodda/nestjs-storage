import { STORAGE_KINDS } from '../storage.constants';
import { LocalStrategy } from './local.strategy';
import { AzureStrategy } from './azure.strategy';
import {
  StorageModuleConfig,
  StorageModuleFileSystemConfig,
  StorageModuleFileSystemStrategyMap,
  StorageModuleAzureConfig,
  StorageModuleLocalConfig
} from '../storage.interfaces';

export const getFileSystems = (config: StorageModuleConfig): StorageModuleFileSystemStrategyMap => {
  return Object.keys(config.fileSystems).reduce((fileSystems, key) => {
    const fileSystemConfig: StorageModuleFileSystemConfig = config.fileSystems[key];
    switch (fileSystemConfig.strategy) {
      case STORAGE_KINDS.AZURE:
        fileSystems[key] = new AzureStrategy({ ...fileSystemConfig, fileSystem: key } as StorageModuleAzureConfig);
        break;
      case STORAGE_KINDS.LOCAL:
      default:
        fileSystems[key] = new LocalStrategy({ ...fileSystemConfig, fileSystem: key } as StorageModuleLocalConfig);
    }
    return fileSystems
  }, {});
};
