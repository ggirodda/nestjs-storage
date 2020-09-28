import { StorageEngine } from 'multer';
import { getStorage } from '../multers/local.multer';
import {
  StrategyInterface,
  StorageModuleLocalConfig,
} from '../storage.interfaces';
import { BaseStrategy } from './base.strategy';

export class LocalStrategy extends BaseStrategy implements StrategyInterface {
  protected config: StorageModuleLocalConfig;
  constructor(config: StorageModuleLocalConfig) {
    super(config);
  }

  async getPublicUrl(path: string): Promise<string> {
    return `${this.config.baseUrl}/${this.config.destinationDir}/${path}`;
  }

  getMulterConfig(): { storage: StorageEngine } {
    return {
      storage: getStorage({
        destination: `${this.config.publicDir}/${this.config.destinationDir}`,
        fileSystem: this.config.fileSystem,
      }),
    };
  }
}
