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
  
  export interface BlogPost {
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
      };
    };
  } 