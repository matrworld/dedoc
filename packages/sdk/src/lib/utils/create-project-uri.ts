import { Project } from "../types/project";


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
