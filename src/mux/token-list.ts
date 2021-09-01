import { objToCamelCase } from '../helper/utilities';
import { Mux } from '../framework';
import jsonData from './data.json';

Mux.get('/token', undefined, async () => {
  return {
    success: true,
    result: {
      total: jsonData.length,
      offset: 0,
      limit: 1000,
      order: [],
      records: jsonData.map((item) => {
        const image = `https://metadata.dkdao.network/static/${(item.Name || '')
          .toString()
          .toLowerCase()
          .replace(/['\s]/g, '-')}.png`;
        return {
          image,
          ...objToCamelCase(item),
        };
      }),
    },
  };
});
