import express from 'express';
import chalk   from 'chalk';
import path    from 'path';
import fs      from 'fs';
import uuidv4  from 'uuid/v4';

// Helpers
import fileHelper from './helpers/fileHelper';

import config  from './config';

const app = express();

app.use('/', express.static(path.resolve('src/public')));

/**
 * Route serving home
 * @name get/root
 */
app.get('/', (req, res) => {
  res.send({
    message: 'LP Factory 0.1'
  });
});

/**
 * Route serving building html file
 * @name get/build
 * @params components (array)
 */
app.get('/build', (req, res) => {
  const files = [];
  const reqArray = req.query.components.split(',');

  reqArray.forEach(component => {
    files.push(path.resolve(`src/components/${component}.html`));
  });

  // Head and end of file
  files.unshift(path.resolve('src/components/head.html'));
  files.push(path.resolve('src/components/end.html'));

  // Read files async
  fileHelper.readFiles(files).then(htmlArray => {
    const mergedHtml = htmlArray.join('');
    const uuid = uuidv4();

    // Write a new directory based on timestamp
    fs.mkdir(path.resolve(`src/public/${uuid}`), err => {
      if (err) {
        throw err;
      }

      const pathToFile = path.resolve(`src/public/${uuid}/index.html`);

      // Write a new file with merged html
      fs.writeFile(pathToFile, mergedHtml, (err, data) => {
        if (err) {
          throw err;
        }

        // Download new file
        res.download(pathToFile, 'index.html', err => {
          if (err) {
            throw err;
          }
        });
      });

    });

  });
});

app.listen(process.env.PORT || config.PORT, () => {
  const log = console.log;
  log('\n');
  log(chalk.bgGreen.black(`Server listening on http://localhost:${config.PORT}/ ..`));
  log('\n');
});

export default app;
