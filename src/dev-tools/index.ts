import { Command } from "commander";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { folderName } from "./utils";

const program = new Command();

const generate = (name: string) => {
  console.log(name);
  const moduleName = folderName(name);
  console.log("module name to be converted to ", moduleName);

  const path = __dirname + "/../aoc/" + moduleName;
  if (!existsSync(path)) {
    const p = mkdirSync(path, { recursive: true });
    copyFileSync(__dirname + "/templates/index.ts", p + "/index.ts");
    copyFileSync(__dirname + "/templates/input.json", p + "/input.json");
  } else {
    console.log("This path already exists");
    return;
  }
};

program
  .command("generate <moduleName>")
  .action(generate)
  .version("1.0.0")
  .description("A simple CLI to run Advent of code 2023");

program.parse(process.argv);
