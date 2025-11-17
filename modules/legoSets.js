/********************************************************************************
* WEB700 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Luis Marquez Student ID:128986247 Date: 28/Sept/2025
********************************************************************************/

const fs = require("fs");
const path = require("path");

const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

class LegoData {
    constructor() {
        this.sets = [];
        this.themes = [];
        this.jsonPath = path.join(__dirname, "../data/setData.json");
    }

    initialize() {
        return new Promise((resolve, reject) => {
            try {
                this.themes = [...themeData];

                this.sets = setData.map(set => {
                    const themeObj = themeData.find(t => t.id == set.theme_id);
                    return {
                        ...set,
                        theme: themeObj ? themeObj.name : "Unknown"
                    };
                });

                resolve();
            } catch (err) {
                reject("Failed to initialize data: " + err.message);
            }
        });
    }

    getAllSets() {
        return Promise.resolve(this.sets);
    }

    getSetByNum(setNum) {
        const found = this.sets.find(s => s.set_num === setNum);
        return found
            ? Promise.resolve(found)
            : Promise.reject(`Unable to find set with set_num: ${setNum}`);
    }

    getSetsByTheme(theme) {
        const filtered = this.sets.filter(s =>
            s.theme.toLowerCase().includes(theme.toLowerCase())
        );

        return filtered.length > 0
            ? Promise.resolve(filtered)
            : Promise.reject(`Unable to find sets with theme containing: ${theme}`);
    }

    addSet(newSet) {
        return new Promise((resolve, reject) => {
            const exists = this.sets.some(
                s => String(s.set_num) === String(newSet.set_num)
            );
            if (exists) return reject("Set already exists");

            const foundTheme = this.themes.find(
                t => String(t.id) === String(newSet.theme_id)
            );
            const themeName = foundTheme ? foundTheme.name : "Unknown";

            const newSetObject = {
                set_num: newSet.set_num,
                name: newSet.name,
                year: newSet.year,
                theme_id: newSet.theme_id,
                num_parts: newSet.num_parts,
                img_url: newSet.img_url,
                theme: themeName
            };

            this.sets.push(newSetObject);

            const rawData = this.sets.map(s => ({
                set_num: s.set_num,
                name: s.name,
                year: s.year,
                theme_id: s.theme_id,
                num_parts: s.num_parts,
                img_url: s.img_url
            }));

            fs.writeFileSync(this.jsonPath, JSON.stringify(rawData, null, 2));

            resolve();
        });
    }

    deleteSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const index = this.sets.findIndex(s => s.set_num === setNum);
            if (index === -1) return reject("unable to delete: set not found");

            this.sets.splice(index, 1);

            const rawData = this.sets.map(s => ({
                set_num: s.set_num,
                name: s.name,
                year: s.year,
                theme_id: s.theme_id,
                num_parts: s.num_parts,
                img_url: s.img_url
            }));

            fs.writeFileSync(this.jsonPath, JSON.stringify(rawData, null, 2));

            resolve();
        });
    }

    getAllThemes() {
        return Promise.resolve(this.themes);
    }

    getThemeById(id) {
        const found = this.themes.find(t => String(t.id) === String(id));
        return found
            ? Promise.resolve(found)
            : Promise.reject("unable to find requested theme");
    }
}

module.exports = LegoData;
