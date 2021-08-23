"use strict";

const { exec } = require("child_process");
const { promisify } = require("util");
const { parse } = require("path");

async function getAdditionalInfoFromWMIC(pid){
  
  const cmd = await promisify(exec)(`wmic process where processid='${pid}' get CommandLine,ExecutablePath /value`);
  if (cmd.stderr) throw new Error(cmd.stderr);
  
  const output = cmd.stdout.trim().split("\r\n").filter(line => line != "");

  if (output.length !== 2 || !output[0].startsWith("CommandLine") || !output[1].startsWith("ExecutablePath"))
    throw new Error("Unexpected command output");
  
  const result = {
    cmdLine: output[0].replace(/^CommandLine=("[^"]+")?/,"").trim(),
    origin: parse(output[1].replace("ExecutablePath=","").trim()).dir || null
  };
  
  return result;

}

module.exports = { getAdditionalInfoFromWMIC };