import * as fs from "fs";
const path = require('path')

interface ScratchCard {
  yourNumbers: number[];
  winningNumbers: number[];
  cardNumber: number;
  cardInstances: number;
}


// TODO: parse your input here
const parseInput = (lines: string[]) => {
  const scratchCards: Record<number, ScratchCard> = {};
  lines.forEach((line, i) => {
    const [yourNumbers, winningNumbers] = line.split(":")[1].split("|");
    scratchCards[i + 1] = {
      cardNumber: i + 1,
      yourNumbers: yourNumbers.split(" ").filter(c => c != '').map(Number),
      winningNumbers: winningNumbers.split(" ").filter(c => c != '').map(Number),
      cardInstances: 1,
    };
  })
  return scratchCards;
};

const resolvePart1 = (scratchCards: Record<number, ScratchCard>) => {
  let result = 0;
  Object.entries(scratchCards).forEach(([cardNumber, card]) => {
    const matchedNumbers = card.yourNumbers.filter(num => card.winningNumbers.includes(num));
    let points = 0;
    if (matchedNumbers.length > 0) {
      points = Math.pow(2, matchedNumbers.length - 1);
    }
    result += points;
  });
  return result;
};

const resolvePart2 = (scratchCards: Record<number, ScratchCard>) => {
  let result = 0;
  for (const cardNumber in scratchCards) {
    const card = scratchCards[cardNumber];
    for (let i = 0; i < card.cardInstances; i++) {
      const newWinnings = card.yourNumbers.filter(num => card.winningNumbers.includes(num)).length;
      if (!newWinnings) {
        continue;
      }
      for (let j = 1; j <= newWinnings; j++) {
        if (!scratchCards[Number(cardNumber) + j]) {
          console.log("break", cardNumber + j);
          break;
        }
        scratchCards[Number(cardNumber) + j] = {
          ...scratchCards[Number(cardNumber) + j],
          cardInstances: scratchCards[Number(cardNumber) + j].cardInstances + 1
        }
      }
    }
    result += card.cardInstances;
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
