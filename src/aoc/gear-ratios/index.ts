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

const parseInput = () => {
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

const getPossibleGears = (lines: string[]) => {
  let gears: Gear[] = [];
  lines.forEach((line, i) => {
    gears.push(...getAllIndices(line, "*").map(index => ({ lineNumber: i, gearPosition: index, currentLineRaw: line })));
  });
  return gears;
};

const getAllNumbers = (lines: string[]) => {
  let numbersList: Number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    while ((match = NUMBER_PATTERN.exec(line)) !== null) {
      const foundItem: Number = {
        number: parseInt(match[0]),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        rawLine: line,
        lineNumber: i,
      };
      numbersList.push(foundItem);
    }
  }
  return numbersList;
}



const isAdjacent = (number: Number, gear: Gear): boolean => {
  const isLineAdjacent = Math.abs(number.lineNumber - gear.lineNumber) <= 1;
  const isPositionAdjacent = gear.gearPosition >= number.startIndex - 1 && gear.gearPosition <= number.endIndex + 1;

  return isLineAdjacent && isPositionAdjacent;
};

const addGearRatios = (numbersList: Number[], possibleGears: Gear[]) => {
  let sum = 0;
  for (const possibleGear of possibleGears) {
    let gearRatio: number | undefined = undefined;
    numbersList.forEach(number => {
      if (isAdjacent(number, possibleGear)) {
        if (gearRatio) {
          gearRatio *= number.number;
        } else {
          gearRatio = number.number;
        }
      }
    });
    if (gearRatio)
      sum += gearRatio;
  };
  return sum;
};

const isGearBetween = (num1: Number, num2: Number, gear: Gear): boolean => {
  const isPositionBetween = (gear.gearPosition >= num1.startIndex - 1 && gear.gearPosition <= num2.endIndex + 1) &&
    (gear.gearPosition >= num2.startIndex - 1 && gear.gearPosition <= num1.endIndex + 1);

  return isPositionBetween;
};

const findAdjacentPairs = (numbers: Number[], gears: Gear): Number[] => {
  const adjacentPairs: Number[] = [];
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (isGearBetween(numbers[i], numbers[j], gears)) {
        return [numbers[i], numbers[j]];
      }
    }
  }
  return adjacentPairs;
};

const calculateGearRatiosSum = (numbers: Number[], gears: Gear[]): number => {
  const adjacentPairArray = [];
  for (let gear of gears) {
    const mayBeAdjacentNumbers = numbers.filter(number => gear.lineNumber >= number.lineNumber - 1 && gear.lineNumber <= number.lineNumber + 1 || gear.lineNumber === number.lineNumber);
    if (mayBeAdjacentNumbers.length < 2) {
      continue;
    }
    adjacentPairArray.push(findAdjacentPairs(mayBeAdjacentNumbers, gear));
  }
  // const adjacentPairs = findAdjacentPairs(numbers, gears);
  let sumOfGearRatios = 0;

  for (const [num1, num2] of adjacentPairArray.filter(pair => pair.length === 2)) {
    const gearRatio = num1.number * num2.number;
    sumOfGearRatios += gearRatio;
  }

  return sumOfGearRatios;
};

const resolvePart2 = (input: any[]) => {
  let numbers = getAllNumbers(input);
  let gears = getPossibleGears(input);
  return addGearRatios(numbers, gears);
  // return calculateGearRatios(numbers, input);
};


// main app code goes here
const start = () => {
  const parsedInput = parseInput();
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();


const calculateGearRatios = (numbersList: Number[], input: string[]): number => {
  let gearRatiosSum = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === '*') {
        const adjacentNumbers: number[] = [];

        // Check all eight directions
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],          [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];

        for (const [di, dj] of directions) {
          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < input.length && nj >= 0 && nj < input[ni].length) {
            if (/\d/.test(input[ni][nj])) {
              adjacentNumbers.push(parseInt(input[ni][nj]));
            }
          }
        }

        if (adjacentNumbers.length === 2) {
          gearRatiosSum += adjacentNumbers[0] * adjacentNumbers[1];
        }
      }
    }
  }

  return gearRatiosSum;
}

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
const resolvePart1 = (input: string[]) => {
  let numbers = getAllNumbers(input);
  return addPartNumbers(numbers, input);
};
