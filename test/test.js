import * as tasklist from"../lib/index.js";

tasklist.default().then((list)=>{

  console.log("- List All");
  console.log(list);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.default({verbose: true}).then((list)=>{

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

tasklist.getProcessInfo("explorer.exe",{verbose: true, extended: true}).then((process)=>{

  console.log("- Get explorer.exe info (Verbose, Extended)");
  console.log(process);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.getProcessInfo("firefox.exe",{verbose: true, extended: true}).then((process)=>{

  console.log("- Get firefox.exe info (Verbose, Extended)");
  console.log(process);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});


tasklist.getProcessInfo(14716,{verbose: true}).then((process)=>{

  console.log("- Get PID 14716 info (Verbose)");
  console.log(process);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.getProcessInfo(14716,{verbose: true, extended: true}).then((process)=>{

  console.log("- Get PID 14716 info (Verbose, Extended)");
  console.log(process);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.getProcessInfo("14716",{verbose: true, extended: true}).then((process)=>{

  console.log("- Get PID 14716 info (Verbose, Extended)");
  console.log(process);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.isProcessRunning("firefox.exe").then((bool)=>{

  console.log("- firefox.exe is running ?");
  console.log(bool);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});

tasklist.isProcessRunning("Builder's Journey.exe").then((bool)=>{

  console.log("- Builder's Journey.exe is running ?");
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

tasklist.default({uwpOnly: true, verbose: false}).then((list)=>{

  console.log("- List All WinStore App");
  console.log(list);
  console.log("\n");

}).catch((err)=>{
  console.error(err);
});