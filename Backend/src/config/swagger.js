import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "BMC-Link API",
      version: "1.0.0",
      description:
        "REST API documentation for the BuyMeACoffee Link Backend API. This API provides authentication, creator profile management, and creator link management.",
      contact: {
        name: "Srijon Paul",
      },
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
        description: "Local Development Server",
      },
    ],

    security: [
      {
        BearerAuth: [],
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Provide the JWT access token in the Authorization header.\n\nExample:\nBearer eyJhbGciOiJIUzI1NiIs...",
        },
      },

      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            statusCode: {
              type: "integer",
              example: 200,
            },
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              description: "Response payload",
              nullable: true,
            },
          },
        },

        ApiError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            statusCode: {
              type: "integer",
              example: 400,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              nullable: true,
              items: {
                type: "string",
              },
              example: [],
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 54,
            },
            totalPages: {
              type: "integer",
              example: 6,
            },
          },
        },

        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            profilePicture: {
              type: "string",
              nullable: true,
              example: "https://example.com/profile.jpg",
            },
            role: {
              type: "string",
              example: "CREATOR",
            },
            status: {
              type: "string",
              example: "ACTIVE",
            },
          },
        },

        Profile: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            email: {
              type: "string",
              format: "email",
            },

            name: {
              type: "string",
            },

            phone: {
              type: "string",
              nullable: true,
            },

            profilePicture: {
              type: "string",
              nullable: true,
            },

            timezone: {
              type: "string",
            },

            language: {
              type: "string",
            },

            creatorProfile: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },

                username: {
                  type: "string",
                },

                headline: {
                  type: "string",
                  nullable: true,
                },

                bio: {
                  type: "string",
                  nullable: true,
                },

                avatar: {
                  type: "string",
                  nullable: true,
                },

                coverImage: {
                  type: "string",
                  nullable: true,
                },

                website: {
                  type: "string",
                  nullable: true,
                },

                accentColor: {
                  type: "string",
                  nullable: true,
                },

                theme: {
                  type: "object",

                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                    },

                    name: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          properties: {
            refreshToken: {
              type: "string",
              description:
                "Refresh token. Optional when sent through HTTP Only cookie.",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",

          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              example: "Srijon Paul",
            },

            phone: {
              type: "string",
              example: "+919999999999",
              nullable: true,
            },

            profilePicture: {
              type: "string",
              format: "uri",
              nullable: true,
            },

            timezone: {
              type: "string",
              example: "Asia/Kolkata",
            },

            language: {
              type: "string",
              example: "en",
            },

            headline: {
              type: "string",
              maxLength: 120,
              nullable: true,
            },

            bio: {
              type: "string",
              maxLength: 500,
              nullable: true,
            },

            avatar: {
              type: "string",
              format: "uri",
              nullable: true,
            },

            coverImage: {
              type: "string",
              format: "uri",
              nullable: true,
            },

            website: {
              type: "string",
              format: "uri",
              nullable: true,
            },

            accentColor: {
              type: "string",
              example: "#6366F1",
              nullable: true,
            },

            themeId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
          },
        },

        PublicProfile: {
          type: "object",

          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            username: {
              type: "string",
            },

            headline: {
              type: "string",
              nullable: true,
            },

            bio: {
              type: "string",
              nullable: true,
            },

            avatar: {
              type: "string",
              nullable: true,
            },

            coverImage: {
              type: "string",
              nullable: true,
            },

            website: {
              type: "string",
              nullable: true,
            },

            accentColor: {
              type: "string",
              nullable: true,
            },

            theme: {
              type: "object",

              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },

                name: {
                  type: "string",
                },
              },
            },

            user: {
              type: "object",

              properties: {
                name: {
                  type: "string",
                },

                profilePicture: {
                  type: "string",
                  nullable: true,
                },
              },
            },
          },
        },

        UsernameAvailability: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "johndoe",
            },
            available: {
              type: "boolean",
              example: true,
            },
          },
        },
        CreateLinkRequest: {
          type: "object",

          required: ["url", "type"],

          properties: {
            title: {
              type: "string",
              maxLength: 100,
            },

            url: {
              type: "string",
              format: "uri",
            },

            type: {
              type: "string",
              enum: [
                "WEBSITE",
                "YOUTUBE",
                "INSTAGRAM",
                "FACEBOOK",
                "TWITTER",
                "GITHUB",
                "CUSTOM",
              ],
            },

            icon: {
              type: "string",
            },

            thumbnail: {
              type: "string",
              format: "uri",
            },

            position: {
              type: "integer",
            },

            isFeatured: {
              type: "boolean",
            },

            isActive: {
              type: "boolean",
              description: "Filter active or inactive links",
            },

            startDate: {
              type: "string",
              format: "date-time",
            },

            endDate: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ReorderLinksRequest: {
          type: "object",

          required: ["links"],

          properties: {
            links: {
              type: "array",

              items: {
                type: "object",

                required: ["id", "position"],

                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                  },

                  position: {
                    type: "integer",
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        UpdateLinkRequest: {
          type: "object",

          properties: {
            title: {
              type: "string",
              maxLength: 100,
            },

            url: {
              type: "string",
              format: "uri",
            },

            type: {
              type: "string",
              enum: [
                "WEBSITE",
                "YOUTUBE",
                "INSTAGRAM",
                "FACEBOOK",
                "TWITTER",
                "GITHUB",
                "CUSTOM",
              ],
            },

            icon: {
              type: "string",
            },

            thumbnail: {
              type: "string",
              format: "uri",
            },

            position: {
              type: "integer",
            },

            isFeatured: {
              type: "boolean",
            },

            isActive: {
              type: "boolean",
              description: "Filter active or inactive links",
            },

            startDate: {
              type: "string",
              format: "date-time",
            },

            endDate: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Link: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
              nullable: true,
            },
            url: {
              type: "string",
              format: "uri",
            },
            type: {
              type: "string",
              enum: [
                "WEBSITE",
                "YOUTUBE",
                "INSTAGRAM",
                "FACEBOOK",
                "TWITTER",
                "GITHUB",
                "CUSTOM",
              ],
            },
            icon: {
              type: "string",
              nullable: true,
            },
            thumbnail: {
              type: "string",
              nullable: true,
            },
            position: {
              type: "integer",
            },
            isFeatured: {
              type: "boolean",
            },
            isActive: {
              type: "boolean",
              description: "Filter active or inactive links",
            },
            clickCount: {
              type: "integer",
            },
            startDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            endDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        LinkList: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Link",
              },
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },
      },

      parameters: {
        LinkId: {
          name: "id",
          in: "path",
          required: true,
          description: "Unique Link ID",
          schema: {
            type: "string",
            format: "uuid",
          },
          example: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111",
        },

        Username: {
          name: "username",
          in: "path",
          required: true,
          description: "Creator username",
          schema: {
            type: "string",
            minLength: 3,
            maxLength: 30,
          },
          example: "john_doe",
        },

        Page: {
          name: "page",
          in: "query",
          description: "Page number",
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
        },

        Limit: {
          name: "limit",
          in: "query",
          description: "Records per page",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },

        Search: {
          name: "search",
          in: "query",
          description: "Search by title",
          schema: {
            type: "string",
          },
        },

        Type: {
          name: "type",
          in: "query",
          description: "Filter by link type",
          schema: {
            type: "string",
            enum: [
              "WEBSITE",
              "YOUTUBE",
              "INSTAGRAM",
              "FACEBOOK",
              "TWITTER",
              "GITHUB",
              "CUSTOM",
            ],
          },
        },

        IsActive: {
          name: "isActive",
          in: "query",
          schema: {
            type: "boolean",
          },
          description: "Filter active or inactive links",
        },

        SortBy: {
          name: "sortBy",
          in: "query",
          schema: {
            type: "string",
            enum: ["title", "createdAt", "updatedAt", "position", "clickCount"],
          },
          description: "Field used for sorting",
        },

        Order: {
          name: "order",
          in: "query",
          schema: {
            type: "string",
            enum: ["asc", "desc"],
          },
          description: "Sorting order",
        },
      },

      responses: {
        BadRequest: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiError",
              },
              example: {
                success: false,
                statusCode: 400,
                message: "Validation failed",
                errors: [],
              },
            },
          },
        },

        Unauthorized: {
          description: "Authentication required",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiError",
              },
              example: {
                success: false,
                statusCode: 401,
                message: "Authentication required",
                errors: [],
              },
            },
          },
        },

        Forbidden: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiError",
              },
              example: {
                success: false,
                statusCode: 403,
                message: "Forbidden",
                errors: [],
              },
            },
          },
        },

        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiError",
              },
              example: {
                success: false,
                statusCode: 404,
                message: "Resource not found",
                errors: [],
              },
            },
          },
        },

        Conflict: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiError",
              },
              example: {
                success: false,
                statusCode: 409,
                message: "Resource already exists",
                errors: [],
              },
            },
          },
        },

        InternalServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiError",
              },
              example: {
                success: false,
                statusCode: 500,
                message: "Internal Server Error",
                errors: [],
              },
            },
          },
        },
      },

      examples: {
        LoginSuccess: {
          value: {
            statusCode: 200,
            success: true,
            message: "Login successful",
          },
        },

        RefreshSuccess: {
          value: {
            statusCode: 200,
            success: true,
            message: "Token refreshed",
          },
        },

        ProfileUpdated: {
          value: {
            statusCode: 200,
            success: true,
            message: "Profile updated successfully",
          },
        },

        LinkCreated: {
          value: {
            statusCode: 201,
            success: true,
            message: "Link created successfully",
          },
        },

        LinkUpdated: {
          value: {
            statusCode: 200,
            success: true,
            message: "Link updated successfully",
          },
        },

        LinkDeleted: {
          value: {
            statusCode: 200,
            success: true,
            message: "Link deleted successfully",
          },
        },

        UsernameAvailable: {
          value: {
            username: "john_doe",
            available: true,
          },
        },

        UsernameUnavailable: {
          value: {
            username: "john_doe",
            available: false,
          },
        },
      },
    },

    tags: [
      {
        name: "Authentication",
        description:
          "Authentication, authorization and session management APIs",
      },
      {
        name: "Account",
        description: "Creator profile and account management APIs",
      },
      {
        name: "Links",
        description: "Creator link management APIs",
      },
      {
        name: "Health",
        description: "Health check endpoints",
      },
    ],
  },

  apis: ["./src/docs/*.js", "./src/modules/**/*.swagger.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
