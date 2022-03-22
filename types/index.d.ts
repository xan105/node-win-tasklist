declare interface IOption {
  verbose?: boolean,
  remote?: string | null,
  user?: string | null,
  password?: string | null,
  filter?:  string[],
  uwpOnly?: boolean,
  extended?: boolean
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
export function isProcessRunning(process: string | number, option?: IOption): Promise<boolean>
export function hasProcess(process: string | number, option?: IOption): Promise<boolean>

declare interface IWmic{
  args: string,
  origin: string | null
}

export function getAdditionalInfoFromWMIC(pid: number): Promise<IWmic>
