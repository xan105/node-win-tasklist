/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { execFile as exec } from "node:child_process";
import { promisify } from "node:util";
import { Failure } from "@xan105/error";
import { shouldWindows } from "@xan105/is/assert";
import { isArrayOfString, isIntegerPositiveOrZero } from "@xan105/is";
import { getAdditionalInfoFromWMI } from "./wmi.js";

async function tasklist(option = {}){

  shouldWindows();
  
  const options = {
    verbose: option.verbose || false,
    remote: option.remote || null,
    user: option.user || null,
    password: option.password || null,
    filter: isArrayOfString(option.filter) ? option.filter : [],
    uwpOnly: option.uwpOnly || false
  };

  const regex = `\"([^\\\"]*)\",`;
  const pattern = (el) => new RegExp(regex.repeat(+el).slice(0, -1),"g");
    
  let args = ['/FO', 'CSV', '/NH'];
  if (options.uwpOnly) args.push('/apps');
  if (options.verbose) args.push('/V');
  if (options.remote && options.user && options.password) args.push('/S', options.remote, '/U', options.user, '/P', options.password);
  for (const filter of options.filter) args.push('/FI', `"${filter}"`);
    
  const cmd = await promisify(exec)("tasklist", args, {windowsVerbatimArguments: true});
  if (cmd.stderr) throw new Failure(cmd.stderr,"ERR_UNEXPECTED_TASKLIST_FAIL");

  if (!cmd.stdout.startsWith('"')) return [];
  const list = cmd.stdout.match(pattern(options.verbose ? 9 : options.uwpOnly ? 4 : 5));
  if (!list) throw new Failure("Unexpected pattern","ERR_UNEXPECTED_TASKLIST_OUTPUT");
 
  const result = list.map(line => parseLine(line,options));
  return result; 
}

function parseLine(line,options){
  
  const data = line.split('","');
  
  let result = {};
          
  if (options.uwpOnly) 
  {
    if (options.verbose) {
      result.process = data[0].replace(/^\"|\"$/g,"").replace(/\(.+\)$/, "").trim(),
      result.pid = +data[1].replace(/[^\d]/g, ''),
      result.sessionType = data[2].replace(/^\"|\"$/g,"").toLowerCase(),
      result.sessionNumber = +data[3].replace(/[^\d]/g, ''),
      result.memUsage = +data[4].replace(/[^\d]/g, '') * 1024,
      result.state = data[5].replace(/^\"|\"$/g,"").toLowerCase(),
      result.user = data[6].replace(/^\"|\"$/g,""),
      result.cpuTime = data[7].replace(/^\"|\"$/g,""),
      result.windowTitle = data[8].replace(/^\"|\"$/g,"")
    } else {
      result.process = data[0].replace(/^\"|\"$/g,"").replace(/\(.+\)$/, "").trim(),
      result.pid = +data[1].replace(/[^\d]/g, ''), 
      result.sessionType = null,
      result.sessionNumber = null,
      result.memUsage = +data[2].replace(/[^\d]/g, '') * 1024,
      result.aumid = data[3].replace(/^\"|\"$/g,"")
    }
  } 
  else 
  {
    result.process = data[0].replace(/^\"|\"$/g,""),
    result.pid = +data[1].replace(/[^\d]/g, ''), 
    result.sessionType = data[2].replace(/^\"|\"$/g,"").toLowerCase(),
    result.sessionNumber = +data[3].replace(/[^\d]/g, ''),
    result.memUsage = +data[4].replace(/[^\d]/g, '') * 1024
    if (options.verbose) {
      result.state = data[5].replace(/^\"|\"$/g,"").toLowerCase();
      result.user = data[6].replace(/^\"|\"$/g,"");
      result.cpuTime = data[7].replace(/^\"|\"$/g,"");
      result.windowTitle = data[8].replace(/^\"|\"$/g,"");
    }
  }     
  return result;
}

async function getProcessInfo(process, option = {}){
  
  if (!isNaN(process)) process = +process; //Number as a string to Number
  const filter = isIntegerPositiveOrZero(process) ? `PID` : `IMAGENAME`;
  option.filter = [`${filter} eq ${process.toString().replace(/\'/g, "\\'")}`];

  let result = await tasklist(option);
  
  if (result.length > 0 && option.extended === true) {
    for (const i in result){
      if(Object.prototype.hasOwnProperty.call(result, i)) {
        try{
          const extended = await getAdditionalInfoFromWMI(result[i].pid);
          result[i] = Object.assign(result[i], extended);
        }catch{
          continue;
        }
      }
    }
  }

  return !isIntegerPositiveOrZero(process) ? result : result[0] || {};
}

async function isProcessRunning(process, option = {}){

  if (!isNaN(process)) process = +process; //Number as a string to Number
  const filter = isIntegerPositiveOrZero(process) ? `PID` : `IMAGENAME`;
  option.verbose = false;
  option.filter = [`${filter} eq ${process.toString().replace(/\'/g, "\\'")}`,"STATUS eq RUNNING"];
  const result = await tasklist(option);
  return result.length > 0 ? true : false;
}

async function hasProcess(process, option = {}){
  
  if (!isNaN(process)) process = +process; //Number as a string to Number
  const filter = isIntegerPositiveOrZero(process) ? `PID` : `IMAGENAME`;
  option.verbose = false;
  option.filter = [`${filter} eq ${process.toString().replace(/\'/g, "\\'")}`];
  const result = await tasklist(option);
  return result.length > 0 ? true : false;
}

export { tasklist, getProcessInfo, isProcessRunning, hasProcess };