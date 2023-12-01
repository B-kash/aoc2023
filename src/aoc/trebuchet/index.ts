import input from "./input.json";

type NumberWithIndex = { min: number; max: number; val: string };

const searchValues = [
  "1",
  "one",
  "2",
  "two",
  "3",
  "three",
  "4",
  "four",
  "5",
  "five",
  "6",
  "six",
  "7",
  "seven",
  "8",
  "eight",
  "9",
  "nine",
];

const textToNumberStringMap: Record<string, string> = {
  "1": "1",
  one: "1",
  "2": "2",
  two: "2",
  "3": "3",
  three: "3",
  "4": "4",
  four: "4",
  "5": "5",
  five: "5",
  "6": "6",
  six: "6",
  "7": "7",
  seven: "7",
  "8": "8",
  eight: "8",
  "9": "9",
  nine: "9",
};

const getMin = (a: NumberWithIndex, b: NumberWithIndex): NumberWithIndex => {
  if (a.min < b.min) {
    return a;
  }
  return b;
};

const getMax = (a: NumberWithIndex, b: NumberWithIndex): NumberWithIndex => {
  if (a.max < b.max) {
    return b;
  }
  return a;
};

const getRowFromString = (text: string): number => {
  let firstNumber: NumberWithIndex | undefined;
  let lastNumber: NumberWithIndex | undefined;

  searchValues.forEach((s) => {
    const currentValue: NumberWithIndex = {
      min: text.indexOf(s),
      max: text.lastIndexOf(s),
      val: s,
    };

    if (currentValue.min == -1) {
      return;
    }

    if (!firstNumber || !lastNumber) {
      firstNumber = { ...currentValue };
      lastNumber = { ...firstNumber };
      return;
    }

    firstNumber = getMin(firstNumber, currentValue);

    lastNumber = getMax(lastNumber, currentValue);
  });

  if (!firstNumber || !lastNumber) {
    throw new Error("no last or first number");
  }

  const calibrationData = Number(
    `${textToNumberStringMap[firstNumber.val]}${
      textToNumberStringMap[lastNumber.val]
    }`
  );

  return calibrationData;
};

const parseInput = (i: string[]): number[] => {
  if (i.length <= 0) {
    return [];
  }
  const calibrationData: number[] = [];
  i.forEach((t) => {
    if (t.length === 0) {
      return;
    }
    calibrationData.push(getRowFromString(t));
  });
  return calibrationData;
};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(input);
  const sumOfCalibrationData = parsedInput.reduce(
    (currentValue, acc) => currentValue + acc,
    0
  );
  console.log("result: ", sumOfCalibrationData);
};

// run the app
start();
