import { StorageEngine } from 'multer';
import azure from 'azure-storage';
import { getStorage } from '../multers/azure.multer';
import {
  StrategyInterface,
  StorageModuleAzureConfig,
  StorageFields,
  UploadFileFields,
} from '../storage.interfaces';
import { BaseStrategy } from './base.strategy';

export class AzureStrategy extends BaseStrategy implements StrategyInterface {
  protected config: StorageModuleAzureConfig;
  constructor(initialConfig: StorageModuleAzureConfig) {
    initialConfig = { sasTime: '100', ...initialConfig };
    super(initialConfig);
  }
  async generateSharedAccessSignature(blobName: string): Promise<string> {
    const blobService = azure.createBlobService();

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    const sasTime = parseInt(this.config.sasTime);
    expiryDate.setMinutes(startDate.getMinutes() + sasTime);
    startDate.setMinutes(startDate.getMinutes() - sasTime);

    const sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate
      },
    };

    const token = blobService.generateSharedAccessSignature(
      this.config.container,
      blobName,
      sharedAccessPolicy,
    );
    return blobService.getUrl(this.config.container, blobName, token);
  }

  getMulterConfig(): { storage: StorageEngine } {
    return {
      storage: getStorage({
        connectionString: this.config.connectionString,
        container: this.config.container,
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
    } = uploadFileFields;

    return {
      fieldname,
      originalname,
      mimetype,
      path,
    };
  }
}
