var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const fs = require('fs');
const session = require("express-session");




app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'));
app.use('/slike', express.static(__dirname + '/slike'));

app.use(session({
  secret: 'neka tajna sifra',
  resave: true,
  saveUninitialized: true
}));


//spirala4. inicijalizacija i upis početnih podataka
const sequelize = require('sequelize');
const db = require('./db.js');



app.get('/', function(req, res) {
  res.sendFile((__dirname + '/public/pocetna.html')); 

});


db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(async function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        
        // process.exit();
     });
   })
  


 function inicializacija(){

var osobljeListaPromisea=[];
var salaListaPromisea=[];
var rezervacijaListaPromisea=[];
var terminListaPromisea=[];

  
return  new Promise(function(resolve,reject){
 
  

  osobljeListaPromisea.push(db.osoblje.create({ime:'Neko',prezime:"Nekić", uloga:'profesor'}));
  osobljeListaPromisea.push(db.osoblje.create({ime:'Drugi',prezime:"Neko", uloga:'asistent'}));
  osobljeListaPromisea.push(db.osoblje.create({ime:'Test',prezime:"Test", uloga:'asistent'}));

  terminListaPromisea.push(db.termin.create({redovni:false,dan:null, datum:'01.01.2020',semestar:null, pocetak:'12:00',kraj:'13:00'}));
  terminListaPromisea.push(db.termin.create({redovni:true,dan:0, datum:null,semestar:'zimski', pocetak:'13:00',kraj:'14:00'}));

  Promise.all(osobljeListaPromisea).then(function(osoblje)
  {
    
    var nekoNekic=osoblje.filter(function(k){return k.ime==='Neko' && k.prezime==='Nekić'})[0];
    var drugiNeko=osoblje.filter(function(k){return k.ime==='Drugi' && k.prezime==='Neko'})[0];
    var testTest=osoblje.filter(function(k){return k.ime==='Test' && k.prezime==='Test'})[0];

   

    
       salaListaPromisea.push(
          db.sala.create({naziv:'1-11'}).then(function(b){
          return b.setZaduzen(nekoNekic).then(function(){
          return new Promise(function(resolve,reject){resolve(b);});
          });
          })
       );

       salaListaPromisea.push(
          db.sala.create({naziv:'1-15'}).then(function(b){
          return b.setZaduzen(drugiNeko).then(function(){
          return new Promise(function(resolve,reject){resolve(b);});
        });
       })
      );

Promise.all(terminListaPromisea).then(function(termini) {
  var termin1=termini.filter(function(k){return k.redovni==false && k.dan==null && k.datum=='01.01.2020' && k.semestar==null && k.pocetak=='12:00' && k.kraj=="13:00"})[0];
  var termin2=termini.filter(function(k){return k.redovni==true && k.dan==0 && k.datum==null && k.semestar=='zimski' && k.pocetak=='13:00' && k.kraj=="14:00"})[0];

  Promise.all(salaListaPromisea).then(function(sale) {
    var sala1=sale.filter(function(k){return k.naziv=='1-11'})[0];

  //  rezervacijaListaPromisea.push(db.rezervacija.create({termin:termin1.id,osoba:nekoNekic.id, sala:sala1.id}));
 //  rezervacijaListaPromisea.push(db.rezervacija.create({termin:termin2.id,osoba:testTest.id, sala:sala1.id}));


rezervacijaListaPromisea.push(
  db.rezervacija.create().then(function(r){
      return r.setTerminRezervacije(termin1).then(function(r){
          return r.setOsobaRezervacije(nekoNekic).then(function(r){
            return r.setSalaRezervacije(sala1)
          })
      }).then(function(){
      return new Promise(function(resolve,reject){resolve(r);});
      });
  })
);

rezervacijaListaPromisea.push(
  db.rezervacija.create().then(function(r){
      return r.setTerminRezervacije(termin2).then(function(r){
          return r.setOsobaRezervacije(testTest).then(function(r){
            return r.setSalaRezervacije(sala1)
          })
      }).then(function(){
      return new Promise(function(resolve,reject){resolve(r);});
      });
  })
);



 Promise.all(rezervacijaListaPromisea).then(function(b){resolve(b);})
            
          .catch(function(err){console.log("Biblioteke greška "+err);});

      }).catch(function(err){console.log("Sala greška "+err);});
 
    }).catch(function(err){console.log("Termini greška "+err);});

  }).catch(function(err){console.log("Osoblje greška "+err);});



});
}



app.get('/podaci', (req, res) => {   
 
    
  db.rezervacija.findAll(
   { attributes:['termin', 'sala','osoba']}
  ).then(function(rezervacije)
  {

    periodicna=[];
    vanredna=[];

    var zauzeca={periodicna,vanredna};

    rezervacije.forEach(function(rezervacija,index) {
  
    rezervacija.getTerminRezervacije().then(function(termin){
      
      
       if(termin.redovni)
       {
         var zauzece={dan:"", semestar:"", pocetak:"", kraj:"", naziv:"", predavac:""}
         zauzece.dan=termin.dan;
         zauzece.semestar=termin.semestar;
         zauzece.pocetak=termin.pocetak;
         zauzece.kraj=termin.kraj;
   
       }
       else{
        var zauzece={datum:"", pocetak:"", kraj:"", naziv:"", predavac:""}
        zauzece.datum=termin.datum;
        zauzece.pocetak=termin.pocetak;
        zauzece.kraj=termin.kraj;
       }
       
       rezervacija.getSalaRezervacije().then(function(sala){
        zauzece.naziv=sala.naziv;
        rezervacija.getOsobaRezervacije().then(function(osoba){
          var titula="";
          if(osoba.uloga=="profesor")
            titula+="Prof. "
          else if(osoba.uloga="asistent")
            titula+="Asis. "  
          zauzece.predavac=titula+osoba.ime+" "+ osoba.prezime;
          
        
      
          if(termin.redovni)
            zauzeca.periodicna.push(zauzece);
          else
            zauzeca.vanredna.push(zauzece);      

        if(zauzeca.periodicna.length+zauzeca.vanredna.length==rezervacije.length)
        {
         
           res.writeHead(200, {'Content-Type' : 'application/json'}); 
          res.end(JSON.stringify(zauzeca));
        }
        
        })
        })
     })

  });
  });
 });


app.post('/zauzece', async function (req, res) {
    
  
  var zauzece=req.body;
   console.log(zauzece);

  var zauzeto=false; // varijabla regulise prvovjeru je li zauzeto, ako nije, upis u bazu
  
  db.rezervacija.findAll().then( function(rezervacije)
  {

    
   
    rezervacije.forEach(function(rezervacija,index) {
     
     rezervacija.getTerminRezervacije().then(function(termin){
    
       var presjekTermina=vratiPresjek(zauzece.pocetak, zauzece.kraj, termin.pocetak, termin.kraj);
       var istiTermin=false;
      

      if(presjekTermina)
      {
        if((typeof(zauzece.dan)=='number')) //presje redovnog zauzeca // 
         {
           
           if(termin.redovni==true &&  zauzece.dan==termin.dan && zauzece.semestar==termin.semestar) //presjek redovnog sa redovnim
           {
                istiTermin=true;
                console.log("isti dan i semestar");
           }
           else if(termin.redovni==false)  //presjek redovnog sa periodicnim
           {
            var dan=dajDan(termin.datum);
            var mjesec=dajMjesec(termin.datum);
            var semestar=Semestar(mjesec);
     
       if(zauzece.dan==dan && zauzece.semestar==semestar)
            {
              istiTermin=true;
            }
           }
       }
       else if(zauzece.datum) //presjek vanrednog zauzeća
          {
            if(termin.redovni) //presjek vanrednog sa redovnim
           { 
             var dan=dajDan(zauzece.datum);
             var mjesec=dajMjesec(zauzece.datum);
             var semestar=Semestar(mjesec);
             if(termin.dan==dan && termin.semestar==semestar)
             {
               istiTermin=true;
             }

           }
           else{
              if(zauzece.datum==termin.datum) //presjek vanrednog sa vanrednim
             {
               istiTermin=true;
             }
           }

          
          }
          rezervacija.getSalaRezervacije().then(function(sala){

            var istaSala=false;
            if(zauzece.naziv==sala.naziv)
                istaSala=true;
                
    
               if(istiTermin && istaSala)
                { 
                  
                   rezervacija.getOsobaRezervacije().then(function(o)
                   {
                     var osoba={ime:o.ime, prezime:o.prezime, uloga:o.uloga,zauzeto:true};
               
                
                    console.log("rezervisano");

                   
                 //  if(zauzeto==false)
                    
                      zauzeto=true;
                    
                     res.writeHead(200, {'Content-Type' : 'application/json'}); 
                     res.end(JSON.stringify(osoba));
                     
                     
                   
                     
                   })
               }
          })
      }
     
     })
    
  });


 })

 
 setTimeout( function(){  //timeout zbog dodjele varijable u slučaju da je sala zauzeta
  
  if(zauzeto==false)
  {
     upisiZauzece(zauzece);
    console.log("zauzece se upisuje");
  }


  }, 800);
 
 
  function upisiZauzece(zauzece)
  {
    
   
    var rijec=zauzece.predavac.split(" ");
    if(rijec[0]=='Prof.')
    { uloga='profesor'; ime=rijec[1]; prezime=rijec[2];}
  else if(rijec[0]=='Asis.')
    { uloga='asistent'; ime=rijec[1]; prezime=rijec[2];}
  else 
  { ime=rijec[0]; prezime=rijec[1];}    
  
  if(zauzece.dan)
  {db.termin.create({redovni:true,dan:zauzece.dan,datum:null, semestar:zauzece.semestar, pocetak:zauzece.pocetak, kraj: zauzece.kraj}).then(function(t){
   // console.log(t);
   db.osoblje.findOne({where:{ime:ime,prezime:prezime,uloga:uloga}}).then(function(o){
    db.sala.findOne({where:{naziv:zauzece.naziv}}).then(function(s){
  
     db.rezervacija.create().then(function(r){
       return r.setTerminRezervacije(t).then(function(r){
           return r.setOsobaRezervacije(o).then(function(r){
             return r.setSalaRezervacije(s)
           })
       }).then(function(){
        console.log("pozvanUpisanRedovno");
        res.writeHead(200, {'Content-Type' : 'application/json'}); 
        res.end(JSON.stringify(zauzece));
       });
   })
  });
  
  });
 })
  }
  else{
  db.termin.create({redovni:false,dan:null,datum:zauzece.datum, semestar:null, pocetak:zauzece.pocetak, kraj: zauzece.kraj}).then(function(t){
  
  db.osoblje.findOne({where:{ime:ime,prezime:prezime,uloga:uloga}}).then(function(o){
  db.sala.findOne({where:{naziv:zauzece.naziv}}).then(function(s){
  
   db.rezervacija.create().then(function(r){
     return r.setTerminRezervacije(t).then(function(r){
         return r.setOsobaRezervacije(o).then(function(r){
           return r.setSalaRezervacije(s)
         })
     }).then(function(){
      console.log("pozvanUpisanVanredno");
    
      res.writeHead(200, {'Content-Type' : 'application/json'}); 
      res.end(JSON.stringify(zauzece));
     });
  })
  });
 });
 })
  }
  }
   
});


app.get('/osoblje', function(req, res) {
 


db.osoblje.findAll({
  attributes: ['ime', 'prezime','uloga']
}).then(function(osoblje){
  
 
  res.writeHead(200, {'Content-Type' : 'application/json'}); 
  res.end(JSON.stringify(osoblje));
});
 
});



app.get('/sale', function(req, res) {
 
  
db.sala.findAll({
  attributes: ['naziv']
}).then(function(sale){
  
 // console.log(JSON.stringify(osoblje));

  res.writeHead(200, {'Content-Type' : 'application/json'}); 
  res.end(JSON.stringify(sale));
 
});
});

const { Op } = require("sequelize");

app.post('/zauzecaOsoblja', function(req, res) { //kancelarija je zaduzena sala
                                                   
 
  console.log("pozvano traženje zauzeća osoblja");
  var v=req.body;

 

  var mjesec=dajMjesec(v.datum);
  var semestar=Semestar(mjesec);
  var dan=dajDan(v.datum);

  
  

 

   db.termin.findAll({
    where:{
      [Op.or]:[
      { [Op.and]: [sequelize.where(sequelize.col('pocetak'), '<=', v.vrijeme), 
                 sequelize.where(sequelize.col('kraj'), '>=', v.vrijeme),
                 sequelize.where(sequelize.col('redovni'), '=', true), 
                 sequelize.where(sequelize.col('dan'), '=', dan),
                  sequelize.where(sequelize.col('semestar'), '=', semestar),
                  sequelize.where(sequelize.col('datum'), '=', null)]},
      
     { [Op.and]: [sequelize.where(sequelize.col('pocetak'), '<=', v.vrijeme), 
                  sequelize.where(sequelize.col('kraj'), '>=', v.vrijeme),
                  sequelize.where(sequelize.col('redovni'), '=', false), 
                  sequelize.where(sequelize.col('dan'), '=', null),
                   sequelize.where(sequelize.col('semestar'), '=', null),
                   sequelize.where(sequelize.col('datum'), '=', v.datum)]  } 
                  ]
     }
  }).then(function(termini)
  {

  //  console.log(termini);
   
    var nizOsoblja=[];

   
    var upisanoPocetno=false;

      db.sala.findAll().then( function(sale)
      {
        
      
         sale.forEach(function(sala,j)
         {  
           sala.getZaduzen().then(function(zaduzenaOsoba) //postavimo zaduzene sale
           {   //console.log(sala);
             var osoba={ime:zaduzenaOsoba.ime, prezime:zaduzenaOsoba.prezime, uloga:zaduzenaOsoba.uloga, sala:sala.naziv};
              nizOsoblja.push(osoba);

              db.osoblje.findAll().then(function(osobe)
              {
                  osobe.forEach(function(o,i)
                  {
                    var tmp=false;
                    nizOsoblja.forEach(function(os)
                    {
                      if(o.ime==os.ime && o.prezime==os.prezime && o.uloga==os.uloga)
                            tmp=true;
                    })
                    if(tmp==false)
                    {
                      nizOsoblja.push({ime:o.ime, prezime:o.prezime, uloga:o.uloga, sala:"Nema kancelariju"})
                    }
                    if(i==osobe.length-1 && j==sale.length-1)
                      {
                        upisanoPocetno=true; 
                        if(termini.length==0)
                        {
                          res.writeHead(200);
                         res.end(JSON.stringify(nizOsoblja));
                        // console.log(nizOsoblja);
                         }
                        else{
                          setTimeout( function(){  //timeout zbog dodjele varijable u slučaju da je sala zauzeta
  
                            if(upisanoPocetno==true)
                            {   if(termini.length!=0)
                              {
                                console.log("sale se upisuju");  
                                   upisiSale(nizOsoblja);
                                 
                              }
                            }
                          
                          
                            }, 500);
                        }
                      }  
                        
                      
                    }
                  )
              })
           })
                      
          });              
        })              
       
      
        function upisiSale(nizOsoblja)  
              
             {
                 termini.forEach( function(termin,it)
                          { 
                       db.rezervacija.findOne({where:{termin:termin.id}}).then(function(rezervacija)
                            {  

                            
                             rezervacija.getOsobaRezervacije().then( function(o)
                              { 
                               
                              Promise.all(nizOsoblja).then(function(osobe)
                                {
                                 
                                
                                 var osoba=osobe.filter(function(a){return a.ime==o.ime && a.prezime==o.prezime && a.uloga==o.uloga})[0];

                                   
                                     rezervacija.getSalaRezervacije().then( function(sala)
                                    { 
                                     
                                     
                                    
                                        for(a of nizOsoblja)
                                        {
                                   
                                          if(a.ime==osoba.ime && a.prezime==osoba.prezime && a.uloga==osoba.uloga)
                                             { a.sala=sala.naziv;
                                         
                                              
                                             }
                                            
                                             
                                        }
                                    
                                        if (it==termini.length-1)
                                             {
                                           
                                             setTimeout(function(){
                                              res.writeHead(200, {'Content-Type' : 'application/json'}); 
                                              res.end(JSON.stringify(nizOsoblja));
                                             },500);
                                             
                                             }    
                                           
                                      
                                    })
                                  
                               
                            
                              
                            

                              })
                            })
                            })
                          })
                         
                        }
       
       
        })
   
  
});



/*  -----ovo je post sa spirale3

app.post('/zauzeca.json', function (req, res) {
    
   var zauzece=req.body;
  
   
   let podaci = fs.readFileSync((__dirname, 'zauzeca.json'));
   let zauzeca = JSON.parse(podaci);

   provjera1=(provjeriSaluPeriodicna(zauzece,zauzeca.periodicna));
   provjera2=(provjeriSaluVanredna(zauzece,zauzeca.vanredna));
   
   if(provjera1==false && provjera2==false)
   {
     
     if(zauzece.dan)
          zauzeca.periodicna.push(zauzece);
     else 
        zauzeca.vanredna.push(zauzece); 
      
       fs.writeFile(path.join(__dirname, 'zauzeca.json'), JSON.stringify(zauzeca,null,'\t'), (err) => {
          if (err) throw err;
          console.log('Zauzece upisano!');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(zauzeca));
        })
          
   }
   else{
   var poruka="greska"
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify(poruka));
  }


});

*/
    
/* ne treba zbog linije 14 //spirala3
    app.get('/slike/:filename', (req, res) => {  
      
    var slika = req.params.filename;

    slike=[];
     
    fs.readdir(__dirname+'/slike', function (err, files) {
     
        if (err) throw err;
        files.forEach(function (file) {
            slike.push(file);
           });

           
           for(var i=0; i<slike.length; i++)
           {
             if(slika==slike[i]){
               var path=__dirname+'/slike/'+slika;
               res.sendFile(path);
             }
           }
       });
      });
   
 */     
 
      
    app.post('/slike', function(req, res){
      
     
      
       var slike=[];
       var poziv=req.body;
     

     
        fs.readdir(__dirname+'/slike', function (err, files) {

         
             if (err) throw err;
          files.forEach(function (file) {
              slike.push(file);
             });

            if(req.session.brojac!=null) {
              
               
            if(slike[req.session.brojac+3] && slike[req.session.brojac+2] && slike[req.session.brojac+1])
                 { req.session.brojac+=3; req.session.broj=3; }
            
            else if(slike[req.session.brojac+2] && slike[req.session.brojac+1])  
                 {req.session.brojac+=2; req.session.broj=2;} 
            
            else if(slike[req.session.brojac+1])
                 {req.session.brojac+=1; req.session.broj=1;}

            
             }
             else {
                 req.session.brojac=2;
                 req.session.broj=3;
                
                 
             }

             if(poziv.poziv=="onload") 
             {
              req.session.brojac=2;
              req.session.broj=3;
             
              } 
           
            
              var brojSlika=req.session.broj;
              var brojac=req.session.brojac;
              var s='/slike/'

            
              var obj;
           

             if(brojSlika==3)
             {
              obj={slika1:s+slike[brojac-2], slika2:s+slike[brojac-1], slika3:s+slike[brojac], brojSlika:slike.length-brojac-1};
             }
             else if(brojSlika==2)
             {
              obj={slika1:s+slike[brojac-1],slika2:s+slike[brojac],brojSlika:slike.length-brojac-1};
             }
             else{
              obj={slika1:s+slike[brojac],brojSlika:slike.length-brojac-1};
             }
      

         
         res.writeHead(200);
         res.write(JSON.stringify(obj));
         res.end();
              
       
    });

           
    })
 

  app.listen(8080, () => {
    console.log("Server pokrenut, osluškivanje na portu 8080!");
});

module.exports = app;
 
/*       -----provjera zauzece.json--- spriala3-------

function provjeriSaluPeriodicna(zauzece,zauzeca)
{
  if(zauzece.dan)
  {
  for(var i=0; i<zauzeca.length; i++)
  {
    var z=zauzeca[i];
    if(zauzece.dan==z.dan && zauzece.semestar==z.semestar &&zauzece.naziv==z.naziv)
    {
       var bool =vratiPresjek(zauzece.pocetak, zauzece.kraj, z.pocetak, z.kraj);
      
       return bool;

    }
 
  }
  return false;
 }
 else if(zauzece.datum)
 {
    var dan=dajDan(zauzece.datum);
    var mjesec=dajMjesec(zauzece.datum);
    var semestar=Semestar(mjesec);

    for(var i=0; i<zauzeca.length; i++)
    {
      var z=zauzeca[i];
      

      if(dan==z.dan && semestar==z.semestar &&zauzece.naziv==z.naziv)
      {
         var bool =vratiPresjek(zauzece.pocetak, zauzece.kraj, z.pocetak, z.kraj);
        
         return bool;
  
      }
   
    }
    return false;
    
 }
}

function provjeriSaluVanredna(zauzece,zauzeca)
{
  if(zauzece.dan)
  { 

  for(var i=0; i<zauzeca.length; i++)
  {
    var z=zauzeca[i];
    var dan=dajDan(z.datum);
    var mjesec=dajMjesec(z.datum);
    var semestar=Semestar(mjesec);
    if(zauzece.dan==dan && zauzece.semestar==semestar &&zauzece.naziv==z.naziv)
    {
       var bool =vratiPresjek(zauzece.pocetak, zauzece.kraj, z.pocetak, z.kraj);
      
       return bool;

    }
 
  }
  return false;
 }
 else if(zauzece.datum)
 {
    
    for(var i=0; i<zauzeca.length; i++)
    {
      var z=zauzeca[i];
      

      if(zauzece.datum==z.datum  &&zauzece.naziv==z.naziv)
      {
         var bool =vratiPresjek(zauzece.pocetak, zauzece.kraj, z.pocetak, z.kraj);
        
         return bool;
  
      }
   
    }
    return false;
    
 }
}
*/

///pomocne funkcije

function vratiPresjek(pocetak,kraj,zauzecePocetak,zauzeceKraj)
  {
      
     
      var pocetakUnutarIntervala= new Boolean(pocetak >= zauzecePocetak && pocetak <= zauzeceKraj);
      var krajUnutarIntervala= new Boolean(kraj >= zauzecePocetak && kraj <= zauzeceKraj);
      var intervalPrekoIntervala= new Boolean(pocetak <= zauzecePocetak && kraj>=zauzeceKraj);
      var intervalUnutarIntervala=new Boolean(pocetak >= zauzecePocetak && kraj <= zauzeceKraj );
     
     // var presjek= (pocetakUnutarIntervala || krajUnutarIntervala || intervalPrekoIntervala || intervalUnutarIntervala);
        
        if(pocetakUnutarIntervala == true || krajUnutarIntervala==true || intervalPrekoIntervala == true || intervalUnutarIntervala == true) 
         {
             return true;
            }
         else{
          return false;
        }
   }

 function dajDan(datum)
 {
  var x=String(datum);
  var dan=x[0]+x[1];
  var mjesec=x[3]+x[4];
  d=parseInt(dan,10);
  m=parseInt(mjesec,10);

 m--;
  var datum = new Date();
 
  datum.setFullYear(2020, m, d); //izmjenjeno 2019


var dan=datum.getDay();
dan--;
if(dan==-1)
  dan=6;

 return dan; 
 }

 function dajMjesec(datum)
 {
  var x=String(datum);
  var dan=x[0]+x[1];
  var mjesec=x[3]+x[4];
  d=parseInt(dan,10);
  m=parseInt(mjesec,10);

 m--;
  var datum = new Date();
 
  datum.setFullYear(2020, m, d); //izmjenjeno 2019


var dan=datum.getDay();
dan--;
if(dan==-1)
  dan=6;

 return m; 
 }

 function Semestar( mjesec) { //provjerava kojem semestru pripada mjesec
  var s;
  if(mjesec>8 || mjesec==0)  { 
      s="zimski";
  }
  else if(mjesec>0 && mjesec<6){
      s="ljetni";
  }
  else
      s="raspust"   
  return s;        
}