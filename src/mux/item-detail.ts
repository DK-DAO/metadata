import { BigNumber } from 'bignumber.js';
import { IRequestData, Mux, Validator } from '@dkdao/framework';
import Card from '../helper/card';

Mux.get(
  '/item/:nftTokenId',
  new Validator({
    name: 'nftTokenId',
    type: 'string',
    validator: (e): boolean => /^[0-9]+$/gi.test(e) || /^0x[0-9a-f]+$/gi.test(e),
    location: 'params',
    message: 'Nft token id must be number in decimal or hexadecimal',
  }),

  async (req: IRequestData) => {
    const bn = new BigNumber(req.params.nftTokenId);
    const currentItem = Card.from(`0x${bn.toString(16).padStart(64, '0')}`);
    return <any>{
      name: `Duelist King Mystery Box #${currentItem.getId().toString()}`,
      description: `Duelist King Mystery Box Phase #${currentItem.getId().toString()
        }[S / N: ${currentItem.getSerial().toString()}]`,
      image: `https://assets.duelistking.com/metadata/box-phase-${currentItem.getId().toString()}.jpg`,
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
          value: 'Mystery Boxes'
        },
        {
          trait_type: 'Rareness',
          value: 'Mystical',
        },
        {
          display_type: 'number',
          trait_type: 'Generation',
          value: 0,
        },
        {
          display_type: 'number',
          trait_type: 'Rate',
          value: 5,
        },
      ],
    };
  },
);
