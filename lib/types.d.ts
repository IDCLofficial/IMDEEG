export interface Ministry {
    sys: {
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    fields: {
        ministryName: string;
        slug: string;
        description?: string;
    };
}

export interface Author {
    sys: {
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    fields: {
        name: string;
        bio?: string;
        avatar?: {
            sys: {
                id: string;
                type: string;
            };
            fields: {
                title: string;
                description?: string;
                file: {
                    url: string;
                    fileName: string;
                    contentType: string;
                };
            };
        };
    };
}

export interface NewsPost {
    sys: {
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    fields: {
        title: string;
        slug: string;
        featuredImage?: {
            sys: {
                id: string;
                type: string;
            };
            fields: {
                title: string;
                description?: string;
                file: {
                    url: string;
                    fileName: string;
                    contentType: string;
                };
            };
        };
        media?: Array<{
            sys: {
                id: string;
                type: string;
            };
            fields: {
                title: string;
                description?: string;
                file: {
                    url: string;
                    fileName: string;
                    contentType: string;
                };
            };
        }>;
        ministry?: Ministry;
        author?: Author;
        content: {
            content: Array<{
                content: Array<{
                    value: string;
                    marks?: Array<{ type: string }>;
                }>;
                nodeType: string;
            }>;
            nodeType: string;
        },
        fullNews: string,
        category:{
            fields:{
                category_name:string
            }
        }
    };
} 

export interface Media {
    metadata: {
        tags: string[];
        concepts: string[];
    };
    sys: {
        space: {
            sys: {
                type: string;
                linkType: string;
                id: string;
            };
        };
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
        environment: {
            sys: {
                id: string;
                type: string;
                linkType: string;
            };
        };
        publishedVersion: number;
        revision: number;
        contentType: {
            sys: {
                type: string;
                linkType: string;
                id: string;
            };
        };
        locale: string;
    };
    fields: {
        title: string;
        img: {
            metadata: {
                tags: string[];
                concepts: string[];
            };
            sys: {
                space: {
                    sys: {
                        type: string;
                        linkType: string;
                        id: string;
                    };
                };
                id: string;
                type: string;
                createdAt: string;
                updatedAt: string;
                environment: {
                    sys: {
                        id: string;
                        type: string;
                        linkType: string;
                    };
                };
                publishedVersion: number;
                revision: number;
                locale: string;
            };
            fields: {
                title: string;
                description: string;
                file: {
                    url: string;
                    details: {
                        size: number;
                        image: {
                            width: number;
                            height: number;
                        };
                    };
                    fileName: string;
                    contentType: string;
                };
            };
        };
        isVideo: boolean;
        ministry?: Ministry;
    };
}

export interface Events {
        sys: {
            id: string;
            type: string;
            createdAt: string;
            updatedAt: string;
        };
        fields: {
            eventName: string;
            briefDescription: string;
            fullDescription?: string;
            eventDate: string;
            location?: string;
            contactPhoneNumber?: string;
            bannerImage?: {
                sys: {
                    id: string;
                    type: string;
                };
                fields: {
                    title: string;
                    description?: string;
                    file: {
                        url: string;
                        fileName: string;
                        contentType: string;
                    };
                };
            };
            firstSpeaker?: string;
            firstSpeakerPicture?: {
                sys: {
                    id: string;
                    type: string;
                };
                fields: {
                    title: string;
                    description?: string;
                    file: {
                        url: string;
                        fileName: string;
                        contentType: string;
                    };
                };
            };
            secondSpeaker?: string;
            secondSpeakerPicture?: {
                sys: {
                    id: string;
                    type: string;
                };
                fields: {
                    title: string;
                    description?: string;
                    file: {
                        url: string;
                        fileName: string;
                        contentType: string;
                    };
                };
            };
            ministry?: Ministry;
        };
}
export interface ProjectAsset {
    sys: {
        id: string;
        type: string;
    };
    fields: {
        title: string;
        description?: string;
        file: {
            url: string; 
            fileName: string;
            contentType: string; 
            details?: {
                size?: number;
                image?: { width: number; height: number };
            };
        };
    };
}

export interface Project {
    sys: {
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    fields: {
        projectTitle: string;
        projectDescription: string;
        projectImage?: ProjectAsset;
        ministry?: Ministry;
        partners?: ProjectAsset[];
        startDate?: string; 
        proposedEndDate?: string; 
    };
}

export interface ProjectsResponse {
    sys: { type: string }; 
    total: number;
    skip: number;
    limit: number;
    items: Project[];
    includes?: {
        Entry?: Ministry[]; 
        Asset?: ProjectAsset[];
    };
}

export interface Category {
    sys: {
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    fields: {
        category_name: string;
    };
}

export interface Publication {
    key: string;
    title: string;
    filename: string;
    size: number;
    lastModified: string;
    contentType: string;
    category: string;
    downloadUrl: string;
    viewUrl: string;
}

export interface PublicationsResponse {
    items: Publication[];
    total: number;
}