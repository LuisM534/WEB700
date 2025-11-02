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


const setData = require('../data/setData.json');
const themeData = require('../data/themeData.json');

class LegoData {
    constructor() {
        this.sets = [];
    }

    initialize() {
        return new Promise((resolve, reject) => {
            try {
                this.sets = [];

                setData.forEach(set => {
                    const themeObj = themeData.find(theme => theme.id == set.theme_id);
                    const themeName = themeObj ? themeObj.name : "Unknown";

                    const setWithTheme = {
                        set_num: set.set_num,
                        name: set.name,
                        year: set.year,
                        theme_id: set.theme_id,
                        num_parts: set.num_parts,
                        img_url: set.img_url,
                        theme: themeName
                    };

                    this.sets.push(setWithTheme);
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
        const filtered = this.sets.filter(set =>
            set.theme.toLowerCase().includes(theme.toLowerCase())
        );

        return filtered.length > 0
            ? Promise.resolve(filtered)
            : Promise.reject(`Unable to find sets with theme containing: ${theme}`);
    }


    addSet(newSet) {
        return new Promise((resolve, reject) => {
            // basic guard
            if (!newSet || !newSet.set_num) {
                return reject("set_num is required");
            }

            const exists = this.sets.some(s => String(s.set_num) === String(newSet.set_num));
            if (exists) {
                return reject("Set already exists");
            }

            const themeObj = themeData.find(t => String(t.id) === String(newSet.theme_id));
            const themeName = themeObj ? themeObj.name : "Unknown";

            const setWithTheme = {
                set_num: String(newSet.set_num),
                name: newSet.name ?? "",
                year: String(newSet.year ?? ""),
                theme_id: String(newSet.theme_id ?? ""),
                num_parts: String(newSet.num_parts ?? ""),
                img_url: newSet.img_url ?? "",
                theme: themeName
            };

            this.sets.push(setWithTheme);
            resolve(); // spec: resolve with no data on success
        });
    }
}
module.exports = LegoData;
