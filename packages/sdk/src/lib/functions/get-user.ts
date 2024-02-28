import { DasApiAssetList } from '@metaplex-foundation/digital-asset-standard-api';
import { Umi } from '@metaplex-foundation/umi';

type GetUserResponse = {
  collections: Collection[];
};
type Collection = {
  id: string;
  projects: DasApiAssetList;
};

export const getUser = async (umi: Umi): Promise<GetUserResponse[]> => {
  const collectionsByCreator = await umi.rpc.getAssetsByCreator({
    creator: umi.payer.publicKey,
    onlyVerified: true,
    limit: 1000,
  });

  if (!collectionsByCreator.items) {
    return [];
  }

  const userCollections: GetUserResponse[] = [];

  for (const collection of collectionsByCreator.items) {
    if (collection.content.metadata.name === 'DeDoc') {
      const assets = await umi.rpc.getAssetsByGroup({
        groupKey: 'collection',
        groupValue: collection.id,
      });

      if (!assets || Object.keys(assets).length === 0) {
        continue;
      }
      const collectionData: Collection = {
        id: collection.id,
        projects: assets as DasApiAssetList, 
      };

      userCollections.push({ collections: [collectionData] });
    }
  }

  if (userCollections.length === 0) {
    return [];
  }

  return userCollections;
};
