// --- Import Required Modules ---
const express = require('express'); // Web server framework
const fs = require('fs');         // Node.js File System module
const path = require('path');       // Node.js Path module

// --- Basic Server Setup ---
const app = express(); // Create the server instance
const PORT = 3000;     // Define the port number
const REVIEWS_FILE = path.join(__dirname, 'reviews.json'); // Path to our database file

// --- Middleware ---
// 1. To parse incoming JSON data (like new reviews)
app.use(express.json());
// 2. To serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// --- API Endpoints ---

// Serve the main HTML file when accessing the root URL
app.get('/', (req, res) => {
    // Ensure this filename matches your HTML file EXACTLY
    res.sendFile(path.join(__dirname, 'voting.html'));
});

// GET /reviews : Read and send the reviews.json content
app.get('/reviews', (req, res) => {
    fs.readFile(REVIEWS_FILE, 'utf8', (err, data) => {
        // Handle file reading errors
        if (err) {
            console.error(`[${new Date().toISOString()}] Error reading reviews.json:`, err);
            // If the file doesn't exist, send an empty JSON object
            if (err.code === 'ENOENT') {
                console.log(`[${new Date().toISOString()}] reviews.json not found, sending empty object.`);
                return res.status(200).json({}); // Send {} instead of erroring
            }
            // For other read errors, send a server error status
            return res.status(500).json({ error: 'Could not load reviews file.' });
        }
        // Handle empty file case
        if (!data || data.trim() === '') {
             console.log(`[${new Date().toISOString()}] reviews.json is empty, sending empty object.`);
             return res.status(200).json({});
        }
        // Try to parse the file content as JSON
        try {
            // Check if data is already valid JSON before sending
            JSON.parse(data);
            res.setHeader('Content-Type', 'application/json');
            res.send(data); // Send the raw JSON string from the file
        } catch (parseError) {
            console.error(`[${new Date().toISOString()}] Error parsing reviews.json content:`, parseError);
            res.status(500).json({ error: 'Review data file is corrupted or not valid JSON.' });
        }
    });
});

// POST /add-review : Receive a new review and save it
app.post('/add-review', (req, res) => {
    const newReview = req.body; // {author, text, optionName}

    // Basic validation
    if (!newReview || !newReview.author || !newReview.text || !newReview.optionName) {
        console.warn(`[${new Date().toISOString()}] Received invalid review data:`, newReview);
        return res.status(400).json({ error: 'Invalid review data provided. Author, text, and optionName are required.' });
    }

    // Read the current reviews
    fs.readFile(REVIEWS_FILE, 'utf8', (err, data) => {
        let reviews = {};
        // Handle file reading errors (excluding "file not found")
        if (err && err.code !== 'ENOENT') {
            console.error(`[${new Date().toISOString()}] Error reading reviews.json for writing:`, err);
            return res.status(500).json({ error: 'Error reading reviews file before saving.' });
        }
        // If file exists and is not empty, try parsing it
        if (!err && data && data.trim() !== '') {
            try {
                reviews = JSON.parse(data);
            } catch (parseError) {
                console.error(`[${new Date().toISOString()}] Error parsing reviews.json for writing:`, parseError);
                return res.status(500).json({ error: 'Error parsing existing reviews before saving.' });
            }
        }

        // Add the new review (create array if needed)
        if (!reviews[newReview.optionName]) {
            reviews[newReview.optionName] = [];
        }
        reviews[newReview.optionName].push({ author: newReview.author, text: newReview.text });

        // Write the updated reviews back to the file
        fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8', (writeErr) => { // Use null, 2 for pretty-printing
            if (writeErr) {
                console.error(`[${new Date().toISOString()}] Error writing to reviews.json:`, writeErr);
                return res.status(500).json({ error: 'Error saving the review to the file.' });
            }
            console.log(`[${new Date().toISOString()}] Review saved successfully:`, {option: newReview.optionName, author: newReview.author});
            res.status(200).json({ message: 'Review saved successfully!' });
        });
    });
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`✅ Server is running and listening on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    // Check if reviews.json exists, create if not with an empty object {}
    if (!fs.existsSync(REVIEWS_FILE)) {
        console.log(`📝 reviews.json not found, creating an empty one.`);
        try {
            fs.writeFileSync(REVIEWS_FILE, JSON.stringify({}, null, 2), 'utf8'); // Start with {}
            console.log(`📄 Successfully created empty reviews.json`);
        } catch (createErr) {
            console.error(`❌ Failed to create reviews.json:`, createErr);
        }
    } else {
        console.log(`📄 Found existing reviews.json`);
    }
});