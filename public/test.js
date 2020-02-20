let assert = chai.assert;

 describe('iscrtajKalendar()', function() {
   it('Pozivanje iscrtajKalendar za mjesec sa 30 dana', function() {
   
   
    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,3);
    let sviDani = div.getElementsByTagName("li");

    var dani=[];
   for(var i=0; i<sviDani.length; i++)
     {
         if(sviDani[i].style.visibility !="hidden")
         {
           dani.push(sviDani[i])
         }
     }
     assert.equal(dani.length, 30,"Broj dana treba biti 30");
   });



   it('Pozivanje iscrtajKalendar za mjesec sa 31 dana', function() {

    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,11);
    let sviDani = div.getElementsByTagName("li");

    var dani=[];
   for(var i=0; i<sviDani.length; i++)
     {
         if(sviDani[i].style.visibility !="hidden")
         {
           dani.push(sviDani[i])
         }
     }
     
     assert.equal(dani.length, 31,"Broj dana treba biti 31");
   
     });



     it('Pozivanje iscrtajKalendar za trenutni mjesec', function() {

      var sedmica=["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

      var div=document.getElementById("days");
      Kalendar.iscrtajKalendar(div,10);
      let sviDani = div.getElementsByTagName("li");
  
      var dan;
     for(var i=0; i<sviDani.length; i++)
       {
        var tmp=div.children[i].childNodes[0].nodeValue;
        
           if(tmp!=0) //0 se dodijeli praznim, hidden divovima koji se ne prikazuju na kalendaru tj. pocetku i kraju kalendara
           {
             dan=i;
             break; 
           }
          
       }
       var stringDana=sedmica[dan];

       assert.equal(stringDana, "Pet","Očekivano je da bude petak");
      });



      it('Pozivanje iscrtajKalendar za trenutni mjesec', function() {

        var sedmica=["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
  
        var div=document.getElementById("days");
        Kalendar.iscrtajKalendar(div,10);
        
    
        var dan;
       for(var i=41; i>0; i--)
         {
          var tmp=div.children[i].childNodes[0].nodeValue;
          
             if(tmp!=0) //0 se dodijeli praznim, hidden divovima koji se ne prikazuju na kalendaru tj. pocetku i kraju kalendara
             {
               dan=i;
               break; 
             }
            
         }
         while(dan>6)
         {
           dan-=7;
         }


         var stringDana=sedmica[dan];
  
         assert.equal(stringDana, "Sub","Očekivano je da bude subota");
        });


        it('Pozivanje iscrtajKalendar za januar', function() {

          var sedmica=["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
    
          var div=document.getElementById("days");
          Kalendar.iscrtajKalendar(div,0);
          let sviDani = div.getElementsByTagName("li");
      
          var dan;
          var dan;
          for(var i=0; i<sviDani.length; i++)
            {
             var tmp=div.children[i].childNodes[0].nodeValue;
             
                if(tmp!=0) //0 se dodijeli praznim, hidden divovima koji se ne prikazuju na kalendaru tj. pocetku i kraju kalendara
                {
                  dan=i;
                  break; 
                }
               
            }
            var stringDana=sedmica[dan];
  
           assert.equal(stringDana, "Uto","Očekivano je da prvi da bude utorak");
           var j=0;
           for(var i=dan; i<42; i++)
           {
            tmp=div.children[i].childNodes[0].nodeValue;
            if(tmp==0) break;
            j++;
            console.log(tmp);
            assert.equal(tmp,j,"Dani u mjesecu januaru");
           }
          });

 });





 describe('obojiZauzeca()', function() {
   it('Pozivanje obojiZauzeca kada nisu učitanji podaci', function() {
    var periodicnoZauzece1 = {dan:"0", semestar:"ljetni", pocetak:"09:00",kraj:"12:00",naziv:"VA1",predavac:"Javier Mascherano"};
    var periodicnoZauzece2 = {dan:"6", semestar:"zimski", pocetak:"12:02",kraj:"15:00", naziv:"VA1",predavac:"Javier Saviola"};
    var periodicnoZauzece3 = {dan:"2", semestar:"zimski", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};

    var vandrednoZauzece1={datum:"06:06:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};
    var vandrednoZauzece2={datum:"05:05:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Torres"};

    var periodicnaTmp=[periodicnoZauzece1, periodicnoZauzece2,periodicnoZauzece3];
    var vanrednaTmp=[vandrednoZauzece1,vandrednoZauzece2];
    
   // Kalendar.ucitajPodatke(periodicnaTmp,vanrednaTmp);

    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,10);

    Kalendar.obojiZauzeca(div, 10, "VA1", "08:00", "14:00");

    for(var i=0; i<37; i++)
    {
    var tmp=div.children[i].childNodes[0].nodeValue; 
    if(tmp!=0) 
       { 
        assert.equal(div.children[i].childNodes[1].className,"slobodna", "Trebaju sva polja biti zelena");
       }
    }
   });

   it('Pozivanje obojiZauzeca za duple vrijednosti istog termina', function() {
    var periodicnoZauzece1 = {dan:"1", semestar:"ljetni", pocetak:"09:00",kraj:"11:00",naziv:"VA1",predavac:"Javier Mascherano"};
    var periodicnoZauzece2 = {dan:"1", semestar:"ljetni", pocetak:"09:00",kraj:"11:00", naziv:"VA1",predavac:"Javier Saviola"};
    var periodicnoZauzece3 = {dan:"2", semestar:"zimski", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};

    var vandrednoZauzece1={datum:"06:06:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};
    var vandrednoZauzece2={datum:"06:06:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};

     var periodicnaTmp=[periodicnoZauzece1, periodicnoZauzece2,periodicnoZauzece3];
     var vanrednaTmp=[vandrednoZauzece1,vandrednoZauzece2];

     Kalendar.ucitajPodatke(periodicnaTmp,vanrednaTmp);
    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,5);

    Kalendar.obojiZauzeca(div, 5, "VA1", "08:00", "14:00");

    for(var i=0; i<37; i++)
    {
    var tmp=div.children[i].childNodes[0].nodeValue; 
    if(tmp==6) 
       { 
        assert.equal(div.children[i].childNodes[1].className,"zauzeta", "Treba obojiti 06:06:2019")
        
       }
    }
   });

   it('Pozivanje obojiZauzece kada u podacima postoji periodično zauzeće za drugi semestar', function() {
    var periodicnoZauzece1 = {dan:"1", semestar:"ljetni", pocetak:"09:00",kraj:"11:00",naziv:"VA1",predavac:"Javier Mascherano"};
    
    var periodicnoZauzece2 = {dan:"2", semestar:"zimski", pocetak:"10:00",kraj:"15:00",naziv:"VA1",predavac:"Javier Mascherano"};
   
    var vandrednoZauzece1={datum:"06:06:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};

     var periodicnaTmp=[periodicnoZauzece1, periodicnoZauzece2];
     var vanrednaTmp=[vandrednoZauzece1];

     Kalendar.ucitajPodatke(periodicnaTmp,vanrednaTmp);
    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,11);

    Kalendar.obojiZauzeca(div, 11, "VA1", "08:00", "14:00");

    for(var i=1; i<37; i+=7)
    {
    var tmp=div.children[i].childNodes[0].nodeValue; 
    if(tmp!=0) 
       { 
        assert.equal(div.children[i].childNodes[1].className,"slobodna", "Ne treba biti obojeno utorkom, treba srijedom");
        
       }
    }
   });
   it('Pozivanje obojiZauzece kada u podacima postoji zauzeće termina ali u drugom mjesecu', function() {
    var periodicnoZauzece1 = {dan:"1", semestar:"ljetni", pocetak:"09:00",kraj:"11:00",naziv:"VA1",predavac:"Javier Mascherano"};
    var periodicnoZauzece2 = {dan:"1", semestar:"ljetni", pocetak:"09:00",kraj:"11:00", naziv:"VA1",predavac:"Javier Saviola"};
    var periodicnoZauzece3 = {dan:"2", semestar:"ljetni", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};

    var vandrednoZauzece1={datum:"06:06:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};
    var vandrednoZauzece2={datum:"06:05:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};

     var periodicnaTmp=[periodicnoZauzece1, periodicnoZauzece2,periodicnoZauzece3];
     var vanrednaTmp=[vandrednoZauzece1,vandrednoZauzece2];

     Kalendar.ucitajPodatke(periodicnaTmp,vanrednaTmp);
    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,9);

    Kalendar.obojiZauzeca(div, 9, "VA1", "08:00", "14:00");
    Kalendar.obojiZauzeca(div, 10, "VA1", "08:00", "14:00");
    Kalendar.obojiZauzeca(div, 11, "VA1", "08:00", "14:00");
    Kalendar.obojiZauzeca(div, 6, "VA1", "08:00", "14:00");
    
    for(var i=0; i<37; i++)
    {
    var tmp=div.children[i].childNodes[0].nodeValue; 
    if(tmp!=0) 
       { 
        assert.equal(div.children[i].childNodes[1].className,"slobodna", "Trebaju sva polja biti zelena, ne treba bojiti u ovom mjesecu");
       }
    }
   });
   it('Pozivanje obojiZauzece kada su svi termini zauzeti', function() {
    var periodicnoZauzece1 = {dan:"0", semestar:"ljetni", pocetak:"09:00",kraj:"11:00",naziv:"VA2",predavac:"Javier Mascherano"};
    var periodicnoZauzece2 = {dan:"1", semestar:"ljetni", pocetak:"09:00",kraj:"11:00", naziv:"VA2",predavac:"Javier Saviola"};
    var periodicnoZauzece3 = {dan:"2", semestar:"ljetni", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};
    var periodicnoZauzece4 = {dan:"3", semestar:"ljetni", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};
    var periodicnoZauzece5 = {dan:"4", semestar:"ljetni", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};
    var periodicnoZauzece6 = {dan:"5", semestar:"ljetni", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};
    var periodicnoZauzece7 = {dan:"6", semestar:"ljetni", pocetak:"09:00",kraj:"12:00", naziv:"VA2",predavac:"Javier Solana"};

    var vandrednoZauzece1={datum:"06:06:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};
    var vandrednoZauzece2={datum:"06:05:2019",pocetak:"09:00", kraj:"11:00",naziv:"VA1",predavac:"Fernando Redondo"};

     var periodicnaTmp=[periodicnoZauzece1, periodicnoZauzece2,periodicnoZauzece3,periodicnoZauzece4,periodicnoZauzece5,periodicnoZauzece6,periodicnoZauzece7];
     var vanrednaTmp=[vandrednoZauzece1,vandrednoZauzece2];

     Kalendar.ucitajPodatke(periodicnaTmp,vanrednaTmp);
    var div=document.getElementById("days");
    Kalendar.iscrtajKalendar(div,2);

    Kalendar.obojiZauzeca(div, 2, "VA2", "08:00", "14:00");
  
    
    for(var i=0; i<37; i++)
    {
    var tmp=div.children[i].childNodes[0].nodeValue; //poredimo da ne bojimo nepostojeće divove
    if(tmp!=0) 
       { 
        assert.equal(div.children[i].childNodes[1].className,"zauzeta", "Trebaju sva polja biti zauzeta");
       }
    }
   });

 });

