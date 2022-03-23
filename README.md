About
=====

Wrapper for the Windows tasklist command.

#### Note about locale:

Most Windows commands change their output based on system's locale, which can be sometimes difficult when you are trying to parse the output of a non-English system.
This module tries to be system-locale-independent as much as possible in order to be able to parse the tasklist output.
Unfortunately some returned properties will remain locale-dependent.

Example
=======

Get a specific process information:

```js
import { getProcessInfo } from "win-tasklist";

console.log( await getProcessInfo("explorer.exe",{verbose: true}) );
/*
  [{ process: 'explorer.exe',
      pid: 6960,
      sessionType: 'console',
      sessionNumber: 1,
      memUsage: 169783296,
      state: 'running',
      user: 'skynet\\xan',
      cpuTime: '0:02:15',
      windowTitle: null }]  
*/

//By PID and fetch additional info via WMI (args and dir of origin)

console.log( await getProcessInfo(15640,{verbose: true, extended: true}) );
/*
  { process: 'firefox.exe',
    pid: 15640,
    sessionType: 'console',
    sessionNumber: 1,
    memUsage: 80269312,
    state: 'running',
    user: 'SKYNET\\Xan',
    cpuTime: '0:00:00',
    windowTitle: 'OleMainThreadWndName',
    args: '-contentproc -isForBrowser -prefsHandle 2688 ...',
    origin: 'C:\\Program Files\\Mozilla Firefox'}  
*/
```

Is process running ? 

```js
import { isProcessRunning } from "win-tasklist";

console.log( await isProcessRunning("firefox.exe") );
//true or false
```

List them all:

```js
import tasklist from "win-tasklist";

console.log( await tasklist() );
/*
  [ { process: 'system idle process',
      pid: 0,
      sessionType: 'services',
      sessionNumber: 0,
      memUsage: 8192 },
    { process: 'system',
      pid: 4,
      sessionType: 'services',
      sessionNumber: 0,
      memUsage: 2580480 }, 
      ... 100 more items ]
*/
```

Installation
============

```
npm install win-tasklist
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM) starting with version 2.0.0.<br />
Previous version(s) are CommonJS (CJS) with an ESM wrapper.

## Default export

#### `(option?: obj): Promise<obj[]>`

Wrapper to the `tasklist` command.<br />
Returns an [Array] of object.

<details>
<summary>⚙️ Options</summary>

- verbose (default: false)<br />
      if false will return the following properties : `process, pid, sessionType, sessionNumber, memUsage (bytes)`.<br />
      if true will additionally return the following properties : `state, user, cpuTime, windowTitle`.<br />
      <br />
      ⚠️ Keep in mind using the verbose option might impact performance.
    
- remote (default: null)<br />
      Name or IP address of a remote computer.<br />
      Must be used with user and password options below.
    
- user (default: null)<br />
      Username or Domain\Username.
    
- password (default: null)<br />
      User's password.
 
- uwpOnly (default: false)<br />
      List only Windows Store Apps (UWP).<br />
      ⚠️ NB: With this option to true and verbose to false; tasklist only returns `process, pid, memUsage (bytes) and AUMID`.
      
- filter (default: [])<br />
    
     Array of string. Each string being a filter.<br />
     
     eg filter for listing only running processes :
     `["STATUS eq RUNNING"]`

     <table>
        <thead>
        <tr>
        <th>Filter Name</th>
        <th>Valid Operators</th>
        <th>Valid Values</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>STATUS</td>
        <td>eq, ne</td>
        <td>RUNNING</td>
        </tr>
        <tr>
        <td>IMAGENAME</td>
        <td>eq, ne</td>
        <td>Image name</td>
        </tr>
        <tr>
        <td>PID</td>
        <td>eq, ne, gt, lt, ge, le</td>
        <td>PID value</td>
        </tr>
        <tr>
        <td>SESSION</td>
        <td>eq, ne, gt, lt, ge, le</td>
        <td>Session number</td>
        </tr>
        <tr>
        <td>SESSIONNAME</td>
        <td>eq, ne</td>
        <td>Session name</td>
        </tr>
        <tr>
        <td>CPUTIME</td>
        <td>eq, ne, gt, lt, ge, le</td>
        <td>CPU time in the format <em>HH</em><strong>:</strong><em>MM</em><strong>:</strong><em>SS</em>, where <em>MM</em> and <em>SS</em> are between 0 and 59 and <em>HH</em> is any unsigned number</td>
        </tr>
        <tr>
        <td>MEMUSAGE</td>
        <td>eq, ne, gt, lt, ge, le</td>
        <td>Memory usage in KB</td>
        </tr>
        <tr>
        <td>USERNAME</td>
        <td>eq, ne</td>
        <td>Any valid user name</td>
        </tr>
        <tr>
        <td>SERVICES</td>
        <td>eq, ne</td>
        <td>Service name</td>
        </tr>
        <tr>
        <td>WINDOWTITLE</td>
        <td>eq, ne</td>
        <td>Window title</td>
        </tr>
        <tr>
        <td>MODULES</td>
        <td>eq, ne</td>
        <td>DLL name</td>
        </tr>
        </tbody>
    </table>
 
💡 More details in the official [tasklist](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/tasklist) doc.
    
</details>

## Named export

#### `getProcessInfo(process: string | number, option?: obj): Promise<obj[] | obj>`

  `process` can either be a PID (number or number as a string) or an imagename (string).<br />
  Same option as default export minus `filter` and with the addition of `extended` (_boolean_).
  
  `extended` adds `args` and `origin` (dir) properties from WMI.<br />
  See `getAdditionalInfoFromWMI()` for more details.

  Returns an [Array] of object or a single obj if you are searching by PID (number or number as a string).<br />

#### `isProcessRunning(process: string | number, option?: obj): Promise<boolean>`

  `process` can either be a PID (number or number as a string) or an imagename (string).<br />
  Same option as default export minus `filter` and `verbose`.
  
  Return true if the specified process is running (*meaning it has the status RUNNING*), false otherwise.<br />
   
  Equivalent of filter `IMAGENAME/PID eq %process% and STATUS eq RUNNING`.<br />

#### `hasProcess(process: string | number, option?: obj): Promise<boolean>`

  `process` can either be a PID (number or number as a string) or an imagename (string).<br />
  Same option as default export minus `filter` and `verbose`.
  
  Return true if the specified process is loaded (*meaning it is listed in the tasklist*), false otherwise.<br />
  
  Equivalent of filter `IMAGENAME/PID eq %process%`.<br />

#### `getAdditionalInfoFromWMI(pid: number): Promise<obj>`

  Query WMI for process' commandline and location (dirpath).<br />
  Return an object:
  
```js
  {
    args: string, //command line
    origin: string | null //location (dirpath)
  }
```

  In case information can not be accessed due to privileges restriction then `origin` will be `null` and `args` will be empty.