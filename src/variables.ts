import fs from 'fs';
import readline from 'readline';
import events from 'events';

/**
 * const, let으로 시작되는 변수
 * 화살표 함수는 제외!
 */
const variableRegExp = new RegExp(/(const\s|let\s)(\w*)([\s]?=\s[^f|\(])/);
async function extractVariables(path: string) {
  const variableSet = new Set<string>();
  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity,
  });
  rl.on('line', (line) => {
    const variable = variableRegExp.exec(line);
    variable && variableSet.add(variable[2]);
    variable && variable[2] === 'onScroll' && console.log('@@@@@@', path);
  });

  await events.once(rl, 'close');
  return variableSet;
}

export async function getVariables(filePaths: string[]) {
  const variablesIncludeDuplicates = (
    await Promise.all(filePaths.map((path) => extractVariables(path)))
  ).reduce<string[]>((variabeArr, curr) => [...variabeArr, ...curr], []);

  return [...new Set(variablesIncludeDuplicates)].sort();
}
