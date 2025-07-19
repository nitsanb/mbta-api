import express from 'express';
import axios from 'axios';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TypeScript API Server',
            version: '1.0.0',
            description: 'A simple Express server that fetches data from external APIs',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/server.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Types
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID from JSONPlaceholder API
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The post ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
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
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
 *                     body:
 *                       type: string
 *                       example: "quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto"
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
app.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID parameter
        const postId = parseInt(id);
        if (isNaN(postId) || postId < 1) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Invalid post ID. Must be a positive integer.'
            };
            return res.status(400).json(response);
        }

        // Make external API request to JSONPlaceholder
        const apiResponse = await axios.get<Post>(
            `https://jsonplaceholder.typicode.com/posts/${postId}`
        );

        // JSONPlaceholder returns an empty object for non-existent posts
        if (!apiResponse.data.id) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Post not found'
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse<Post> = {
            success: true,
            data: apiResponse.data
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching post:', error);

        const response: ApiResponse<null> = {
            success: false,
            error: 'Failed to fetch post'
        };

        res.status(500).json(response);
    }
});

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
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;