import { Utilities, ConfigLoader, Singleton, Validator } from '@dkdao/framework';

interface IApplicationConfig {
  nodeEnv: string;
  serviceHost: string;
  servicePort: number;
}

const configLoader = Singleton<ConfigLoader>(
  'duelistking-web-backend-config',
  ConfigLoader,
  `${Utilities.File.getRootFolder()}/.env`,
  new Validator(
    {
      name: 'nodeEnv',
      type: 'string',
      location: 'any',
      require: true,
      postProcess: (e) => e.trim(),
      enums: ['production', 'development', 'test', 'staging'],
    },
    {
      name: 'serviceHost',
      type: 'string',
      location: 'any',
      require: true,
      postProcess: (e) => e.trim(),
    },
    {
      name: 'servicePort',
      type: 'integer',
      location: 'any',
      require: true,
      validator: (e) => Number.isFinite(e) && Number.isInteger(e) && e > 0,
    },
  )
);

const config = configLoader.getConfig<IApplicationConfig>();
export default config;
