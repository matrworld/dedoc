import { Umi, publicKey } from '@metaplex-foundation/umi';
import type { Project } from '../types/project';
import type { DasApiAsset } from '@metaplex-foundation/digital-asset-standard-api';

export async function getProject(umi: Umi, projectId: string, dasAsset?: DasApiAsset): Promise<Project> {
    let dasData: DasApiAsset = dasAsset;

    if(!dasAsset) {
        dasData = await umi.rpc.getAsset(publicKey(projectId));
    }
    
    const project = await fetch(dasData.content.json_uri).then((res) => res.json() as Promise<Project>);

    const { group_value } = dasData.grouping.find(({ group_key }) => group_key === 'collection');

    project.id = dasData.id;
    project.collection = group_value;

    console.log({dasData})

    return project;
}