import crypto from 'crypto';
export function getFilename(
  req: any,
  file: { originalname: string },
  cb: (error: any | undefined, path: string | undefined) => void,
): void {
  const extRule = /(?:\.([^.]+))?$/;
  const ext = extRule.exec(file.originalname)[1];

  crypto.randomBytes(16, function (err, raw) {
    cb(err, err ? undefined : `${raw.toString('hex')}.${ext}`);
  });
}
