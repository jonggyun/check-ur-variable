/**
 * 변수에서 사용하는 prefix의 빈도수를 확인
 */

export function countingPrefix(variables: string[]) {
  const countVariableObject = variables.reduce<Record<string, number>>(
    (acc, cur) => {
      let prefix: string = '';
      if (cur.includes('_')) {
        prefix = cur.split(/_/)[0];
      } else {
        prefix = cur.split(/(?=[A-Z])/)[0];
      }
      if (prefix.length <= 1) {
        return acc;
      }
      const lowerCasePrefix = prefix.toLowerCase();
      return {
        ...acc,
        [lowerCasePrefix]: acc[lowerCasePrefix] ? acc[lowerCasePrefix] + 1 : 1,
      };
    },
    {},
  );

  return Object.entries(countVariableObject)
    .sort(([_, a], [__, b]) => b - a)
    .reduce(
      (acc, [key, value]) => (value > 10 ? { ...acc, [key]: value } : acc),
      {},
    );
}

export function countingWord(words: string[]) {
  const countedWords = words.reduce<Record<string, number>>(
    (wordObject, cur) => {
      let wordArr = [];
      if (cur.includes('_')) {
        wordArr = cur.split(/_/);
      } else if (/[A-Z]/.test(cur)) {
        wordArr = cur.split(/(?=[A-Z])/);
      } else {
        wordArr = [cur];
      }
      const combineCount = wordArr.reduce<Record<string, number>>(
        (prev, word) => {
          const lowerCaseWord = word.toLowerCase();
          if (lowerCaseWord === 'constructor') {
            return prev;
          }
          return {
            ...prev,
            [lowerCaseWord]: wordObject[lowerCaseWord]
              ? wordObject[lowerCaseWord] + 1
              : 1,
          };
        },
        {},
      );
      return { ...wordObject, ...combineCount };
    },
    {},
  );
  return Object.entries(countedWords)
    .sort(([_, a], [__, b]) => b - a)
    .reduce(
      (acc, [key, value]) => (value > 10 ? { ...acc, [key]: value } : acc),
      {},
    );
}
