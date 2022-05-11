/* eslint-disable @typescript-eslint/consistent-type-assertions */
import * as fs from 'fs';
import { PoolConfig } from "pg";
import defaultConfig from "../../configs.json";

interface Configs {
  port: number;
  discordInvite: string;
  contactEmail: string;
  storagePath: string;
  github: {
    owner: string;
    repo: string;
    cacheLifeMs: number;
  };
  session: {
    secret: string;
  };
  db: PoolConfig;
}

type DeepPartial<T> = T extends Record<string, unknown> ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

function isPlainObject(obj: any) {
  return typeof obj === 'object'
         && obj !== null
         && obj.constructor === Object
         && Object.prototype.toString.call(obj) === '[object Object]';
}

function deepMerge<T extends Record<string, any>>(base: T, object: DeepPartial<T>): T {
  const ret: T = { ...base, ...object };
  
  for(const key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if(!object.hasOwnProperty(key)) continue;
    
    if(isPlainObject(base[key]) && isPlainObject(object[key])) ret[key] = deepMerge(base[key], object[key]);
  }
  
  return ret;
}

let configs: Configs = defaultConfig;

try {
  const configsFile = JSON.parse(fs.readFileSync("./configs.json", "utf-8"));
  
  configs = deepMerge(configs, configsFile);
} catch(e) {
  console.error(e);
}

export default configs;
