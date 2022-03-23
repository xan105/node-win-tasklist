import { getProcessInfo } from"../lib/index.js";

const info = await getProcessInfo("dwm.exe",{verbose: true, extended: true});
console.log(info);