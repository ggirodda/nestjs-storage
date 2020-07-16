import { STORAGE_KINDS } from '../storage.constants';
import { LocalStrategy } from './local.strategy';
import { AzureStrategy } from './azure.strategy';
import { StorageModuleConfig, StrategyInterface } from '../storage.interfaces';

export const getStrategy = (config: StorageModuleConfig): StrategyInterface => {
  switch (config.fileSystem) {
    case STORAGE_KINDS.AZURE:
      return new AzureStrategy(config[STORAGE_KINDS.AZURE]);
    case STORAGE_KINDS.LOCAL:
    default:
      return new LocalStrategy(config[STORAGE_KINDS.LOCAL]);
  }
};
