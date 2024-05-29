import * as fs from "fs";
const path = require('path')

type Input = {
  time: number[],
  distance: number[],
}

// TODO: parse your input here
const parseInput = (lines: string[]) => {
  let input: Input = {
    time: [],
    distance: [],
  };
  for (let line of lines) {
    const [key, values] = line.split(":");
    if (key.toLowerCase() === "time") {
      input.time = values.split(" ").map(Number).filter(Boolean) || [];
    }
    if (key.toLowerCase() === "distance") {
      input.distance = values.split(" ").map(Number).filter(Boolean) || [];
    }
  }
  return input;
};

const numberOfWaysToWin = (time: number, distance: number) => {
  const lower = Math.floor(0.5 * (time - Math.sqrt((time * time) - (4 * distance)))) + 1
  const upper = time - lower;
  return upper - lower + 1;
}

const resolvePart1 = (input: Input) => {
  let result = 1;
  for (let i = 0; i < input.time.length; i++) {
    const time = input.time[i];
    const distance = input.distance[i];
    result *= numberOfWaysToWin(time, distance);
  }
  return result;
};

const resolvePart2 = (input: Input) => {


  return numberOfWaysToWin(Number(input.time.join('')), Number(input.distance.join('')));
};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').split("\n"));
  console.log(parsedInput);
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
