import { noCase } from 'no-case';
import cluster from 'cluster';

export interface IParsedEvent {
  eventId: string;
  blockHash: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
}

export interface IWoker {
  id: number;
  pid: number;
  name: string;
}

export function toCamelCase(text: string): string {
  return noCase(text, {
    delimiter: '',
    transform: (part: string, index: number) => {
      const lowerCasePart = part.toLowerCase();
      return index === 0 ? lowerCasePart : `${lowerCasePart[0].toLocaleUpperCase()}${lowerCasePart.substr(1)}`;
    },
  });
}

export function toSnakeCase(text: string): string {
  return noCase(text, {
    delimiter: '_',
    transform: (part: string) => part.toLowerCase(),
  });
}

export function toPascalCase(text: string): string {
  return noCase(text, {
    delimiter: '',
    transform: (part: string) => {
      const lowerCasePart = part.toLowerCase();
      return `${lowerCasePart[0].toLocaleUpperCase()}${lowerCasePart.substr(1)}`;
    },
  });
}

export function objToCamelCase(obj: any): any {
  const entries = Object.entries(obj);
  const remap: any = {};
  for (let i = 0; i < entries.length; i += 1) {
    const [k, v] = entries[i];
    remap[toCamelCase(k)] = v;
  }
  return remap;
}

export function loadWorker(env: Partial<IWoker>) {
  const worker = cluster.fork(env);
  return { id: env.id || -1, name: env.name || 'undefined', pid: worker.process.pid };
}

export function jsToSql(dateTime: Date): string {
  return dateTime.toISOString().slice(0, 19).replace('T', ' ').replace('Z', ' ');
}

export function sqlNow() {
  return jsToSql(new Date());
}

export function timestamp() {
  return Math.round(Date.now());
}

export function stringToBytes32(v: string) {
  const buf = Buffer.alloc(32);
  buf.write(v);
  return `0x${buf.toString('hex')}`;
}

export function hexToFixedBuffer(inputHexString: string, size: number = 32): Buffer {
  return Buffer.from(inputHexString.replace(/^0x/g, '').padStart(size * 2, '0'), 'hex');
}

export function objectToCondition<T>(val: T, ...selectFields: string[]): { field: keyof T; value: any }[] {
  const entries = Object.entries(val);
  const condition = [];
  for (let i = 0; i < entries.length; i += 1) {
    const [k, v] = entries[i];
    if (selectFields.includes(k)) {
      condition.push({
        field: <keyof T>k,
        value: v,
      });
    }
  }
  return condition;
}

export default {
  toCamelCase,
  toSnakeCase,
  toPascalCase,
  loadWorker,
};
