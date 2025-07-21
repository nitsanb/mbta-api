import express from 'express';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import { BASE_URL, Stop, ApiResponse, RouteType } from './mbta-api';
import { PORT } from './env';
import { swaggerSpecs } from './swagger';

const app = express();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get('/stops', async (_, res) => {
    try {
        // Fetch stops from MBTA API
        const [lightStops, heaveyStops] = await Promise.all([
            fetchStops(RouteType.LIGHT_RAIL),
            fetchStops(RouteType.HEAVY_RAIL)
        ]);
        const stops: Stop[] = [...lightStops, ...heaveyStops];

        const apiResponse: ApiResponse<Stop[]> = {
            success: true,
            data: stops
        };

        res.json(apiResponse);
    } catch (error) {
        console.error('Error fetching stops:', error);

        const apiResponse: ApiResponse<null> = {
            success: false,
            error: 'Failed to fetch stops'
        };

        res.status(500).json(apiResponse);
    }
});

/**
 * Fetch light/heave rail stops from MBTA API.
 * 
 * @param routeType - The type of route to filter stops
 * @returns (Promise) Array of stops
 */
async function fetchStops(routeType: RouteType): Promise<Stop[]> {
    return axios.get(`${BASE_URL}/stops?include=route&filter%5Broute_type%5D=${routeType}`)
        .then(response => response.data.data.map((stop: any) => ({
            id: stop.id,
            attributes: stop.attributes,
            parent_station: stop.relationships.parent_station.data.id,
        })))
}

app.get('/health', (_, res) => {
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