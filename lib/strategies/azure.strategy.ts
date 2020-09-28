import { StorageEngine } from 'multer';
import azure from 'azure-storage';
import { getStorage } from '../multers/azure.multer';
import {
  StrategyInterface,
  StorageModuleAzureConfig,
  StorageFields,
  UploadFileFields
} from '../storage.interfaces';
import { BaseStrategy } from './base.strategy';

export class AzureStrategy extends BaseStrategy implements StrategyInterface {
  protected config: StorageModuleAzureConfig;
  constructor(initialConfig: StorageModuleAzureConfig) {
    initialConfig = { sasTime: 100, isPublic: false, ...initialConfig };
    super(initialConfig);
  }
  async getPublicUrl(path: string): Promise<string> {

    const blobService = azure.createBlobService();
    let token;

    if (!this.config.isPublic) {
      const startDate = new Date();
      const expiryDate = new Date(startDate);
      const sasTime = this.config.sasTime;
      expiryDate.setMinutes(startDate.getMinutes() + sasTime);
      startDate.setMinutes(startDate.getMinutes() - sasTime);

      const sharedAccessPolicy = {
        AccessPolicy: {
          Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
          Start: startDate,
          Expiry: expiryDate
        },
      };

      token = blobService.generateSharedAccessSignature(
        this.config.container,
        path,
        sharedAccessPolicy,
      );
    }
    return blobService.getUrl(this.config.container, path, token);
  }

  getMulterConfig(): { storage: StorageEngine } {
    return {
      storage: getStorage({
        connectionString: this.config.connectionString,
        container: this.config.container,
        isPublic: this.config.isPublic,
        fileSystem: this.config.fileSystem,
      }),
    };
  }

  getStorageClassFieldsFromUploadedFile(
    uploadFileFields: UploadFileFields,
  ): StorageFields {
    const {
      fieldname,
      originalname,
      mimetype,
      path,
      fileSystem,
    } = uploadFileFields;

    return {
      fieldname,
      originalname,
      mimetype,
      path,
      fileSystem,
    };
  }
}
