import express from 'express';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import { PORT } from './env';
import { swaggerSpecs } from './swagger';

const app = express();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

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