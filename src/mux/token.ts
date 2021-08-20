import { BigNumber } from 'bignumber.js';
import { IRequestData } from '../framework/interfaces';
import { Mux, Validator } from '../framework';
import { ValidatorPagination } from '../validators';
import Card from '../helper/card';
import jsonData from './data.json';

Mux.get(
  '/token/:nftTokenId',
  new Validator({
    name: 'nftTokenId',
    type: 'string',
    validator: (e): boolean => /^[0-9]+$/gi.test(e) || /^0x[0-9a-f]+$/gi.test(e),
    location: 'params',
    message: 'Nft token id must be number in decimal',
  }).merge(ValidatorPagination),
  async (req: IRequestData) => {
    const bn = new BigNumber(req.params.nftTokenId);
    const currentCard = Card.from(`0x${bn.toString(16).padStart(64, '0')}`);
    const data = new Map(Object.entries(jsonData[Number(currentCard.getId())]));
    return <any>{
      name: data.get('Name'),
      description: `${data.get('Description')} [S/N: ${currentCard.getSerial().toString()}]`,
      image: `https://metadata.dkdao.network/static/${(data.get('Name') || '')
        .toString()
        .toLowerCase()
        .replace(/['\s]/g, '-')}.png`,
      external_link: 'https://duelistking.com',
      seller_fee_basis_points: 500,
      fee_recipient: '0xeE4fe9347a7902253a515CC76EaA3253b47a1837',
      attributes: [
        {
          trait_type: 'Application',
          value: 'Duelist King',
        },
        {
          trait_type: 'Type',
          value: data.get('Type'),
        },
        {
          trait_type: 'Rareness',
          value: data.get('Rareness Name'),
        },
        {
          trait_type: 'Race',
          value: data.get('Race'),
        },
        {
          trait_type: 'Attribute',
          value: data.get('Attribute'),
        },
        {
          trait_type: 'Attack Range',
          value: data.get('Attack Range'),
        },
        {
          display_type: 'number',
          trait_type: 'Card ID',
          value: data.get('Card Id'),
        },
        {
          display_type: 'number',
          trait_type: 'Generation',
          value: currentCard.getGeneration(),
        },
        {
          display_type: 'number',
          trait_type: 'Rate',
          value: data.get('Rate') || 1,
        },
      ],
    };
  },
);
