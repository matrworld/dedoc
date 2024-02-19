import { Theme } from 'daisyui';

export const createProjectConfigUri = async (config: {
  name: string;
  theme: Theme;
  image: string;
  creator: string;
}) => {
  const json = [
    {
      name: '_dedoc',
      symbol: 'DEDOC',
      description: '',
      seller_fee_basis_points: 0,
      image: config.image,
      external_url: 'https://dedoc.net',
      collection: {
        name: config.name,
      },
      attributes: [
        {
          trait_type: 'pages',
          value: {
            name: 'root',
            children: [
              {
                id: 'mintid',
                children: [],
              },
            ],
          },
        },
        {
          trait_type: 'theme',
          value: config.theme,
        },
        {
          trait_type: 'deployments',
          value: ['ar.net/asdfjasofjasofhaewoh'],
        },
      ],
      properties: {
        category: 'image',
        creators: [
          {
            address: config.creator,
            share: 100,
          },
        ],
      },
    },
  ];
  return json;
};
