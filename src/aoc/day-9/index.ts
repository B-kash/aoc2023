import * as fs from "fs";
const path = require('path')



const parseInput = (lines: string[]) => {
  const input = [];
  for (let line of lines) {
    input.push(line.split(" ").map(Number));
  }
  return input;
};

const getIntermediateNextInputs = (input: number[]) => {
  const nextInputs = [input];
  let givenInput = [...input];
  while (!givenInput.every(value => value === 0)) {
    const nextInput = []
    for (let i = 0; i < givenInput.length - 1; i++) {
      nextInput.push(givenInput[i + 1] - givenInput[i])
    }
    nextInputs.push(nextInput)
    givenInput = [...nextInput]
  }
  return nextInputs;
}

const findFutureValue = (input: number[]) => {
  const nextInputs = getIntermediateNextInputs(input);
  // now we have 0 for all inputs lets predict the next value
  for (let i = nextInputs.length - 1; i >= 0; i--) {
    const currInput = nextInputs[i];
    nextInputs[i].push(currInput[currInput.length - 1] + (i < nextInputs.length - 1 ? nextInputs[i + 1][nextInputs[i + 1].length - 1] : 0));
  }
  return nextInputs[0][nextInputs[0].length - 1];
}

const findPastValues = (input: number[]) => {
  const nextInputs = getIntermediateNextInputs(input);
  for (let i = nextInputs.length - 1; i >= 0; i--) {
    const currInput = nextInputs[i];
    nextInputs[i].unshift(currInput[0] - (i < nextInputs.length - 1 ? nextInputs[i + 1][0] : 0));
  }
  return nextInputs[0][0];
}

const resolvePart1 = (input: any[]) => {
  let result = 0;
  for (let line of input) {
    result += findFutureValue(line);
  }
  return result;
};

const resolvePart2 = (i: any[]) => {
  let result = 0;
  for (let line of i) {
    result += findPastValues(line);
  }
  return result;
};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').split("\n"));
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
