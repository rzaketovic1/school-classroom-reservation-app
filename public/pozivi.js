let Pozivi = (function(){

  var prvaSlika;
  var drugaSlika;
  var trecaSlika;

  var slikeDOM=document.getElementById('slike');

 var ucitanaZadnjaSlika=false; 
  
var obj=[];

var porukaORezervaciji=false;

var slike=[];

var periodicnaZauzeca=[];

var vanrednaZauzeca=[];


function ajaxPodaci(callback){
   
      var ajax = new XMLHttpRequest();
        ajax.overrideMimeType("application/json");
        ajax.open('GET', '/podaci', true);
        ajax.onreadystatechange = function () {
          if (ajax.readyState == 4 && ajax.status == "200") {
           
            callback(ajax.responseText);
            }
        };
        
        ajax.send(); 

}

function ucitajPodatkeImpl() {

  ajaxPodaci(function(response) {
     obj = JSON.parse(response);
     console.log("pozvano ucitavanje podataka");
     console.log(obj);
     periodicnaZauzeca=obj.periodicna;
     vanrednaZauzeca=obj.vanredna;

     Kalendar.ucitajPodatke(obj.periodicna,obj.vanredna);
     oboji();
     
    // if(porukaORezervaciji)
     //     {
     //       oboji();
          
     //         alert("Rezervisano!")
         
           // alert("Rezervisano!");
          
     //   }
        
  });
 }



/*
function loadJSONZauzece(zauzece,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'zauzeca.json', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                   object = JSON.parse(xhr.responseText);
                callback(object);
            } else {

            }
        }
    };

   
    xhr.send(JSON.stringify(zauzece));
}

function upisiZauzeceJSONImpl(zauzece){
         loadJSONZauzece(zauzece,function(response){
             if(response.periodicna || response.vanredna)
              {
                porukaORezervaciji=true;
                ucitajPodatkeImpl();
                //alert("Rezervisano!");
             }
              else if(response="greska")
              {
                var podaci=podaciKlika();
                var poruka= "Nije moguće rezervisati salu "+podaci.naziv +" za navedeni datum "+podaci.datum+" i termin od "
                +podaci.pocetak +" do "+ podaci.kraj +"!";
                alert (poruka);               
              }

    
         }) 
    };
*/
    function ajaxZauzece(zauzece,callback) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/zauzece', true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                     object = JSON.parse(xhr.responseText);
                  callback(object);
              } else {
  
              }
          }
      };
  
     
      xhr.send(JSON.stringify(zauzece));
  }

    function upisiZauzeceImpl(zauzece){
      ajaxZauzece(zauzece,function(response){
  
           if(response.zauzeto)
           {
            var podaci=podaciKlika();
            var zauzeo=response.uloga+" "+response.ime+" "+response.prezime;
            var poruka= "Nije moguće rezervisati salu "+podaci.naziv +" za navedeni datum "+podaci.datum+" i termin od "
            +podaci.pocetak +" do "+ podaci.kraj +"! Rervisao/la "+ zauzeo +".";
            alert (poruka); 

           }
           else{
         //  console.log(response);
          //  porukaORezervaciji=true;
          
              if(response.datum)
                  {  vanrednaZauzeca.push(response);}
              else 
                   { 
                      periodicnaZauzeca.push(response);
                   }    
           
            Kalendar.ucitajPodatke(periodicnaZauzeca,vanrednaZauzeca);
            alert("Rezervisano!");
            oboji();

           
           }

 
      }) 
 };



  
    function ucitajSlikeAjax(p,callback) {
      var poziv={poziv:p};
      var xhr = new XMLHttpRequest();
     
      xhr.open("POST", '/slike', true);
      xhr.overrideMimeType("application/json");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  
                  object = JSON.parse(xhr.responseText);
                  callback(object);
              } else {
  
              }
          }
      };
      xhr.send(JSON.stringify(poziv));
     
  }
  
  function ucitajSlikeImpl(poziv){
          


           ucitajSlikeAjax(poziv,function(response){
       
            

             if(poziv=="onload")
             {
        
            for(var i=0; i<3; i++)
              {  var img = document.createElement('img'); 
                  slikeDOM.appendChild(img);
                if(i==0)
                  img.id="prvaSlika";
                else if(i==1)
                  img.id="drugaSlika";
                else
                  img.id="trecaSlika";

              }

               prvaSlika=$('#prvaSlika');
               drugaSlika=$('#drugaSlika');
               trecaSlika=$('#trecaSlika');
             }
          

             if(response.brojSlika==0)
             {
               ucitanaZadnjaSlika=true; 
             }
             
            
           if(response.slika1 && response.slika2 &&  response.slika3)
           { 
             prvaSlika.attr('src', response.slika1); slike.push(response.slika1);
            drugaSlika.attr('src', response.slika2); slike.push(response.slika2);
            trecaSlika.attr('src', response.slika3); slike.push(response.slika3);
            if(response.brojSlika==0)
            {
                $('#sljedeci').prop('disabled', true);
           
                JedanIliDva=0;
           
                $("#sljedeci").css("background-color", "red");

            
            }


           }
           else if(response.slika1 && response.slika2)
           {
             prvaSlika.attr('src', response.slika1); slike.push(response.slika1);
             drugaSlika.attr('src',response.slika2); slike.push(response.slika2);
             trecaSlika.remove();
            
            
             $('#sljedeci').prop('disabled', true);

             $("#sljedeci").css("background-color", "red");
           }
           else{
            prvaSlika.attr('src', response.slika1);  slike.push(response.slika1);
            drugaSlika.remove();
            trecaSlika.remove();
           
            $('#sljedeci').prop('disabled', true);

            $("#sljedeci").css("background-color", "red");
          }
           

           }) 
      };
  
    
  function vratiSlikeImpl()
  {
    return slike;
  }

  function vratiZadnjaSlikaImpl()
  {
    return ucitanaZadnjaSlika;
  }


  function loadOsoblje(callback){
   
    
    var ajax = new XMLHttpRequest();
      ajax.overrideMimeType("application/json");
      ajax.open('GET', '/osoblje', true);
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == "200") {
         
         
          callback(ajax.responseText);
          }
      };
      
      ajax.send(); 

}

  function ucitajOsobljeImpl()
  {
    loadOsoblje(function(response) {
      obj = JSON.parse(response);
     osobljeDOM=document.getElementById('osoblje');
     for(var i=0; i<obj.length; i++)
     {
       var value= document.createElement('option');
       var s='';
      
       if(obj[i].uloga=="profesor")
       {
         s+='Prof. '+obj[i].ime+' '+obj[i].prezime;
       }
       else if(obj[i].uloga=="asistent")
       {
        s+='Asis. '+obj[i].ime+' '+obj[i].prezime;
       }
       else{
        s+=''+obj[i].ime+' '+obj[i].prezime;
       }
       value.value=s;
       osobljeDOM.appendChild(value);
       osobljeDOM.children[i].text=s;
     }
   });
  }
 
  function ajaxSale(callback){
   
  
    var ajax = new XMLHttpRequest();
      ajax.overrideMimeType("application/json");
      ajax.open('GET', '/sale', true);
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == "200") {
         
          
          callback(ajax.responseText);
          }
      };
      
      ajax.send(); 

}



  function ucitajSaleImpl()
  {
    ajaxSale(function(response) {
      obj = JSON.parse(response);
     saleDOM=document.getElementById('sale');
     for(var i=0; i<obj.length; i++)
     {
       var value= document.createElement('option');
       var s=obj[i].naziv;
      
       value.value=s;
       saleDOM.appendChild(value);
       saleDOM.children[i].text=s;
     }
   });
  }

  function ajaxZauzecaOsoblja(vrijeme,callback){
   
    var xhr = new XMLHttpRequest();
     
    xhr.open("POST", '/zauzecaOsoblja', true);
    xhr.overrideMimeType("application/json");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                
                object = JSON.parse(xhr.responseText);
                callback(object);
            } else {

            }
        }
    };
    xhr.send(JSON.stringify(vrijeme));

}



  function ucitajZauzecaOsobljaImpl()
  {
    ajaxZauzecaOsoblja(vrijeme(),function(response) {
      obj = response;
     

     //< $("#tabelaOsoblja").empty();
      
     

      $('table> tbody').children( 'tr:not(:first)' ).remove();
     

      for(osoba of obj)
      {
        var u;
        if(osoba.uloga=="profesor")
          u="Prof. "
         else if(osoba.uloga=="asistent") 
          u="Asis. "
         else 
            u="" 

         var $red = $('<tr>'+
            '<td>'+u+osoba.ime+" "+osoba.prezime+'</td>'+
            '<td>'+osoba.sala+'</td>'+
        '</tr>');    
         
            $('table> tbody').append($red);
          }

     
     
    });
  }

function vrijeme()
{
  var today = new Date();

  if(today.getHours()<10)
         sat="0"+today.getHours();
  else
         sat=today.getHours();  
   
  if(today.getMinutes()<10)
         minute="0"+today.getMinutes();
  else
         minute=today.getMinutes();   
 
  var vrijeme = sat + ":" + minute+":00";
 
 
  if(today.getDate()<10)
         dan="0"+today.getDate();
  else
         dan=today.getDate();  
   
  if((today.getMonth()+1)<10)
         mjesec="0"+(today.getMonth()+1);
  else
         mjesec=(today.getMonth()+1);
 
 
  
 var datum = dan+"."+mjesec+"."+"2020";
 
 
 var vrijemeIDatum={vrijeme:vrijeme, datum:datum};

 return vrijemeIDatum;
}


return {

ucitajPodatke: ucitajPodatkeImpl,
//upisiZauzeceJSON: upisiZauzeceJSONImpl,
ucitajSlike:ucitajSlikeImpl,
ucitajOsoblje:ucitajOsobljeImpl,
ucitajSale:ucitajSaleImpl,
upisiZauzece:upisiZauzeceImpl,
ucitajZauzecaOsoblja:ucitajZauzecaOsobljaImpl,



vratiSlike:vratiSlikeImpl,
vratiZadnjaSlika:vratiZadnjaSlikaImpl

}
}());

