import input from "./input.json";

type ColorLabel = "red" | "blue" | "green";

type ColorScheme = { [k in ColorLabel]: number };

const parseGame = (game: string): ColorScheme[] => {
  const colors: ColorScheme[] = [];
  game.split(";").forEach((round) => {
    const color: ColorScheme = {
      red: 0,
      blue: 0,
      green: 0,
    };
    round.split(",").forEach((cube) => {
      const cubeSplits = cube.trim().split(" ");
      const cubeValue = Number(cubeSplits[0]);
      const cubeColor = cubeSplits[1] as ColorLabel;
      color[cubeColor] = cubeValue;
    });
    colors.push(color);
  });
  return colors;
};

const parseInput = (lines: string[]): Record<number, ColorScheme[]> => {
  const gameMap: Record<number, ColorScheme[]> = {};
  lines.forEach((line) => {
    const lineSplit = line.split(":");
    const gameNumber = Number(lineSplit[0].split(" ")[1]);
    const gameValues = parseGame(lineSplit[1]);
    gameMap[gameNumber] = gameValues;
  });
  return gameMap;
};

const isRollPossible = (color: string, value: number): boolean =>
  (color === "blue" && value <= 14) ||
  (color === "red" && value <= 12) ||
  (color === "green" && value <= 13);

const findMinRequiredColorCubes = (rounds: ColorScheme[]) => {
  const scheme: ColorScheme = {
    red: 0,
    blue: 0,
    green: 0,
  };
  for (let round of rounds) {
    for (let color in round) {
      if (round[color as ColorLabel] > scheme[color as ColorLabel]) {
        scheme[color as ColorLabel] = round[color as ColorLabel];
      }
    }
  }
  return scheme;
};

const resolvePart_2 = (parsedInput: Record<number, ColorScheme[]>) => {
  let cubeSum = 0;
  for (const gameNumber in parsedInput) {
    const rounds = parsedInput[gameNumber];
    const minCubes: ColorScheme = findMinRequiredColorCubes(rounds);
    const mul = minCubes.red * minCubes.green * minCubes.blue;
    cubeSum += mul;
  }
  return cubeSum;
};

const isGamePossible = (rounds: ColorScheme[]): boolean => {
  for (let round of rounds) {
    for (let color in round) {
      if (!isRollPossible(color, round[color as ColorLabel])) {
        return false;
      }
    }
  }
  return true;
};

const resolvePart1 = (parsedInput: Record<number, ColorScheme[]>) => {
  let possibleGameIdSum = 0;
  for (const gameNumber in parsedInput) {
    if (isGamePossible(parsedInput[gameNumber])) {
      possibleGameIdSum += Number(gameNumber);
    }
  }
  return possibleGameIdSum;
};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(input);
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart_2(parsedInput));
};

// run the app
start();
