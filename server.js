/********************************************************************************
*  WEB700 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Luis Marquez Student ID:128986247 Date: 02/Nov/2025
*
*  Published URL: https://assigmentweb700-15f62ntrc-luis-projects-477819df.vercel.app
*
********************************************************************************/
const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
});

app.get("/lego/addSet", async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render("addSet", { page: "/lego/addSet", themes });
    } catch {
        res.status(500).send("Failed to load form");
    }
});

app.post("/lego/addSet", async (req, res) => {
    try {
        await legoData.addSet(req.body);
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(422).send(err);
    }
});

app.get("/lego/sets", async (req, res) => {
    try {
        let sets = await legoData.getAllSets();
        const themes = await legoData.getAllThemes();

        const themeMap = new Map(themes.map(t => [String(t.id), t.name]));
        sets = sets.map(s => ({
            ...s,
            theme: themeMap.get(String(s.theme_id)) || "Unknown"
        }));

        if (req.query.theme) {
            const q = req.query.theme.toLowerCase();
            sets = sets.filter(s => s.theme.toLowerCase() === q);
        }

        res.render("sets", {
            page: "/lego/sets",
            sets,
            quickThemes: ["technic", "city", "star wars", "classic town"]
        });
    } catch (err) {
        res.status(500).send(String(err));
    }
});

app.get("/lego/sets/:set_num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        const theme = await legoData.getThemeById(set.theme_id);
        const fullSet = { ...set, theme: theme.name };
        res.render("set", { page: "", set: fullSet });
    } catch {
        res.status(404).render("404", { page: "" });
    }
});

app.get("/lego/deleteSet/:set_num", async (req, res) => {
    try {
        await legoData.deleteSetByNum(req.params.set_num);
        res.redirect("/lego/sets");
    } catch (err) {
        res.status(404).send(err);
    }
});

// 404
app.use((req, res) => {
    res.status(404).render("404", { page: "" });
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port ${HTTP_PORT}`);
    });
});
