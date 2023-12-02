import input from "./input.json";

// TODO: parse your input here
const parseInput = (i: any[]) => {
  return i;
};

const resolvePart1 = (i: any[]) => {};

const resolvePart2 = (i: any[]) => {};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(input);
  console.log(parsedInput);
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
