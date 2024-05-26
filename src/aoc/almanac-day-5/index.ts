import fs from 'fs';
const path = require('path')

interface DestinationSourceRange {
    destination: { start: number, end: number };
    source: { start: number, end: number };
}

interface Input {
    seeds: number[];
    'seed-to-soil map': DestinationSourceRange[];
    'soil-to-fertilizer map': DestinationSourceRange[];
    'fertilizer-to-water map': DestinationSourceRange[];
    'water-to-light map': DestinationSourceRange[];
    'light-to-temperature map': DestinationSourceRange[];
    'temperature-to-humidity map': DestinationSourceRange[];
    'humidity-to-location map': DestinationSourceRange[];

}

const MAP_START_PATTERN = /^(seed-to-soil map|soil-to-fertilizer map|fertilizer-to-water map|water-to-light map|light-to-temperature map|temperature-to-humidity map|humidity-to-location map):/;
const MAP_END_PATTERN = /^\s*$/;

const parseMap = (startIndex: number, lines: string[]): [DestinationSourceRange[], number] => {
    const map: DestinationSourceRange[] = [];
    let endIndex = startIndex + 1;
    for (let i = startIndex + 1; i < lines.length; i++) {
        if (MAP_END_PATTERN.test(lines[i])) {
            break;
        }
        if (lines[i].trim() !== '') {
            const [destination, source, range] = lines[i].split(' ').map(Number);
            map.push({ destination: { start: destination, end: destination + range }, source: { start: source, end: source + range } });
        }
        endIndex = i;
    }
    return [map, endIndex];
};

const parseInput = (lines: string[]): Input => {
    const input: Input = {
        seeds: [],
        'seed-to-soil map': [],
        'soil-to-fertilizer map': [],
        'fertilizer-to-water map': [],
        'water-to-light map': [],
        'light-to-temperature map': [],
        'temperature-to-humidity map': [],
        'humidity-to-location map': [],
    };

    let index = 0;
    while (index < lines.length) {
        if (lines[index].startsWith("seeds:")) {
            input.seeds = lines[index].split(" ").slice(1).map(Number).filter(seed => !isNaN(seed));
        } else if (MAP_START_PATTERN.test(lines[index])) {
            const [map, endIndex] = parseMap(index, lines);
            const mapName = lines[index].replace(':', '').trim() as keyof Input;
            if (mapName === 'seeds') {
                // Skip seeds as already handled in if condition
                continue;
            }
            input[mapName] = map;
            index = endIndex;
        }
        index++;
    }

    return input;
};

const getDestination = (map: DestinationSourceRange[], value: number): number => {
    const entry = map.find(entry => entry.source.start <= value && entry.source.end >= value);
    return entry ? entry.destination.start + (value - entry.source.start) : value;
};

const resolvePart1 = (input: Input) => {
    let finalLocation: number = Infinity;
    for (let seed of (input.seeds as number[])) {
        const soil = getDestination(input['seed-to-soil map'] as DestinationSourceRange[], seed);
        const fertilizer = getDestination(input['soil-to-fertilizer map'] as DestinationSourceRange[], soil);
        const water = getDestination(input['fertilizer-to-water map'] as DestinationSourceRange[], fertilizer);
        const light = getDestination(input['water-to-light map'] as DestinationSourceRange[], water);
        const temperature = getDestination(input['light-to-temperature map'] as DestinationSourceRange[], light);
        const humidity = getDestination(input['temperature-to-humidity map'] as DestinationSourceRange[], temperature);
        const location = getDestination(input['humidity-to-location map'] as DestinationSourceRange[], humidity);

        finalLocation = Math.min(finalLocation, location);
        console.log({
            seed,
            soil,
            fertilizer,
            water,
            light,
            temperature,
            humidity,
            location,
            finalLocation
        })
    }
    return finalLocation;
};

const resolvePart2 = (input: Input) => { };

// main app code goes here
const start = () => {
    const parsedInput = parseInput(fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').split("\n"));
    console.log("result part1: ", resolvePart1(parsedInput));
    console.log("result part2: ", resolvePart2(parsedInput));
};

// run the app
start();
