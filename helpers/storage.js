const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const sharp = require('sharp');
const mkdirp = require('mkdirp');

const root = path.join(__dirname, '../storage');

module.exports = {

  get() {
    return {

      async save(file, folder, name) {
        return new Promise(async (resolve, reject) => {
          if (!file) return resolve();
          let filename = (name || uuid.v1()) + path.extname(file.name);
          let relativePath = folder ? folder + '/' + filename : filename;
          fs.copy(file.path, path.join(root, relativePath), (err) => {
            if (err) return reject(err);
            return resolve(relativePath);
          });
        });
      },

      async saveImage(file, folder, name, width, height) {
        return new Promise(async (resolve, reject) => {
          try {
            if (!file) return resolve();
            mkdirp.sync(path.join(root, folder));
            let filename = (name || uuid.v1()) + path.extname(file.name);
            let relativePath = folder ? folder + '/' + filename : filename;
            let fileDest = path.join(root, relativePath);
            let type = fileType(readChunk.sync(file.path, 0, fileType.minimumBytes));

            if (type.ext == 'jpg' || type.ext == 'jpeg') {
              await sharp(file.path)
                .resize({
                  fit: 'inside',
                  width,
                  height
                })
                .jpeg({
                  quality: 95,
                })
                .toFile(fileDest)
            } else if (type.ext == 'png') {
              await sharp(file.path)
                .resize({
                  fit: 'inside',
                  width,
                  height
                })
                .png({
                  quality: 95,
                })
                .toFile(fileDest)
            } else {
              return resolve();
            }

            return resolve(relativePath);
          } catch (err) {
            reject(err);
          }
        });
      },

      async replace(file, relativePath) {
        return new Promise(async (resolve, reject) => {
          if (!file || !relativePath) return resolve();
          let newRelativePath = relativePath.split('.').shift() + path.extname(file.name);
          fs.copy(file.path, path.join(root, newRelativePath), (err) => {
            if (err) return reject(err);
            if (relativePath != newRelativePath) fs.unlink(path.join(root, relativePath));
            return resolve(newRelativePath);
          });
        });
      },

      async replaceImage(file, relativePath, width, height) {
        return new Promise(async (resolve, reject) => {
          try {
            if (!file || !relativePath) return resolve();

            let newRelativePath = relativePath.split('.').shift() + path.extname(file.name);

            let fileDest = path.join(root, newRelativePath);
            let type = fileType(readChunk.sync(file.path, 0, fileType.minimumBytes));

            if (type.ext == 'jpg' || type.ext == 'jpeg') {
              await sharp(file.path)
                .resize({
                  fit: 'inside',
                  width,
                  height
                })
                .jpeg({
                  quality: 95,
                })
                .toFile(fileDest)
            } else if (type.ext == 'png') {
              await sharp(file.path)
                .resize({
                  fit: 'inside',
                  width,
                  height
                })
                .png({
                  quality: 95,
                })
                .toFile(fileDest)
            } else {
              return resolve();
            }

            return resolve(newRelativePath);
          } catch (err) {
            reject(err);
          }
        });
      },
      async delete(relativePath) {
        return new Promise(async (resolve, reject) => {
          if (!relativePath) return resolve();

          fs.unlink(path.join(root, relativePath), (err) => {
            if (err) return reject(err);

            resolve();
          });
        });
      }
    }
  },

};
