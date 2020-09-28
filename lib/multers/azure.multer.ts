import azure from 'azure-storage';
import { StorageEngine } from 'multer';
import { getFilename } from './utils';

type BlobPathResolver = (
  req: any,
  file: any,
  cb?: (error: any, path: string) => void,
) => void;

interface StorageOptionsConnString {
  connectionString: string;
  account?: never;
  key?: never;
  container: string;
  isPublic: boolean;
  fileSystem: string;
  pathResolver?: BlobPathResolver;
}

interface StorageOptionsAcconutKey {
  connectionString?: never;
  account: string;
  key: string;
  container: string;
  isPublic: boolean;
  fileSystem: string;
  pathResolver?: BlobPathResolver;
}

export type StorageOptions =
  | StorageOptionsConnString
  | StorageOptionsAcconutKey;

export class AzureMulter implements StorageEngine {
  private container: string;
  private blobSvc: azure.BlobService;
  private isPublic: boolean;
  private fileSystem: string;
  private pathResolver: (
    req: any,
    file: any,
    cb: (error: any, path: string) => void,
  ) => void;
  private error: any;
  //Creates a new service to interact with azure blob storage
  constructor(opts: StorageOptions) {
    this.container = opts.container;
    this.blobSvc = opts.connectionString
      ? azure.createBlobService(opts.connectionString)
      : azure.createBlobService(opts.account, opts.key);
    this.isPublic = opts.isPublic;
    this.fileSystem = opts.fileSystem;
    this.error = null;
    this.createContainer(this.container);
    this.pathResolver = opts.pathResolver || getFilename;
  }

  //This creates the container if one doesn't exist
  private createContainer(name: string) {
    const publicAccessLevel = this.isPublic ? "container" : "private"
    const options = { publicAccessLevel }
    this.blobSvc.createContainerIfNotExists(name, options, (error) => {
      if (error) {
        this.error = error;
      }
    });
  }

  // actual upload function, will wait for pathResolver callback before upload.
  private uploadToBlob(file: any, cb: any) {
    return (something: any, path: string) => {
      const blobStream = this.blobSvc.createWriteStreamToBlockBlob(
        this.container,
        path,
        function (error) {
          if (error) {
            cb(error);
          }
        },
      );
      file.stream.pipe(blobStream);
      blobStream.on('close', () => {
        const fileClone = JSON.parse(JSON.stringify(file));
        fileClone.fileSystem = this.fileSystem;
        fileClone.path = path;
        cb(null, fileClone);
      });
      blobStream.on('error', function (error) {
        cb(error);
      });
    };
  }

  //Handles the files delivered from Multer and sends them to Azure Blob storage. _handleFile is a required function for multer storage engines
  public _handleFile(req: any, file: any, cb: any): void {
    if (this.error) {
      cb(this.error);
    } else {
      this.pathResolver(req, file, this.uploadToBlob(file, cb));
    }
  }

  //Removes files for Multer when it chooses to. _removeFile is a required function for multer storage engines
  public _removeFile(req: any, file: any, cb: any): void {
    this.blobSvc.deleteBlob(this.container, file.filename, cb);
  }
}

export function getStorage(opts: StorageOptions): StorageEngine {
  return new AzureMulter(opts);
}
