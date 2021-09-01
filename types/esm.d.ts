declare interface IOption {
  verbose?: bool,
  remote?: string | null,
  user?: string | null,
  password?: string | null,
  filter?:  string[],
  uwpOnly?: bool,
  extended?: bool
}

declare interface ITasklist{
  process: string,
  pid: number, 
  sessionType: string | null,
  sessionNumber: number | null,
  memUsage: number,
  aumid?: string,
  state?: string,
  user?: string,
  cpuTime?: string,
  windowTitle?: string,
  args?: string,
  origin?: string | null
}

export default function(option?: IOption): Promise<ITasklist[]>
export function getProcessInfo(process: string | number, option?: IOption): Promise<any>
export function isProcessRunning(process: string | number, option?: IOption): Promise<bool>
export function hasProcess(process: string | number, option?: IOption): Promise<bool>

declare interface IWmic{
  args: string,
  origin: string | null
}

export function getAdditionalInfoFromWMIC(pid: number): Prromise<IWmic>