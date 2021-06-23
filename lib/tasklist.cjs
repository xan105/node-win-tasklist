/*
MIT License

Copyright (c) 2019-2020 Anthony Beaumont

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
'use strict';

const { execFile : exec } = require('child_process');

const tasklist = module.exports = (option = {}) => {

  const options = {
    verbose: option.verbose || false,
    remote: option.remote || null,
    user: option.user || null,
    password: option.password || null,
    filter: option.filter && Array.isArray(option.filter) ? option.filter : [],
    uwpOnly: option.uwpOnly || false
  };

  return new Promise((resolve, reject) => {
  
    if (process.platform !== 'win32') { return reject("tasklist is a command available only in Microsoft Windows") }
  
    const regex = `\"([^\\\"]*)\",`;
    const pattern = (el) => new RegExp(regex.repeat(+el).slice(0, -1),"g");
    
    let args = ['/FO', 'CSV', '/NH'];

    if (options.uwpOnly) args.push('/apps');
    if (options.verbose) args.push('/V');
    if (options.remote && options.user && options.password) args.push('/S', options.remote, '/U', options.user, '/P', options.password);
    for (const filter of options.filter) args.push('/FI', `"${filter}"`);
    
    exec("tasklist", args, {windowsVerbatimArguments: true}, (err, stdout, stderr) => {
    
      if (err) { return reject(err) }
      if (stderr) { return reject(stderr) }

      const list = stdout.match(pattern(options.verbose ? 9 : options.uwpOnly ? 4 : 5));
      if (!list) return resolve(null);
 
      const result = list.map((line) => {
        const data = line.split(",");

          let obj = {};
          
          if (options.uwpOnly) 
          {
            if (options.verbose) {
              obj.process = data[0].replace(/^\"|\"$/g,"").replace(/\(.+\)$/, ""),
              obj.pid = +data[1].replace(/[^\d]/g, ''),
              obj.sessionType = data[2].replace(/^\"|\"$/g,""),
              obj.sessionNumber = +data[3].replace(/[^\d]/g, ''),
              obj.memUsage = +data[4].replace(/[^\d]/g, '') * 1024,
              obj.state = data[5].replace(/^\"|\"$/g,""),
              obj.user = data[6].replace(/^\"|\"$/g,""),
              obj.cpuTime = data[7].replace(/^\"|\"$/g,""),
              obj.windowTitle = data[8].replace(/^\"|\"$/g,"")
            } else {
              obj.process = data[0].replace(/^\"|\"$/g,"").replace(/\(.+\)$/, ""),
              obj.pid = +data[1].replace(/[^\d]/g, ''), 
              obj.sessionType = null,
              obj.sessionNumber = null,
              obj.memUsage = +data[2].replace(/[^\d]/g, '') * 1024,
              obj.aumid = data[3].replace(/^\"|\"$/g,"")
            }
          } 
          else 
          {
            obj.process = data[0].replace(/^\"|\"$/g,""),
            obj.pid = +data[1].replace(/[^\d]/g, ''), 
            obj.sessionType = data[2].replace(/^\"|\"$/g,""),
            obj.sessionNumber = +data[3].replace(/[^\d]/g, ''),
            obj.memUsage = +data[4].replace(/[^\d]/g, '') * 1024
            if (options.verbose) {
              obj.state = data[5].replace(/^\"|\"$/g,"");
              obj.user = data[6].replace(/^\"|\"$/g,"");
              obj.cpuTime = data[7].replace(/^\"|\"$/g,"");
              obj.windowTitle = data[8].replace(/^\"|\"$/g,"");
            }
          }     
          return obj;
          
        });
          
      return resolve(result);
    
    });
    
  });
  
}

/* Helper function */

module.exports.getProcessInfo = (process, option = {}) => {
  const filter = isNaN(process) ? `IMAGENAME` : `PID`;
  option.filter = [`${filter} eq ${process.replace(/\'/g, "\\'")}`];
  return tasklist(option); 
}

module.exports.isProcessRunning = async (process, option = {}) => {
  const filter = isNaN(process) ? `IMAGENAME` : `PID`;
  option.verbose = false;
  option.filter = [`${filter} eq ${process.replace(/\'/g, "\\'")}`,"STATUS eq RUNNING"];
  const result = await tasklist(option);
  return result ? true : false;
}

module.exports.hasProcess = async (process, option = {}) => {
  const filter = isNaN(process) ? `IMAGENAME` : `PID`;
  option.verbose = false;
  option.filter = [`${filter} eq ${process.replace(/\'/g, "\\'")}`];
  const result = await tasklist(option);
  return result ? true : false;
}