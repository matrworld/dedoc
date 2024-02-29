import { DasApiAsset } from '@metaplex-foundation/digital-asset-standard-api';
import { Umi } from '@metaplex-foundation/umi';
import { Collection, GetUserResponse } from '../types/project';
import { Project } from '../types/project';

export const getUser = async (umi: Umi): Promise<Collection[]> => {
  const collectionsByCreator = await umi.rpc.getAssetsByCreator({
    creator: umi.payer.publicKey,
    onlyVerified: true,
    limit: 1000,
  });

  const userCollections: Collection[] = [];

  if (!collectionsByCreator.items) {
    return userCollections;
  }

  for (const collection of collectionsByCreator.items) {
    if (collection.content.metadata.name.toLocaleLowerCase() === "dedoc") {
      const response = await umi.rpc.getAssetsByGroup({
        groupKey: 'collection',
        groupValue: collection.id,
      });

      const assets = response.items || [] as Array<DasApiAsset>; 

      const projects: Project[] = [];

      for (const asset of assets) {
        const json = await fetch(asset.content.json_uri).then((res) => res.json() as Promise<Project>);

        json.id = asset.id;

        projects.push(json);
      }

      const collectionData: Collection = {
        id: collection.id,
        projects, 
      };

      userCollections.push(collectionData);
    }
  }

  return userCollections;
};
