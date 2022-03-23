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

async function getAdditionalInfoFromWMI(pid){

  shouldWindows();
  shouldIntegerPositiveOrZero(pid);

  const cmd = `Get-CimInstance -ClassName Win32_process | Where-Object -Property ProcessID -eq ${pid} | Select-Object CommandLine, ExecutablePath | Format-list`;
  
  const ps = await promisify(exec)(`powershell -NoProfile "${cmd}"`, {windowsHide: true});
  if (ps.stderr) throw new Failure(ps.stderr, "ERR_UNEXPECTED_POWERSHELL_FAIL");

  if (!ps.stdout.includes("CommandLine") || !ps.stdout.includes("ExecutablePath"))
    throw new Failure("Unexpected output pattern","ERR_UNEXPECTED_WMI_OUTPUT");

  const extract = (string, start, end = null) =>
    string
    .substring(string.indexOf(start) + start.length, end ? string.indexOf(end) : string.length)
    .split("\r\n")
    .map(line => line.trim())
    .join("");

  const output = [
    extract(ps.stdout, "CommandLine", "ExecutablePath"),
    extract(ps.stdout, "ExecutablePath")
  ];

  const result = {
    args: output[0].replace(/^:(\s*)("[^"]+")?/,"").trim(),
    origin: parse(output[1].replace(/^:(\s*)/,"").trim()).dir || null
  };

  return result;
}

export { getAdditionalInfoFromWMI };