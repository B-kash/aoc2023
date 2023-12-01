import { copyFileSync, mkdirSync } from "fs";
import { exec } from "shelljs";

export const folderName = (str: string) => {
  return str
    .replace(/\W+/g, " ")
    .replace("_", " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");
};

export const copyTemplatesWithDirectory = (path: string) => {
  const p = mkdirSync(path, { recursive: true });
  copyFileSync(__dirname + "/templates/index.ts", p + "/index.ts");
  console.log("Generated file", p + "/index.ts");
  copyFileSync(__dirname + "/templates/input.json", p + "/input.json");
  console.log("Generated file", p + "/input.json");
};

export const getModulePath = (moduleName: string = "") =>
  __dirname + "/../aoc/" + moduleName;

export const executeModule = (moduleIdentifier: string) => {
  const moduleName = folderName(moduleIdentifier);

  const path = getModulePath(moduleName);
  console.log(`********* Executing module: ${moduleIdentifier} ***********`);
  exec(`ts-node ${path}`);
  console.log(
    `********* Done executing module: ${moduleIdentifier} ***********\n`
  );
};
