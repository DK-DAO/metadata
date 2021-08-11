import { parse } from 'dotenv';
import fs from 'fs';
import { objToCamelCase } from './utilities';

interface ApplicationConfig {
  nodeEnv: string;
  serviceHost: string;
  servicePort: number;
}

const config = ((conf) => {
  const converted: any = {};
  const kvs = <[string, string][]>Object.entries(conf);
  for (let i = 0; i < kvs.length; i += 1) {
    const [k, v]: [string, string] = kvs[i];
    switch (k) {
      case 'servicePort':
        converted[k] = parseInt(v, 10);
        break;
      default:
        converted[k] = v.trim();
    }
  }
  return converted;
})(objToCamelCase(parse(fs.readFileSync(`${__dirname}/../../.env`))));

export default <ApplicationConfig>config;
