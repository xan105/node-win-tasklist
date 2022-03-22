/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { exec } from "node:child_process";
import { promisify } from "node:util";
import { parse } from "node:path";
import { Failure } from "@xan105/error";
import { shouldWindows, shouldIntegerPositiveOrZero } from "@xan105/is/assert";

async function getAdditionalInfoFromWMIC(pid){

  shouldWindows();
  shouldIntegerPositiveOrZero(pid);

  const cmd = await promisify(exec)(`wmic process where processid='${pid}' get CommandLine,ExecutablePath /value`);
  if (cmd.stderr) throw new Failure(cmd.stderr,"ERR_UNEXPECTED_WMIC_FAIL");
  
  const output = cmd.stdout.trim().split("\r\n").filter(line => line != "");

  if (output.length !== 2 || !output[0].startsWith("CommandLine") || !output[1].startsWith("ExecutablePath"))
    throw new Failure("Unexpected output pattern","ERR_UNEXPECTED_WMIC_OUTPUT");
  
  const result = {
    args: output[0].replace(/^CommandLine=("[^"]+")?/,"").trim(),
    origin: parse(output[1].replace("ExecutablePath=","").trim()).dir || null
  };
  
  return result;
}

export { getAdditionalInfoFromWMIC };