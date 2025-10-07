/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Luis Marquez Student ID:128986247 Date: 04/Oct/2025
*
*  Published URL: https://assigmentweb700-15f62ntrc-luis-projects-477819df.vercel.app
*
********************************************************************************/
const express = require('express');
const path = require('path');
const LegoData = require('./modules/legoSets');
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;



// Serve static files (like CSS/images if needed)
app.use(express.static('public'));

// Route: GET "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

// Route: GET "/about"

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Route: GET "/lego/sets"
app.get('/lego/sets', async (req, res) => {
    try {
        const theme = req.query.theme;
        if (theme) {
            const filteredSets = await legoData.getSetsByTheme(theme);
            res.json(filteredSets);
        } else {
            const allSets = await legoData.getAllSets();
            res.json(allSets);
        }
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Route: GET "/lego/sets/:set_num"
app.get('/lego/sets/:set_num', async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        res.json(set);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Custom 404 Page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

// Initialize data and start server
legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error("Initialization failed:", err);
    });
