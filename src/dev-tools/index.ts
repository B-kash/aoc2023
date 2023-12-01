import { Command } from "commander";
import { existsSync, readdirSync } from "fs";
import {
  copyTemplatesWithDirectory,
  executeModule,
  folderName,
  getModulePath,
} from "./utils";

const program = new Command();

const generate = (name: string) => {
  console.log("******** Template generation started ********");
  const moduleName = folderName(name);
  const path = getModulePath(moduleName);

  if (!existsSync(path)) {
    copyTemplatesWithDirectory(path);
  } else {
    console.log("\nThis module already exists skipping!!!");
    console.log(
      "Either change the module name or delete the existing module!!! \n"
    );
    process.exit(1);
  }
  console.log("******** Template generation completed ********");
};

const runModule = (name: string = "", options?: any) => {
  let modules: string[] = [];

  if (options.all) {
    modules.push(...readdirSync(getModulePath()));
  } else {
    if (!name) {
      console.log(
        "-a flag or module name argument is required to execute a module"
      );
      process.exit(1);
    }
    modules = [name];
  }
  modules.forEach(executeModule);
  console.log("****** Completed execution ***********");
};

const listModules = () => {
  const modulesList = readdirSync(getModulePath());
  console.log(`********* Modules: ***********\n`);
  modulesList.forEach((m) => {
    console.log(m + "\n");
  });
  console.log(`********************\n`);
};

program.version("1.0.0").description("A simple CLI for Advent of code 2023");

program
  .command("exec [moduleName]")
  .option("-a, --all", "execute all modules")
  .action(runModule);

program.command("generate <moduleName>").action(generate);
program.command("list").action(listModules);

program.parse(process.argv);
