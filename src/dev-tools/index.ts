import { Command } from "commander";
import { existsSync, readdirSync } from "fs";
import { exec } from "shelljs";
import {
  copyTemplates,
  folderName,
  getAllModules,
  getModulePath,
} from "./utils";

const program = new Command();

const generate = (name: string) => {
  console.log("******** Template generation started ********");

  const moduleName = folderName(name);
  const path = getModulePath(moduleName);

  if (!existsSync(path)) {
    copyTemplates(path);
  } else {
    console.log("This module already exists skipping");
    return;
  }

  console.log("******** Template generation completed ********");
};

const runModule = (name: string) => {
  const moduleName = folderName(name);
  const path = getModulePath(moduleName);
  console.log(`********* Executing module: ${moduleName} ***********`);
  exec(`ts-node ${path}`);
  console.log(`********* Done executing module: ${moduleName} ***********`);
};

const listModules = () => {
  const modulesList = readdirSync(getModulePath());
  console.log(`********* Modules: ***********\n`);
  modulesList.forEach((m) => {
    console.log(m + "\n");
  });
  console.log(`********************\n`);
};

program.version("1.0.0").description("A simple CLI to run Advent of code 2023");
program.command("exec <moduleName>").action(runModule);
program.command("generate <moduleName>").action(generate);
program.command("list").action(listModules);

program.parse(process.argv);
