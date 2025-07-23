import { PORT } from './env';
import swaggerJsdoc from 'swagger-jsdoc';

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TypeScript API Server',
            version: '1.0.0',
            description: 'A simple Express server that fetches data from the MBTA\'s APIs',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/swagger.ts'], // Path to the API docs (this file)
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);

/**
 * @swagger
 * /stops:
 *   get:
 *     summary: Fetch all stops
 *     tags: [Stops]
 *     responses:
 *       200:
 *         description: A list of stops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "stop_123"
 *                       attributes:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Stop Name"
 *                           description:
 *                             type: string
 *                             example: "Stop Description"
 *                           line:
 *                             type: string
 *                             example: "Red Line"
 *                           latitude:
 *                             type: number
 *                             example: 42.3601
 *                           longitude:
 *                             type: number
 *                             example: -71.0589
 *                       parent_station:
 *                         type: string
 *                         example: "parent_station_123"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Post not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch post"
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-12-07T10:30:00.000Z"
 */