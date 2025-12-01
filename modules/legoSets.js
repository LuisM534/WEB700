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

// modules/legoSets.js

require("dotenv").config();
require("pg"); 

const { Sequelize, Op } = require("sequelize");

class LegoData {
    constructor() {
       
        this.sequelize = new Sequelize(
            process.env.PGDATABASE,
            process.env.PGUSER,
            process.env.PGPASSWORD,
            {
                host: process.env.PGHOST,
                dialect: "postgres",
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                logging: false
            }
        );

        
        this.Theme = this.sequelize.define(
            "Theme",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: Sequelize.STRING
            },
            { timestamps: false }
        );

        
        this.Set = this.sequelize.define(
            "Set",
            {
                set_num: {
                    type: Sequelize.STRING,
                    primaryKey: true
                },
                name: Sequelize.STRING,
                year: Sequelize.INTEGER,
                num_parts: Sequelize.INTEGER,
                theme_id: Sequelize.INTEGER,
                img_url: Sequelize.STRING
            },
            { timestamps: false }
        );

       
        this.Set.belongsTo(this.Theme, { foreignKey: "theme_id" });

    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.sequelize
                .sync()
                .then(() => resolve())
                .catch((err) => reject("Unable to sync database: " + err));
        });
    }

    
    getAllSets() {
        return this.Set.findAll({ include: [this.Theme] });
    }

    
    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
                include: [this.Theme],
                where: { set_num: setNum }
            })
                .then((sets) => {
                    if (sets.length === 0) return reject("Unable to find requested set");
                    resolve(sets[0]);
                })
                .catch(() => reject("Unable to find requested set"));
        });
    }


    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
                include: [this.Theme],
                where: {
                    "$Theme.name$": {
                        [Op.iLike]: `%${theme}%`
                    }
                }
            })
                .then((sets) => {
                    if (sets.length === 0) return reject("Unable to find requested sets");
                    resolve(sets);
                })
                .catch(() => reject("Unable to find requested sets"));
        });
    }

    
    getAllThemes() {
        return this.Theme.findAll();
    }

    
    addSet(newSet) {
        return new Promise((resolve, reject) => {
            this.Set.create({
                set_num: newSet.set_num,
                name: newSet.name,
                year: parseInt(newSet.year),
                num_parts: parseInt(newSet.num_parts),
                theme_id: parseInt(newSet.theme_id),
                img_url: newSet.img_url
            })
                .then(() => resolve())
                .catch((err) => {
                    if (err.errors && err.errors[0])
                        reject(err.errors[0].message);
                    else reject("Unable to add set");
                });
        });
    }

  
    deleteSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            this.Set.destroy({ where: { set_num: setNum } })
                .then((count) => {
                    if (count === 0) return reject("unable to delete: set not found");
                    resolve();
                })
                .catch((err) => {
                    if (err.errors && err.errors[0])
                        reject(err.errors[0].message);
                    else reject("Unable to delete set");
                });
        });
    }
}

module.exports = LegoData;
