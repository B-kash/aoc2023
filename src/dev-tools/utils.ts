import { copyFileSync, mkdirSync, readdirSync } from "fs";

export const folderName = (str: string) => {
  return str
    .replace(/\W+/g, " ")
    .replace("_", " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");
};

export const copyTemplates = (path: string) => {
  const p = mkdirSync(path, { recursive: true });
  copyFileSync(__dirname + "/templates/index.ts", p + "/index.ts");
  console.log("Generated file", p + "/index.ts");
  copyFileSync(__dirname + "/templates/input.json", p + "/input.json");
  console.log("Generated file", p + "/input.json");
};

export const getModulePath = (moduleName: string = "") =>
  __dirname + "/../aoc/" + moduleName;
