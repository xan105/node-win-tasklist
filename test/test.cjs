"use strict";

const tasklist = require('../lib/tasklist.cjs');

tasklist().then((list)=>{

  console.log("- List All");
  console.log(list);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist({verbose: true}).then((list)=>{

  console.log("- List All (Verbose)");
  console.log(list);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.getProcessInfo("explorer.exe",{verbose: true}).then((process)=>{

  console.log("- Get explorer.exe info (Verbose)");
  console.log(process);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.isProcessRunning("firefox.exe").then((bool)=>{

  console.log("- is firefox.exe running ?");
  console.log(bool);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.hasProcess("system idle process").then((bool)=>{

  console.log("- is system idle process loaded ?");
  console.log(bool);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist({uwpOnly: true}).then((list)=>{

  console.log("- List All WinStore App");
  console.log(list);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});