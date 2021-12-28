import { Mux } from '@dkdao/framework';
import { objToCamelCase } from '../helper/utilities';
import jsonData from './data.json';

Mux.get('/card', undefined, async () => {
  return {
    success: true,
    result: {
      total: jsonData.length,
      offset: 0,
      limit: 1000,
      order: [],
      records: jsonData.map((item) => {
        const image = `https://assets.duelistking.com/metadata/${(item.Name || '')
          .toString()
          .toLowerCase()
          .replace(/['\s]/g, '-')}.jpg`;
        return {
          image,
          ...objToCamelCase(item),
        };
      }),
    },
  };
});
