import * as crypto from 'crypto';
import * as fs from 'fs';
import * as fsPath from 'path';
import * as mimeTypes from 'mime-types';

const walk = function (path: string, newFiles?: string[]) {
  let files = newFiles || [];
  fs.readdirSync(path).forEach(file => {
    const absPath = fsPath.join(path, file);
    if (fs.statSync(absPath).isDirectory()) {
      files = walk(absPath, files);
    } else {
      files.push(absPath);
    }
  });
  return files;
};

export const DEFAULT_LOCALIZATION_PATH_FORMAT = '/:locale/:path';

export interface ManifestFile {
  hash: string;
  path: string;
  mimetype: string;
  cleanPath: string;
}

export interface Redirect {
  from: string;
  to: string;
  permanent?: boolean;
}

interface GitAuthor {
  email: string;
  name: string;
}

export interface Commit {
  message: string;
  author: GitAuthor;
}

export interface SerializedManifest {
  site: string;
  ref: string;
  branch?: string;
  paths: Record<string, string>;
  redirects: Redirect[];
  shortSha: string;
  modified: string;
  redirectTrailingSlashes: boolean;
  localizationPathFormat: string;
  headers: Record<string, Record<string, string>>;
  commit: Commit;
}

export class Manifest {
  site: string;
  ref: string;
  branch: string;
  files: ManifestFile[];
  redirects: Redirect[];
  shortSha: string;
  redirectTrailingSlashes: boolean;
  localizationPathFormat: string;
  headers: Record<string, Record<string, string>>;
  commit: Commit;

  constructor(site: string, ref: string, branch: string, commit: Commit) {
    this.files = [];
    this.redirects = [];
    this.site = site;
    this.ref = ref;
    this.shortSha = ref.slice(0, 7);
    this.branch = branch;
    this.redirectTrailingSlashes = true;
    this.localizationPathFormat = DEFAULT_LOCALIZATION_PATH_FORMAT;
    this.headers = {};
    this.commit = commit;
  }

  async createFromDirectory(path: string) {
    const paths = walk(path);
    paths.forEach(filePath => {
      this.addFile(filePath, path);
    });
  }

  setHeaders(headers: Record<string, Record<string, string>>) {
    Object.assign(this.headers, headers);
  }

  setRedirects(redirects: Redirect[]) {
    this.redirects = redirects;
  }

  createHash(path: string) {
    const contents = fs.readFileSync(path);
    const hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    hash.write(contents);
    hash.end();
    return hash.read();
  }

  async addFile(path: string, dir: string) {
    const hash = this.createHash(path);
    // Normalize the upload by lowercasing all paths.
    const cleanPath = path
      .replace(dir.replace(/^\\+|\\+$/g, ''), '/')
      .replace('//', '/')
      .toLowerCase();
    const manifestFile: ManifestFile = {
      cleanPath: cleanPath,
      hash: hash,
      mimetype: mimeTypes.lookup(path) || 'application/octet-stream',
      path: path,
    };
    this.files.push(manifestFile);
  }

  async addRedirect(from: string, to: string, permanent: boolean) {
    const redirect: Redirect = {
      from: from,
      to: to,
      permanent: permanent,
    };
    this.redirects.push(redirect);
  }

  pathsToJSON() {
    const pathsToHashes: any = {};
    this.files.forEach(file => {
      pathsToHashes[file.cleanPath] = file.hash;
    });
    return pathsToHashes;
  }
}
