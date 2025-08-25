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
    metadata:{
        "tags":[],
        "concepts":[]
    },
    sys:{
        space:{
            sys:{
                type:"Link",
                linkType:"Space",
                id:"g08mvfhb24ji"
            }
        },
        id:"5uU32OJb2dDRVVvCluea7H",
        type:"Entry",
        createdAt:"2025-08-13T09:42:07.299Z",
        updatedAt:"2025-08-13T09:42:07.299Z",
        environment:{
            sys:{
                id:"master",
                type:"Link",
                linkType:"Environment"
            }
        },
        publishedVersion:4,
        revision:1,
        contentType:{
            sys:{
                type:"Link",
                linkType:"ContentType",
                id:"media"
            }
        },
        locale:"en-US"
    },
    fields:{
        title:"fibre optics",
        img:{
            metadata:{
                tags:[],
                concepts:[]
            },
            sys:{
                space:{
                    sys:{
                        type:"Link",
                        linkType:"Space",
                        id:"g08mvfhb24ji"
                    }
                },
                id:"1f7AgrPToazvtgXiEc1J8Z",
                type:"Asset",
                createdAt:"2025-08-13T09:41:53.080Z",
                updatedAt:"2025-08-13T09:41:53.080Z",
                environment:{
                    sys:{
                        id:"master",
                        type:"Link",
                        linkType:"Environment"
                    }
                },
                publishedVersion:5,
                revision:1,
                locale:"en-US"
            },
            fields:{
                title:"dsdasdasd",
                description:"dasdada",
                file:{
                    url:"//images.ctfassets.net/g08mvfhb24ji/1f7AgrPToazvtgXiEc1J8Z/6d833ffc11080891d58b733b065537f6/fiber-optic.webp",
                    details:{
                        size:16558,
                        image:{
                            width:750,
                            height:430
                        }
                    },
                    fileName:"fiber-optic.webp",
                    contentType:"image/webp"
                }
            },
            "isVideo":false,
            "ministry":{
                metadata:{
                    tags:[],
                    concepts:[]
                },
                sys:{
                    space:{
                        sys:{
                            type:"Link",
                            linkType:"Space",
                            id:"g08mvfhb24ji"
                        }
                    },
                    id:"1sOjmVJdowuZ4ZUs23nVQJ",
                    type:"Entry",
                    createdAt:"2025-08-13T08:00:41.065Z",
                    updatedAt:"2025-08-13T08:00:41.065Z",
                    environment:{
                        sys:{
                            id:"master",
                            type:"Link",
                            linkType:"Environment"
                        }
                    },
                    publishedVersion:5,
                    revision:1,
                    contentType:{
                        sys:{
                            type:"Link",
                            linkType:"ContentType",
                            id:"ministry"
                        }
                    },
                    locale:"en-US"
                },
                fields:{
                    ministryName:"Ministry of Science, Innovation and Technology",
                    slug:"ministry-of-science-innovation-and-technology"
                }
            }
        }
    }
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