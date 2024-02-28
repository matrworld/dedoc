export const generateCollectionUri = async (config: {
  creator: string;
  imageUri: string;
}) => {
  const uri = [
    {
      name: 'DEDOC',
      symbol: 'DEDOC',
      description: 'WEB3 DOCS.',
      seller_fee_basis_points: 0,
      image: config.imageUri,
      external_url: 'https://www.dedoc.com/',
      collection: {
        name: 'DEDOC',
      },
      attributes: [],
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
  return uri;
};
