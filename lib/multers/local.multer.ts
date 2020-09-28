import fs from 'fs';
import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp';

import { StorageEngine } from 'multer';
import { getFilename } from './utils';

interface StorageOptions {
  fileSystem: string;
  destination: string | CallableFunction;
  fileName?: CallableFunction;
}

function getDestination(req, file, cb) {
  cb(null, os.tmpdir())
}

export class DiskStorage implements StorageEngine {
  private getFilename: CallableFunction;
  private fileSystem: string;
  private getDestination: CallableFunction;

  constructor(opts: StorageOptions) {
    this.getFilename = opts.fileName || getFilename
    this.fileSystem = opts.fileSystem

    if (typeof opts.destination === 'string') {
      mkdirp.sync(opts.destination)
      this.getDestination = ($0, $1, cb) => { cb(null, opts.destination) }
    } else {
      this.getDestination = (opts.destination || getDestination)
    }
  }
  public _handleFile(req: any, file: any, cb: any): void {
    this.getDestination(req, file, (err, destination) => {
      if (err) return cb(err)

      this.getFilename(req, file, (err, filename) => {
        if (err) return cb(err)

        const finalPath = path.join(destination, filename)
        const outStream = fs.createWriteStream(finalPath)

        file.stream.pipe(outStream)
        outStream.on('error', cb)
        outStream.on('finish', () => {
          cb(null, {
            destination: destination,
            filename: filename,
            path: finalPath,
            size: outStream.bytesWritten,
            fileSystem: this.fileSystem
          })
        })
      })
    })
  }

  public _removeFile(req: any, file: any, cb: any): void {
    const path = file.path

    delete file.destination
    delete file.filename
    delete file.path

    fs.unlink(path, cb)
  }
}


export function getStorage(opts: StorageOptions): StorageEngine {
  return new DiskStorage(opts);
}
