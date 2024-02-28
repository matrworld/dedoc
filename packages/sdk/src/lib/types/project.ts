import { DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";

type PageNode = { 
    id: string;
    children: PageNode[];
  }
  
  type PageTree = PageNode[];
  
  type Project = { 
    name: string;
    theme: 'dark';
    description: string;
    image: string;
    deployments: { 
      production: string;
      staging: string;
    };
    pages: { 
      tree: PageTree;
      metadata: { 
        [id: string]: { 
          name: string;
          content: string;
        }
      }
    }
  }
  type GetUserResponse = {
    collections: Collection[];
  };
  type Collection = {
    id: string;
    projects: DasApiAssetList;
  };

  
  export { 
    type Project, 
    type GetUserResponse, 
    type Collection,
  }