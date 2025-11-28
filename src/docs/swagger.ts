import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

export function setupSwagger(app: Express) {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "AnonyTools API",
                version: "1.0.0",
                description: "Documentação da API da AnonyTools",
            },
            servers: [
                {
                    url: "http://localhost:3002",
                },
            ],
            components: {
                securitySchemes: {
                    cookieAuth: {
                        type: "apiKey",
                        in: "cookie",
                        name: "token",
                    },
                },
            },
        },

        apis: [path.resolve(__dirname, "../modules/**/*.ts")],
    };

    const swaggerSpec = swaggerJsdoc(options);

    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
        })
    );
}
