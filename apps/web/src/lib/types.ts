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
