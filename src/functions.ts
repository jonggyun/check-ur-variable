import fs from 'fs';
import readline from 'readline';
import events from 'events';

const arrowFunctionRegExp = new RegExp(/(const\s|let\s)([a-z]\w*)(.*=>)/);
const declarationRegExp = new RegExp(/(function\s)([a-z]\w*)/);
const expressionRegExp = new RegExp(
  /(const\s|let\s)([a-z]\w*)(.*=\s?function)/,
);
async function extractFunctions(path: string) {
  const functionNameSet = new Set<string>();
  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });
  rl.on('line', (line) => {
    const arrowFunction = arrowFunctionRegExp.exec(line);
    arrowFunction && functionNameSet.add(arrowFunction[2]);

    const declaration = declarationRegExp.exec(line);
    declaration && functionNameSet.add(declaration[2]);

    const expression = expressionRegExp.exec(line);
    expression && functionNameSet.add(expression[2]);
  });

  await events.once(rl, 'close');

  return functionNameSet;
}

export async function getFunctionNames(filePaths: string[]) {
  const variablesIncludeDuplicates = (
    await Promise.all(filePaths.map((path) => extractFunctions(path)))
  ).reduce<string[]>((variabeArr, curr) => [...variabeArr, ...curr], []);

  return [...new Set(variablesIncludeDuplicates)].sort();
}
