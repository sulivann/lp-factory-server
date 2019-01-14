import fs      from 'fs';
import promise from 'bluebird';

const fsPromisify = promise.promisifyAll(fs);

const fileHelper = {};

/**
 * Read all files and return array of each content
 */
fileHelper.readFiles = files => {
  let promises = [];

  files.forEach(file => {
    if (file.match(/\.html$/)) {
      promises.push(fsPromisify.readFileAsync(file, 'utf8'));
    };
  });

  return Promise.all(promises);
}

export default fileHelper;
