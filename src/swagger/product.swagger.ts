export default {
    paths: {
      "/products": {
        get: {
          tags: ["Products"],
          summary: "Get Available Products",
          parameters: [
            {
                name: 'page',
                in: 'query',
                description: 'Page Number',
                type: 'integer',
                default: 0,
              },
          ],
          responses: {
            200: {
              description: "Success",
            },
            400: {
              description: "Error",
            },
          },
        },
      },
    },
    definitions: {
        PRoduct: {
          type: "object",
         
        },
     
      },
  };
  