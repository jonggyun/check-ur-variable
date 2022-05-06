import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

import { getVariables } from './variables';
import { getFunctionNames } from './functions';
import { countingPrefix, countingWord } from './count';

const DIR_PATH = path.resolve(__dirname, '../target/react');

async function createFile(path: string, data: any) {
  console.time(`create ${path}`);
  await fsPromise.writeFile(path, JSON.stringify(data, null, 2));
  console.timeEnd(`create ${path}`);
}

function getFiles() {
  const files: string[] = [];
  const findFiles = (path: string) => {
    fs.readdirSync(path, 'utf-8').forEach((dir) => {
      const currentDir = `${path}/${dir}`;
      if (fs.statSync(currentDir).isDirectory()) {
        findFiles(currentDir);
      } else {
        if (
          !/test|node_modules/i.test(currentDir) &&
          /\.[j|t]sx?$/.test(currentDir)
        ) {
          files.push(currentDir);
        }
      }
    });
  };

  findFiles(DIR_PATH);

  return files;
}

(async function () {
  const filePaths: string[] = getFiles();
  createFile('result/target_files.txt', filePaths);

  const variables = await getVariables(filePaths);
  createFile('result/variables.txt', variables);
  const variablePrefixes = countingPrefix(variables);
  createFile('result/variables_prefixes.txt', variablePrefixes);

  const functionNames = await getFunctionNames(filePaths);
  createFile('result/functions.txt', functionNames);
  const functionPrefixes = countingPrefix(functionNames);
  createFile('result/functions_prefixes.txt', functionPrefixes);

  const allNames = new Set([...variables, ...functionNames]);
  const words = countingWord([...allNames]);
  createFile('result/words.txt', words);
})();
