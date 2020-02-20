//Rezervacija{id,termin:integer FK UNIQUE,sala:integer FK,osoba:integer FK}

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const Rezervacija = sequelize.define('Rezervacija', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        termin:{
            unique: true,
            type:Sequelize.INTEGER
        }

    });
    return Rezervacija;
}