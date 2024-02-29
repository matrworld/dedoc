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

export const DEFAULT_PROJECT = (project) => ({
    name: 'Test',
    theme: 'dark',
    image: '',
    deployments: { production: '', staging: '' },
    pages: {
      tree: [
        {
          id: 'root',
          children: [
            {
              id: '000000000',
              children: []
            }
          ]
        }
      ],
      metadata: {
            "000000000": {
              name: 'Getting Started',
              content: `# Getting Started
  ### Things You Can Do
  
  *   Create a page by clicking the "+" button.
  *   Write some content
  *   Save and deploy
  `,
        }
      }
    },
    ...project,
})

export { 
    type Project, 
    type GetUserResponse, 
    type Collection,
}