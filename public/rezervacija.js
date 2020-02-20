
var mjesec=0;
var divKalendar=document.getElementById("days");
var btnSljedeci=document.getElementById("sljedeci");
var btnPrethodni=document.getElementById("prethodni");



Kalendar.iscrtajKalendar(divKalendar,mjesec); 



$( document ).ready(function() {
  Pozivi.ucitajPodatke();

  Pozivi.ucitajOsoblje();
  
  Pozivi.ucitajSale();
});


var dan;

  $(document).on('click', '.dan', function(){ 
    
    var index = $(".dan").index(this);
    index++;
    var j=index;
    dan=index;
    

    if($("#pocetak").val()=="" && $("#kraj").val()=="")
    {
      alert("Unesite pocetak i kraj za rezervisanje termina!")
    }
    else
    {
    for(var i=0; i<42; i++)
    {
      if(($(".dan:nth-child("+i+")").text()==index) && ($(".dan:nth-child("+i+")").children().attr('class')=='slobodna'))
      {
       
        var r = confirm("Da li želite da rezervišete ovaj termin?");
        if (r == true) {
          var zauzece;
          if ($('#checkbox').is(':checked')) 
            {
              j=postaviUprvuSedmciuDana(j);
              j--;
              if(j==-1) //ode nedjelja u minus
                j=6;
              var d=j;
              var semestar=dajSemestar(mjesec);
              if(semestar==undefined)
                    alert("Ne može mjesec "+ $("#month").text() +" za periodično zauzeće, raspust!")        
              else{
               zauzece={    
                            dan:d,
                            semestar:semestar,
                            pocetak:$("#pocetak").val(),
                            kraj:$("#kraj").val(),
                            naziv:$( "#sale option:selected" ).text(),
                            predavac:$( "#osoblje option:selected" ).text()
                          };
              
           //  Pozivi.upisiZauzeceJSON(zauzece);  spirala 3 upisivanje/JSON

           Pozivi.upisiZauzece(zauzece);
              }

            }
            else{
           
              var d;
              if(index<10)
                     d= "0"+index.toString(); //zbog upisa npr:01:12:2019, 04:03:2019 i sl.
              else 
                  d=index.toString(); 
              var m=mjesec+1;
              if(m<10)
                m="0"+m.toString();
              else
                m=m.toString();

                 zauzece={ 
                  datum:d+"."+m+".2020",
                 pocetak:$("#pocetak").val(),
                  kraj:$("#kraj").val(),
                  naziv:$( "#sale option:selected" ).text(),
                  predavac:$( "#osoblje option:selected" ).text()
                };
                
                   // Pozivi.upisiZauzeceJSON(zauzece);   spirala 3 upisivanje/JSON
                   Pozivi.upisiZauzece(zauzece);
                }
            }
              
            

        }
        else if(($(".dan:nth-child("+i+")").text()==index) && ($(".dan:nth-child("+i+")").children().attr('class')=='zauzeta'))
          {
            alert("Već ste zauzeli taj termin!");
          break;
          }
       
             
      
  }
}
     
  
}); 


function oboji() {

Kalendar.iscrtajKalendar(divKalendar,mjesec);
//var sale = document.getElementById("sale");
//var sala = sale.options[sale.selectedIndex].innerHTML;
 var sala=$( "#sale option:selected" ).text();
var pocetak=document.getElementById("pocetak");
var kraj=document.getElementById("kraj");
if(pocetak.value!="" && kraj.value!="")
    Kalendar.obojiZauzeca(divKalendar, mjesec, sala, pocetak.value, kraj.value);

   
       
}


function next() {
    mjesec++;
    if(mjesec==11)
    {
        btnSljedeci.disabled = true;
    }
    else 
    {
       if(mjesec==1)btnPrethodni.disabled=false;
    }
     Kalendar.iscrtajKalendar(divKalendar,mjesec); 
     oboji();
     
     
}

function previous(){
    mjesec--;
    if(mjesec==0)
    {
        btnPrethodni.disabled = true;
    }
    else
    {
      if(mjesec==10)  btnSljedeci.disabled=false;
    }
    Kalendar.iscrtajKalendar(divKalendar,mjesec);
    oboji();
 
}

function brojNevidljivihDana()
{
  var j=0;
  for(var i=1; i<=7; i++)
    {  if($("#days li:nth-child("+i+")").text()==0)
        j++;
    }
    return j;
}

function postaviUprvuSedmciuDana(j)
{
  while(j>=0)
  {
    j-=7;
  }
  if(j+brojNevidljivihDana()>0)
          j+=brojNevidljivihDana();
  else{
    j+=7;
    j+=brojNevidljivihDana();
  } 
  return j;
}



function dajSemestar( mjesec) { //provjerava kojem semestru pripada mjesec
  var s;
  if(mjesec>8 || mjesec==0)  { 
      s="zimski";
  }
  else if(mjesec>0 && mjesec<6){
      s="ljetni";
  }   
  return s;        
}

function podaciKlika()
{
  var m=mjesec;
  m++;
  var d=""+dan.toString()+"/"+m.toString()+"/"+"2020";
   var podaci={naziv: $("#sale").val(), pocetak:$("#pocetak").val(), kraj:$("#kraj").val(),datum:d}

   return podaci;
  
}