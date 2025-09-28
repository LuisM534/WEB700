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


const setData = require('./data/setData.json');
const themeData = require('./data/themeData.json');

class legoData {
    constructor() {
        this.sets =[];
}
initialize() {
    return new Promise((resolve, reject) => {
        try {
            this.sets = []; // reset sets

            setData.forEach(set => {
                const themeObj = themeData.find(theme => theme.id == set.theme_id);

                let themeName;
                if (themeObj) {
                    themeName = themeObj.name;
                } else {
                    themeName = "Unknown";
                }

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

            resolve(); // Initialization complete
        } catch (err) {
            reject("Failed to initialize data: " + err.message);
        }
    });
}

getAllSets() {
    return new Promise((resolve, reject) => {
        try {
            resolve(this.sets);
        } catch (err) {
            reject("Unable to get sets: " + err.message);
        }
    });
}

getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const foundSet = this.sets.find(set => set.set_num === setNum);
        if (foundSet) {
            resolve(foundSet);
        } else {
            reject(`Unable to find set with set_num: ${setNum}`);
        }
    });
}

getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const lowerTheme = theme.toLowerCase();
        const filteredSets = this.sets.filter(set =>
            set.theme.toLowerCase().includes(lowerTheme)
        );

        if (filteredSets.length > 0) {
            resolve(filteredSets);
        } else {
            reject(`Unable to find sets with theme containing: ${theme}`);
        }
    });
}
}



let data = new legoData();

data.initialize()
.then(() => {
    console.log(`Number of Sets: ${data.sets.length}`);

    return data.getSetByNum("0012-1");
})
.then(set => {
    console.log(set);
    return data.getSetsByTheme("tech");
})
.then(sets => {
    console.log(`Number of 'tech' sets: ${sets.length}`);
})
.catch(err => {
    console.error("Error:", err);
});
