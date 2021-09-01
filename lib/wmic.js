/*
MIT License

Copyright (c) 2019-2021 Anthony Beaumont

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import { exec } from "node:child_process";
import { promisify } from "node:util";
import { parse } from "node:path";
import { Failure } from "./util/error.js";

async function getAdditionalInfoFromWMIC(pid){

  if (!(Number.isInteger(pid) && pid >= 0)) throw new Failure("pid should be a positive integer","ERR_INVALID_ARGS");

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