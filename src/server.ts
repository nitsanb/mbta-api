import express from 'express';
import { Stop, Coordinates, AdjacentStopsOnLine } from './types';
import swaggerUi from 'swagger-ui-express';
import { fetchAllStops, fetchAndCacheAllStops, fetchLineNamesByParentStation, fetchAdjacentStops } from './mbta-api';
import { PORT } from './env';
import { swaggerSpecs } from './swagger';

const app = express();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Fetch all rail stops from MBTA API
app.get('/stops', async (_, res) => {
    try {
        const apiResponse: ApiResponse<Stop[]> = {
            success: true,
            data: await fetchAndCacheAllStops()
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

app.get('/stops/:stopId/coordinates', async (req, res) => {
    const { stopId } = req.params;
    // Validate stopId
    const id = parseInt(stopId);
    if (isNaN(id) || id < 10000 || id > 99999) {
        const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid Stop ID - Light/Heavy rail stop IDs must be positive 5-digit integers.'
        };
        return res.status(400).json(response);
    }

    try {
        const allStops = await fetchAllStops();
        // Check if the stop exists
        const stop = allStops.find(s => s.id === stopId);
        if (!stop) {
            return res.status(404).json({
                success: false,
                error: 'Stop not found'
            });
        }

        const apiResponse: ApiResponse<Coordinates> = {
            success: true,
            data: {
                latitude: stop.attributes.latitude,
                longitude: stop.attributes.longitude
            }
        };

        res.json(apiResponse);
    } catch (error) {
        console.error('Error fetching Stop\'s GPS Coordinates:', error);

        const apiResponse: ApiResponse<null> = {
            success: false,
            error: 'Failed to fetch Stop\'s GPS Coordinates'
        };

        res.status(500).json(apiResponse);
    }
});

app.get('/stops/:stopId/lines', async (req, res) => {
    const { stopId } = req.params;
    // Validate stopId
    const id = parseInt(stopId);
    if (isNaN(id) || id < 10000 || id > 99999) {
        const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid Stop ID - Light/Heavy rail stop IDs must be positive 5-digit integers.'
        };
        return res.status(400).json(response);
    }

    try {
        const allStops = await fetchAllStops();
        // Check if the stop exists
        const stop = allStops.find(s => s.id === stopId);
        if (!stop) {
            return res.status(404).json({
                success: false,
                error: 'Stop not found'
            });
        }

        // Fetch lines for the stop
        const lines = await fetchLineNamesByParentStation(stop.parent_station);
        const apiResponse: ApiResponse<string[]> = {
            success: true,
            data: lines
        };

        res.json(apiResponse);
    } catch (error) {
        console.error('Error fetching lines going through stop:', error);

        const apiResponse: ApiResponse<null> = {
            success: false,
            error: 'Failed to fetch lines going through stop'
        };

        res.status(500).json(apiResponse);
    }
});

app.get('/stops/:stopId/adjacent_stops', async (req, res) => {
    const { stopId } = req.params;
    // Validate stopId
    const id = parseInt(stopId);
    if (isNaN(id) || id < 10000 || id > 99999) {
        const response: ApiResponse<null> = {
            success: false,
            error: 'Invalid Stop ID - Light/Heavy rail stop IDs must be positive 5-digit integers.'
        };
        return res.status(400).json(response);
    }

    try {
        const allStops = await fetchAllStops();
        // Check if the stop exists
        const stop = allStops.find(s => s.id === stopId);
        if (!stop) {
            return res.status(404).json({
                success: false,
                error: 'Stop not found'
            });
        }

        // Fetch lines for the stop
        const adjacentStopsArray = await fetchAdjacentStops(stop);

        const apiResponse: ApiResponse<AdjacentStopsOnLine[]> = {
            success: true,
            data: adjacentStopsArray
        };

        res.json(apiResponse);
    } catch (error) {
        console.error('Error fetching lines going through stop:', error);

        const apiResponse: ApiResponse<null> = {
            success: false,
            error: 'Failed to fetch lines going through stop'
        };

        res.status(500).json(apiResponse);
    }
});


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