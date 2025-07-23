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
 *                         example: "stop_12345"
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
 *                   example: "Failed to fetch stops"
 */

/**
 * @swagger
 * /stops/{stopId}/coordinates:
 *   get:
 *     summary: Fetch GPS coordinates of a stop by its ID
 *     tags: [Stops]
 *     parameters:
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The stop ID (5-digit integer)
 *         example: "11001"
 *     responses:
 *       200:
 *         description: Coordinates of the stop
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       example: 42.360111
 *                     longitude:
 *                       type: number
 *                       example: -71.058978
 *       400:
 *         description: Invalid Stop ID
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
 *                   example: "Invalid Stop ID - Light/Heavy rail stop IDs must be positive 5-digit integers."
 *       404:
 *         description: Stop not found
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
 *                   example: "Stop not found"
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
 *                   example: "Failed to fetch Stop's GPS Coordinates"
 */

/**
 * @swagger
 * /stops/{stopId}/lines:
 *   get:
 *     summary: Fetch line names going through a stop by its ID
 *     tags: [Stops]
 *     parameters:
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The stop ID (5-digit integer)
 *         example: "11001"
 *     responses:
 *       200:
 *         description: List of line names
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
 *                     type: string
 *                   example: ["Red Line", "Mattapan Trolley"]
 *       400:
 *         description: Invalid Stop ID
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
 *                   example: "Invalid Stop ID - Light/Heavy rail stop IDs must be positive 5-digit integers."
 *       404:
 *         description: Stop not found
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
 *                   example: "Stop not found"
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
 *                   example: "Failed to fetch lines going through stop"
 */

/**
 * @swagger
 * /stops/{stopId}/adjacent_stops:
 *   get:
 *     summary: Fetch adjacent stops on each line going through a stop for a given stop ID
 *     tags: [Stops]
 *     parameters:
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The stop ID (5-digit integer)
 *         example: "11001"
 *     responses:
 *       200:
 *         description: Adjacent stops on each line
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
 *                       line:
 *                         type: string
 *                         example: "Green-B"
 *                       adjacent_stops:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "stop_12345"
 *                             attributes:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: "Stop Name"
 *                                 description:
 *                                   type: string
 *                                   example: "Stop Description"
 *                                 latitude:
 *                                   type: number
 *                                   example: 42.3601
 *                                 longitude:
 *                                   type: number
 *                                   example: -71.0589
 *                             parent_station:
 *                               type: string
 *                               example: "parent_station_123"
 *       400:
 *         description: Invalid Stop ID
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
 *                   example: "Invalid Stop ID - Light/Heavy rail stop IDs must be positive 5-digit integers."
 *       404:
 *         description: Stop not found
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
 *                   example: "Stop not found"
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
 *                   example: "Failed to fetch adjacent stops"
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