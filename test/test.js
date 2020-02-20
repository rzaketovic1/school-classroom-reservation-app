const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require('../db.js');
const mocha=require('mocha');


let should = chai.should();

 
const { expect } = chai;
chai.use(chaiHttp);

setTimeout(function() {
  run()
}, 30000);




describe("Server!",  function () {

  
  it("GET/osoblje", function(done) {

    
    chai
      .request(app)
      .get("/osoblje")
      .end((err, res) => {

      
      

        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        var osoblje=res.body;
        for( osoba of osoblje)
        {
            osoba.should.have.property('ime');
            osoba.should.have.property('prezime');
            osoba.should.have.property('uloga');
        }
     done();
      })
      
  })

  it("GET/sale", (done) => {
    chai
      .request(app)
      .get("/sale")
      .end((err, res) => {

        
      
         res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(2);
        var sale=res.body;
        for( sala of sale)
        {
            sala.should.have.property('naziv');

        }
       done();
      });
  })

  it("GET/podaci(postojeće rezervacije iz početne inicijalizacije baze)", done => {
    chai
      .request(app)
      .get("/podaci")
      .end((err, res) => {
        
          res.status.should.be.equal(200);
          res.body.should.be.a("object");
      
          var zauzeca=res.body;

         zauzeca.should.have.property('periodicna').a('array').lengthOf(1);
         zauzeca.should.have.property('vanredna').a('array').lengthOf(1);

         zauzeca.periodicna[0].should.have.property('dan', 0);
         zauzeca.periodicna[0].should.have.property('semestar','zimski');
         zauzeca.periodicna[0].should.have.property('pocetak','13:00:00');
         zauzeca.periodicna[0].should.have.property('kraj','14:00:00');
         zauzeca.periodicna[0].should.have.property('naziv','1-11');
         zauzeca.periodicna[0].should.have.property('predavac','Asis. Test Test');

         zauzeca.vanredna[0].should.have.property('datum', '01.01.2020');
         zauzeca.vanredna[0].should.have.property('pocetak','12:00:00');
         zauzeca.vanredna[0].should.have.property('kraj','13:00:00');
         zauzeca.vanredna[0].should.have.property('naziv','1-11');
         zauzeca.vanredna[0].should.have.property('predavac','Prof. Neko Nekić');

         

     
       done();
      });
    });
      it("POST/zauzece upis novog periodicnog zauzeća u bazu", done => {

        let zauzece= {
          dan: 6,
          semestar: "ljetni",
          pocetak:'09:00:00',
          kraj:'10:00:00',
          naziv:'1-15',
          predavac:'Asis. Drugi Neko'
      }

        chai
          .request(app)
          .post("/zauzece")
          .send(zauzece)
          .end((err, res) => {

            
              res.status.should.be.equal(200);
           

              

              db.rezervacija.findOne({where:{id:3}}).then(function(rezervacija)
              {
                  rezervacija.getTerminRezervacije().then(function(termin)
                  {
                    expect(termin.redovni).to.equal(true);
                    expect(termin.dan).to.equal(zauzece.dan);
                    expect(termin.semestar).to.equal(zauzece.semestar);
                    expect(termin.pocetak).to.equal(zauzece.pocetak);
                    expect(termin.kraj).to.equal(zauzece.kraj);
                    expect(termin.datum).to.equal(null);

                    rezervacija.getSalaRezervacije().then(function(sala)
                    {
                      expect(sala.naziv).to.equal(zauzece.naziv);

                      rezervacija.getOsobaRezervacije().then(function(osoba)
                      {
                        
                        expect(osoba.ime).to.equal("Drugi");
                        expect(osoba.prezime).to.equal("Neko");
                        expect(osoba.uloga).to.equal("asistent");
                        done();
                      }).catch(done);
                    })

                  })             
              })
        });
  });

  it("POST/zauzece upis novog vanrednog zauzeća u bazu", done => {

    let zauzece= {
      datum: "31.01.2020",
      pocetak:'10:00:00',
      kraj:'11:00:00',
      naziv:'1-15',
      predavac:'Prof. Neko Nekić'
  }

    chai
      .request(app)
      .post("/zauzece")
      .send(zauzece)
      .end((err, res) => {

       
          res.status.should.be.equal(200);
        

           
          db.rezervacija.findOne({where:{id:4}}).then(function(rezervacija)
          {
              rezervacija.getTerminRezervacije().then(function(termin)
              {
                expect(termin.redovni).to.equal(false);
                expect(termin.dan).to.equal(null);
                expect(termin.semestar).to.equal(null);
                expect(termin.pocetak).to.equal(zauzece.pocetak);
                expect(termin.kraj).to.equal(zauzece.kraj);
                expect(termin.datum).to.equal(zauzece.datum);
                

                rezervacija.getSalaRezervacije().then(function(sala)
                {
                  expect(sala.naziv).to.equal(zauzece.naziv);

                  rezervacija.getOsobaRezervacije().then(function(osoba)
                  {
                    
                    expect(osoba.ime).to.equal("Neko");
                    expect(osoba.prezime).to.equal("Nekić");
                    expect(osoba.uloga).to.equal("profesor");
                    done();
                  }).catch(done);
                })

              })             
          })
    });
});


it("POST/zauzece preklapanje termina različitih osoba (nemoguc upis vanrednog preko periodicnog)", done => {

  let zauzece= {
  datum: "20.01.2020",
      pocetak:'13:30:00',
      kraj:'14:30:00',
      naziv:'1-11',
      predavac:'Prof. Neko Nekić'
}

  chai
    .request(app)
    .post("/zauzece")
    .send(zauzece)
    .end((err, res) => {

      //console.log(res.body);
        res.status.should.be.equal(200);
        res.body.should.have.property('zauzeto',true);
        res.body.should.have.property('ime', 'Test');
        res.body.should.have.property('prezime', 'Test');
        res.body.should.have.property('uloga', 'asistent');

       db.rezervacija.findAll().then(function(rezervacija)
        {
          expect(rezervacija.length).to.equal(4); 
          done();//dodane su dvije rezervacije u prethodna dva testiranja
        }).catch(done);

        
  });
});

it("POST/zauzece preklapanje termina iste osoba (nemoguc upis periodicnog preko vanrednog)", done => {

  let zauzece= {
    dan: 2,
    semestar: "zimski",
    pocetak:'11:00:00',
    kraj:'13:00:00',
    naziv:'1-11',
    predavac:'Prof. Neko Nekić'
}

  chai
    .request(app)
    .post("/zauzece")
    .send(zauzece)
    .end((err, res) => {

      
        res.status.should.be.equal(200);
        res.body.should.have.property('zauzeto',true);
        res.body.should.have.property('ime', 'Neko');
        res.body.should.have.property('prezime', 'Nekić');
        res.body.should.have.property('uloga', 'profesor');

       db.rezervacija.findAll().then(function(rezervacija)
        {
          expect(rezervacija.length).to.equal(4); 
          done();
        }).catch(done);

        
  });
});


it("POST/zauzece preklapanje termina razlicith osoba (nemoguc upis periodicnog preko vanrednog), test dodanog zauzeca", done => {

  let zauzece= {
    dan: 4,     //preklapanje sa 31.1.2020
    semestar: "zimski",
    pocetak:'10:00:00',
    kraj:'12:00:00',
    naziv:'1-15',
    predavac:'Asis. Test Test'
}

  chai
    .request(app)
    .post("/zauzece")
    .send(zauzece)
    .end((err, res) => {

      
        res.status.should.be.equal(200);
        res.body.should.have.property('zauzeto',true);
        res.body.should.have.property('ime', 'Neko');
        res.body.should.have.property('prezime', 'Nekić');
        res.body.should.have.property('uloga', 'profesor');

       db.rezervacija.findAll().then(function(rezervacija)
        {
          expect(rezervacija.length).to.equal(4); 
          done();
        }).catch(done);

        
  });
});

it("POST/zauzece preklapanje termina različitih osoba (nemoguc upis periodicnog preko periodicnog), test dodane rezezrvacije", done => {

  let zauzece= {
    dan: 6,
    semestar: "ljetni",
    pocetak:'09:30:00',
    kraj:'10:30:00',
    naziv:'1-15',
    predavac:'Asis. Test Test'
}

  chai
    .request(app)
    .post("/zauzece")
    .send(zauzece)
    .end((err, res) => {

      
        res.status.should.be.equal(200);
        res.body.should.have.property('zauzeto',true);
        res.body.should.have.property('ime', 'Drugi');
        res.body.should.have.property('prezime', 'Neko');
        res.body.should.have.property('uloga', 'asistent');

       db.rezervacija.findAll().then(function(rezervacija)
        {
          expect(rezervacija.length).to.equal(4); 
          done();
        }).catch(done);

        
  });
});

it("POST/zauzece preklapanje termina različitih osoba (nemoguc upis vanrednog preko vanrednog), test dodane rezezrvacije", done => {

  let zauzece= {
    datum: "31.01.2020",
    pocetak:'09:15:00',
    kraj:'10:15:00',
    naziv:'1-15',
    predavac:'Asis. Test Test'
}

  chai
    .request(app)
    .post("/zauzece")
    .send(zauzece)
    .end((err, res) => {

      
        res.status.should.be.equal(200);
        res.body.should.have.property('zauzeto',true);
        res.body.should.have.property('ime', 'Neko');
        res.body.should.have.property('prezime', 'Nekić');
        res.body.should.have.property('uloga', 'profesor');

       db.rezervacija.findAll().then(function(rezervacija)
        {
          expect(rezervacija.length).to.equal(4); 
          done();
        }).catch(done);

        
  });
});





})

