import { diskStorage, StorageEngine, DiskStorageOptions } from 'multer';
import { getFilename } from './utils';

export function getStorage(opts: DiskStorageOptions): StorageEngine {
  opts.filename = opts.filename || getFilename;
  return diskStorage(opts);
}
