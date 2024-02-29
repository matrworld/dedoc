import { Umi, publicKey } from '@metaplex-foundation/umi';
import { imageUri } from "../types/const";

export const generateCollectionUri = async (config: {
  umi: Umi;
}) => {
  const uri = [
    {
      name: 'DEDOC',
      symbol: 'DEDOC',
      description: 'WEB3 DOCS - ALL ON-CHAIN.',
      seller_fee_basis_points: 0,
      image: imageUri,
      external_url: 'https://www.dedoc.com/',
      collection: {
        name: 'DEDOC',
      },
      attributes: [],
      properties: {
        category: 'image',
        creators: [
          {
            address: config.umi.payer.publicKey,
            share: 100,
          },
        ],
      },
    },
  ];
  return uri;
};
