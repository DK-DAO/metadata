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
    validator: (e): boolean => /^[0-9]+$/gi.test(e),
    location: 'params',
    message: 'Nft token id must be number in decimal',
  }).merge(ValidatorPagination),
  async (req: IRequestData) => {
    const bn = new BigNumber(req.params.nftTokenId);
    const currentCard = Card.from(`0x${bn.toString(16).padStart(64, '0')}`);
    const { name, description } = jsonData[Number(currentCard.getId())];
    return <any>{
      "name": name,
      "description": `${description} [S/N: ${currentCard.getSerial().toString()}]`,
      "image": `https://metadata.dkdao.network/static/${name.toLowerCase().replace(/['\s]/g, '-')}.png`,
      "external_link": "https://duelistking.com",
      "seller_fee_basis_points": 100,
      "fee_recipient": "0xeE4fe9347a7902253a515CC76EaA3253b47a1837"
    }
  },
);
