import fetch from 'node-fetch';

export const geocodeAddress = async (req, res) => {
     const { text } = req.query;
        if (!text) {
            return res.status(400).json({ error: 'Search text is required' });
        }
        
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
        const url = `https://api.geocode.earth/v1/search?api_key=${GEOCODE_API_KEY}&text=${encodeURIComponent(text)}`;
        
        try {
            const apiResponse = await fetch(url);
            const data = await apiResponse.json();
            res.json(data);
        } catch (error) {
            console.error('Geocode API error:', error);
            res.status(500).json({ error: 'Failed to fetch geocoding data' });
        }
};

export const routes = async (req, res) => {
    const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end points are required' });
        }

        const GRAPHHOPPER_API_KEY = process.env.GRAPHHOPPER_API_KEY;
        const url = `https://graphhopper.com/api/1/route?point=${start}&point=${end}&vehicle=car&key=${GRAPHHOPPER_API_KEY}&points_encoded=true`;

        try {
            const apiResponse = await fetch(url);
            const data = await apiResponse.json();
            res.json(data);
        } catch (error) {
            console.error('GraphHopper API error:', error);
            res.status(500).json({ error: 'Failed to fetch routing data' });
        }
};