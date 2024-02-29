import { Project, DEFAULT_PROJECT } from "../types/project";

export const createProjectConfigUri = async (config: {
  name: string;
  image: string;
}) => {
  const json: Project = DEFAULT_PROJECT({
    name: config.name,
    image: config.image,
  });
  
  return json;
};
