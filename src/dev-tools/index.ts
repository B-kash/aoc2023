import { Command } from "commander";
import { existsSync } from "fs";
import { exec } from "shelljs";
import { copyTemplates, folderName, getModulePath } from "./utils";

const program = new Command();

const generate = (name: string) => {
  console.log(name);
  const moduleName = folderName(name);
  console.log("module name to be converted to ", moduleName);

  const path = getModulePath(moduleName);

  if (!existsSync(path)) {
    copyTemplates(path);
  } else {
    console.log("This path already exists");
    return;
  }
};

const runModule = (name: string) => {
  const moduleName = folderName(name);
  const path = getModulePath(moduleName);
  console.log(`********* Executing module: ${moduleName} ***********`);
  exec(`ts-node ${path}`);
  console.log(`********* Done executing module: ${moduleName} ***********`);
};

program.version("1.0.0").description("A simple CLI to run Advent of code 2023");
program.command("exec <moduleName>").action(runModule);
program.command("generate <moduleName>").action(generate);

program.parse(process.argv);
