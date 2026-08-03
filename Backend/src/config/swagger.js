import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "BMC-Link API",
			version: "1.0.0",
			description:
				"REST API documentation for BuyMeACoffee Link Backend",
			contact: {
				name: "Srijon Paul"
			}
		},

		servers: [
			{
				url: `http://localhost:${process.env.PORT}/api/v1`,
				description: "Development Server"
			}
		],

		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				}
			}
		},

		security: [
			{
				BearerAuth: []
			}
		],

		tags: [
			{
				name: "Health",
				description: "Server Health"
			},
			{
				name: "Authentication",
				description: "Authentication APIs"
			},
			{
				name: "Account",
				description: "Creator Account APIs"
			},
			{
				name: "Links",
				description: "Creator Links APIs"
			}
		]
	},

	apis: [
		"./src/docs/*.js",
		"./src/modules/**/*.swagger.js"
	]
};

const swaggerSpec = swaggerJsdoc(options);

export {
	swaggerUi,
	swaggerSpec
};