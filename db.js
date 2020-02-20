

const Sequelize = require('sequelize');
const sequelize = new Sequelize('DBWT19', 'root', 'root', {
    host : 'localhost', 
    dialect : 'mysql',
    logging : false
   // operatorsAliases: false
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.termin= sequelize.import(__dirname + '/tabele/termin.js');
db.osoblje = sequelize.import(__dirname + '/tabele/osoblje.js');
db.rezervacija = sequelize.import(__dirname + '/tabele/rezervacija.js');
db.sala = sequelize.import(__dirname + '/tabele/sala.js');

// - Osoblje - jedan na više - Rezervacija
db.osoblje.hasMany(db.rezervacija,{
  foreignKey: 'osoba'
  });
  db.rezervacija.belongsTo(db.osoblje,{ as:'osobaRezervacije',
    foreignKey: 'osoba'
  })
  
//Rezervacija - jedan na jedan - Termin
db.rezervacija.belongsTo(db.termin,{
  foreignKey:'termin', as:'terminRezervacije'
});


//Rezervacija - više na jedan - Sala
  db.sala.hasMany(db.rezervacija,{
    foreignKey: 'sala'
    });
    db.rezervacija.belongsTo(db.sala,{ as:'salaRezervacije',
      foreignKey: 'sala'
    })

//Sala - jedan na jedan - Osoblje
db.osoblje.hasOne(db.sala,{ as:'zaduzen',
  foreignKey: 'zaduzenaOsoba'
  });
db.sala.belongsTo(db.osoblje, {as:'zaduzen',
    foreignKey: 'zaduzenaOsoba'
  });

module.exports = db;