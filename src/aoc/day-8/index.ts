import * as fs from "fs";
const path = require('path')

type Direction = "L" | "R";

interface NetworkMap {
  instructions: Direction[]
  network: Record<string, string[]>
}

// TODO: parse your input here
const parseInput = (lines: any[]): NetworkMap => {
  const instructions = lines[0].split("").slice(0, -1).map((c: string) => c as Direction);
  const network: Record<string, string[]> = {};
  for (let i = 2; i < lines.length; i++) {
    let currentLineParts = lines[i].split("=");
    const val = currentLineParts[1]
      .replace('(', '').replace(')', '')
      .split(",");
    network[currentLineParts[0].trim()] = [val[0].trim(), val[1].trim()];
  }
  return { instructions, network };
};

const traverseMap = (map: NetworkMap, from: string, to: string): string[] => {
  let path = [from];
  let current = from;
  while (current !== to) {
    current = map.network[current][map.instructions[(path.length - 1) % (map.instructions.length)] == "L" ? 0 : 1];
    path.push(current);
    if (current === to) {
      break;
    }
  }
  return path;
}

const resolvePart1 = (input: NetworkMap) => {
  let current: string = "AAA";
  const end: string = "ZZZ";
  const path = traverseMap(input, current, end);
  return path.length - 1;
}

const getNextNode = (network: Record<string, string[]>, current: string, direction: Direction): string => {
  return network[current][direction == "L" ? 0 : 1];
};

const solveMathematically = (map: NetworkMap): number => {
  const result = []
  for (let [key, value] of Object.entries(map.network)) {
    if (!key.endsWith("A")) {
      continue;
    }
    let steps = 0
    while (!key.endsWith("Z")) {
      key =  (map.network, key, map.instructions[steps % map.instructions.length]);
      steps++;
    }
    result.push(steps);
  }
  let val = result[0]
  for (let i = 0; i < result.length; i++) {
    val = lcm(val, result[i]);
  }
  return val;
}

const lcm = (a: number, b: number) => {
  return a / gcd(a, b) * b;
}

const gcd = (a: number, b: number) => {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

const resolvePart2 = (i: NetworkMap) => {
  return solveMathematically(i);
};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').split("\n"));
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
