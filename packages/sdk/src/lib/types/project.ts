import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";

export type PageNode = {
  id: string;
  children: PageNode[];
}

export type PageTree = PageNode[];

export type PageTreePath = number[];

export type ProjectEnvironment = "production" | "staging";

export type ProjectDeployment = {
  [environment in ProjectEnvironment]: string;
}

export type PageMetadata = {
  name: string;
  content: string;
};

export type Pages = {
  tree: PageTree;
  metadata: {
      [id: string]: PageMetadata
  }
}

export type Project = {  
  collection?: string; 
  id: string;
  name: string;
  theme: string;
  image: string; 
  deployments: ProjectDeployment;
  pages: Pages
}

export type Team = {
  image: string;
  name: string;
  projects: string[];
};

  type GetUserResponse = {
    collections: Collection[];
  };
  type Collection = {
    id: string;
    projects: Project[];
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
    type GetUserResponse, 
    type Collection,
}