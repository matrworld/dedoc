export const generateProjectUri = async (config: {
  name: string;
  description: string;
  creator: string;
  imageUri: string;
}) => {
  const uri = [
    {
      name: config.name,
      symbol: 'DEDOC',
      description: config.description,
      seller_fee_basis_points: 0,
      image: config.imageUri,
      external_url: 'https://www.dedoc.com/',
      collection: {
        name: config.name,
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
