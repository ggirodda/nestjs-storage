import { StorageFields, UploadFileFields } from '../storage.interfaces';

export abstract class BaseStrategy {
  protected config: any;
  constructor(config: any) {
    this.config = config;
  }

  getStorageClassFieldsFromUploadedFile(
    uploadFileFields: UploadFileFields,
  ): StorageFields {
    const { fieldname, originalname, mimetype, filename } = uploadFileFields;

    return {
      fieldname,
      originalname,
      mimetype,
      path: filename,
    };
  }
}
