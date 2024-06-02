import * as fs from "fs";
const path = require('path')

interface CardsAndBid {
  hand: string;
  bid: number;
}

interface Hand {
  cards: string[];
  cardCounts: Record<string, number>;
  jokerCount?: number;
}
const PART_1_ORDER = 'AKQJT98765432';
const PART_2_ORDER = 'AKQT98765432J';

const cardValue = (card: string, order: string) => {
  return order.indexOf(card);
}

const parseHand = (hand: string, isPart2: boolean = false) => {
  const cards = hand.split("")
  // .sort((a, b) => cardValue(a, isPart2 ? PART_2_ORDER : PART_1_ORDER) - cardValue(b, isPart2 ? PART_2_ORDER : PART_1_ORDER));

  const nonJokerCards = isPart2 ? cards.filter(c => c !== "J") : cards;
  const jokerCount = cards.length - nonJokerCards.length;

  const cardCounts: Record<string, number> = {};
  nonJokerCards.forEach(card => {
    cardCounts[card] = (cardCounts[card] || 0) + 1;
  })
  return { cards: nonJokerCards, cardCounts, jokerCount }
}

// TODO: parse your input here
const parseInput = (i: any[]): CardsAndBid[] => {
  const input: CardsAndBid[] = [];
  for (const line of i) {
    input.push({ hand: line.split(" ")[0], bid: Number(line.split(" ")[1]) });
  }
  return input
};

const handType = (hand: Hand) => {
  let counts = Object.values(hand.cardCounts).sort((a, b) => b - a);
  counts[0] += (hand.jokerCount ?? 0);
  if (counts[0] === 5) return 'five of a kind';
  if (counts[0] === 4) {
    return 'four of a kind';
  }
  if (counts[0] === 3 && counts[1] === 2) {
    return 'full house';
  }
  if (counts[0] === 3) {
    return 'three of a kind';
  }
  if (counts[0] === 2 && counts[1] === 2) {
    return 'two pair';
  }
  if (counts[0] === 2) {
    return 'one pair';
  }
  return 'high card';
}


const compareHands = (a: Hand, b: Hand, isPart2: boolean = false) => {
  const types = ['high card', 'one pair', 'two pair', 'three of a kind', 'full house', 'four of a kind', 'five of a kind'];
  const typeA = types.indexOf(handType(a));
  const typeB = types.indexOf(handType(b));
  if (typeA !== typeB) return typeA - typeB;
  for (let i = 0; i < a.cards.length; i++) {
    const cmp = cardValue(b.cards[i], isPart2 ? PART_2_ORDER : PART_1_ORDER) - cardValue(a.cards[i], isPart2 ? PART_2_ORDER : PART_1_ORDER);
    if (cmp !== 0) return cmp;
  }
  return 0;
};


const resolvePart1 = (input: any[]) => {
  const hands = input.map(({ hand, bid }) => ({ ...parseHand(hand), bid }));
  hands.sort(compareHands);

  return hands.reduce((acc, hand, i) => {
    return acc + (hand.bid * (i + 1))
  }, 0);
};

const resolvePart2 = (input: any[]) => {
  const hands = input.map(({ hand, bid }) => ({ ...parseHand(hand, true), bid }));
  hands.sort((a, b) => compareHands(a, b, true));

  return hands.reduce((acc, hand, i) => {
    return acc + (hand.bid * (i + 1))
  }, 0);
};

// main app code goes here
const start = () => {
  const parsedInput = parseInput(fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').split("\n"));
  // console.log(parsedInput);
  console.log("result part1: ", resolvePart1(parsedInput));
  console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
