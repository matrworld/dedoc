import { Theme } from 'daisyui';

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
export const createProjectConfigUri = async (config: {
  name: string;
  description: string;
  theme: 'dark';
  image: string;
  creator: string;
}) => {
  const json: Project = { 
    name: config.name,
    theme: 'dark',
    description: config.description,
    image: config.image,
    deployments: { 
      production: '',
      staging: '',
    }, 
    pages: { 
      tree: [
        {
          id: 'Page1',
          children: [
            {
              id: 'Page1.1',
              children: []
            }
          ]
        }
      ], 
      metadata: { 
        'Page1': { 
          name: 'Page1',
          content: 'Page1 content'
        },
        'Page1.1': { 
          name: 'Page1.1',
          content: 'Page1.1 content'
        }
      }
    }
  }
  return json;
};
