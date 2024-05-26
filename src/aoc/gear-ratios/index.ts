import * as fs from "fs";
const path = require('path')


type Number = {
  number: number;
  startIndex: number;
  endIndex: number;
  rawLine: string;
  lineNumber: number;
};

type Gear = {
  lineNumber: number;
  gearPosition: number;
  currentLineRaw: string;
};

const NUMBER_PATTERN = /\d+/g;
const NON_SYMBOL_PATTERN = /\d|\r|\./;

const parseInput = (): string[] => {
  return fs.readFileSync(__dirname + path.sep + "input.txt", "utf-8").split("\n");
};

const getAllIndices = (str: string, subStr: string): number[] => {
  const indices: number[] = [];
  let startIndex = 0;
  let index: number;

  while ((index = str.indexOf(subStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + subStr.length;
  }

  return indices;
};

const getPossibleGears = (lines: string[]): Gear[] => {
  let gears: Gear[] = [];
  lines.forEach((line, i) => {
    gears.push(...getAllIndices(line, "*").map(index => ({
      lineNumber: i,
      gearPosition: index,
      currentLineRaw: line
    })));
  });
  return gears;
};

const getAllNumbers = (lines: string[]): Number[] => {
  let numbersList: Number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    while ((match = NUMBER_PATTERN.exec(line)) !== null) {
      const foundItem: Number = {
        number: parseInt(match[0]),
        startIndex: match.index,
        endIndex: match.index + match[0].length - 1,
        rawLine: line,
        lineNumber: i,
      };
      numbersList.push(foundItem);
    }
  }
  return numbersList;
};


const isAdjacent = (number: Number, gear: Gear): boolean => {
  const isLineAdjacent = Math.abs(number.lineNumber - gear.lineNumber) <= 1;
  const isPositionAdjacent = gear.gearPosition >= number.startIndex - 1 && gear.gearPosition <= number.endIndex + 1;

  return isLineAdjacent && isPositionAdjacent;
};

const addGearRatios = (numbersList: Number[], possibleGears: Gear[]): number => {
  let sum = 0;
  for (const possibleGear of possibleGears) {
    let adjacentNumbers: Number[] = [];
    numbersList.forEach(number => {
      if (isAdjacent(number, possibleGear)) {
        adjacentNumbers.push(number);
      }
    });
    if (adjacentNumbers.length === 2) {
      sum += adjacentNumbers[0].number * adjacentNumbers[1].number;
    }
  }
  return sum;
};

const resolvePart2 = (input: any[]) => {
  let numbers = getAllNumbers(input);
  let gears = getPossibleGears(input);
  return addGearRatios(numbers, gears);
};

const resolvePart1 = (input: string[]) => {
  let numbers = getAllNumbers(input);
  return addPartNumbers(numbers, input);
};

const addPartNumbers = (numbersList: Number[], input: string[]) => {
  let sum = 0;
  for (const number of numbersList) {
    const previousLine = number.lineNumber != 0 ? input[number.lineNumber - 1] : null;
    const nextLine = number.lineNumber != input.length - 1 ? input[number.lineNumber + 1] : null;

    // check for symbols on same line
    if (
      (number.startIndex > 0 && isSymbol(number.rawLine[number.startIndex - 1])) ||
      isSymbol(number.rawLine[number.endIndex])
    ) {
      sum += number.number;
      continue;
    }

    //check for symbols on next and previous lines
    for (let i = number.startIndex - 1; i <= number.endIndex; i++) {
      if (
        (previousLine !== null && isSymbol(previousLine[i])) ||
        (nextLine !== null && isSymbol(nextLine[i]))
      ) {
        sum += number.number;
        break;
      }
    }
  }
  return sum;
}
const isSymbol = (char: string) => !!char && !char.match(NON_SYMBOL_PATTERN);

// main app code goes here
const start = () => {
  const parsedInput = parseInput();
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
