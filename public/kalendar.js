let Kalendar = (function(){
   
    months = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];
    month=document.getElementById("month");
    var tmpZauzeca=[];

    var svaPeriodicnaZauzeca=[];
    var svaVanrednaZauzeca=[];
    
    function vratiMjesec(datum){
        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        var d = new Date(datum.replace(pattern,'$3-$2-$1'));
        return d.getMonth();
    }

    function vratiDan(datum){
        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        var d = new Date(datum.replace(pattern,'$3-$2-$1'));
        return d.getDate();
    }
    
   Velicina = function(obj) { //velicina objekta, ako je 6 periodicno zauzece a ako je 5 vanredno
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };


     function Semestar( mjesec) { //provjerava kojem semestru pripada mjesec
        var s;
        if(mjesec>8 || mjesec==0)  { 
            s="zimski";
        }
        else if(mjesec>0 && mjesec<6){
            s="ljetni";
        }   
        return s;        
  }
   
  function obojiPeriodicno( kalendarRef,dan,boja)
  {
    for(dan; dan<37; dan+=7)
    {
    var tmp=kalendarRef.children[dan].childNodes[0].nodeValue; //poredimo da ne bojimo nepostojeće divove
    if(tmp!=0)// && kalendarRef.children[dan].childNodes[1].className!="zauzeta") //dodan drugi uslov 
        (kalendarRef.children[dan].childNodes[1].className=boja)
    }
  }

  function obojiVanredno(kalendarRef,dan,boja)
  {
    var i=0;
    while(i<37)
    {
    if(kalendarRef.children[i].childNodes[0].nodeValue==dan)// && kalendarRef.children[i].childNodes[1].className!="zauzeta")//dodan drugi uslov
        kalendarRef.children[i].childNodes[1].className=boja
     i++   
    }
    
  }
  
  function vratiZauzecaZaMjesec(periodicna, vanredna, mjesec)
  {
       var mjesecnaZauzeca=[];

      for(var i=0; i<periodicna.length;i++)
      {
          var s=Semestar(mjesec); 
          if(s==periodicna[i].semestar)
          mjesecnaZauzeca.push(periodicna[i]);
      }

      for(var i=0; i<vanredna.length;i++)
      {
          var mj=vratiMjesec(vanredna[i].datum);
          if(mj==mjesec)
          mjesecnaZauzeca.push(vanredna[i]);
      }

      return mjesecnaZauzeca;

  }

  function vratiPresjek(pocetak,kraj,zauzecePocetak,zauzeceKraj)
  {
      
     
      var pocetakUnutarIntervala= new Boolean(pocetak >= zauzecePocetak && pocetak <= zauzeceKraj);
      var krajUnutarIntervala= new Boolean(kraj >= zauzecePocetak && kraj <= zauzeceKraj);
      var intervalPrekoIntervala= new Boolean(pocetak <= zauzecePocetak && kraj>=zauzeceKraj);
      var intervalUnutarIntervala=new Boolean(pocetak >= zauzecePocetak && kraj <= zauzeceKraj );
     
     // var presjek= (pocetakUnutarIntervala || krajUnutarIntervala || intervalPrekoIntervala || intervalUnutarIntervala);
        
        if(pocetakUnutarIntervala == true || krajUnutarIntervala==true || intervalPrekoIntervala == true || intervalUnutarIntervala == true) 
         {
             return 0;
            }
         else{
          return 1;
        }
    
    
      
  }





    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
        
    

      var a= $( "#osoblje option:selected" ).text();
   

        var mjesecnaZauzeca;
        mjesecnaZauzeca=vratiZauzecaZaMjesec(svaPeriodicnaZauzeca,svaVanrednaZauzeca,mjesec);

        for(var i=0; i<mjesecnaZauzeca.length; i++)
        {
            var zauzece=mjesecnaZauzeca[i];
            
            var presjek=vratiPresjek(pocetak,kraj,zauzece.pocetak,zauzece.kraj);
            if(presjek==0 && a==zauzece.predavac)
            {
                var zauzece=mjesecnaZauzeca[i];
                var semestar=Semestar(mjesec);
                var boja="zauzeta";
                if(typeof(zauzece.dan)=='number')
                {
                        if(zauzece.semestar==semestar && sala==zauzece.naziv)
                        {
                            var j=parseInt(zauzece.dan);//traži se dan koji se boji u kalendaru
                            obojiPeriodicno(kalendarRef,j,boja); 
                        }
                }
                else if(zauzece.datum)
                {
                    if(sala==zauzece.naziv)
                    {
                        var k=vratiDan(zauzece.datum);
                        obojiVanredno(kalendarRef,k,boja);  
                    }
                }
            }
           
            
           // var presjekZauzeca;
          
           
           
        
        }
            
   
           
}
    
   
    function ucitajPodatkeImpl(periodicna, vanredna){

        //console.log(periodicna);
        //console.log(vanredna);

     if(svaPeriodicnaZauzeca.length!=0)  //stari podaci se prepisuju sa novim tj. brišu se
     {
        svaPeriodicnaZauzeca=[];
        svaVanrednaZauzeca=[];
     }
     if(svaVanrednaZauzeca.length!=0)
     {
         svaVanrednaZauzeca=[];
         svaVanrednaZauzeca=[];
     }   
        
    for(var i=0; i<periodicna.length; i++)
                 svaPeriodicnaZauzeca.push(periodicna[i])  
        
     for(var i=0; i<vanredna.length; i++)
                 svaVanrednaZauzeca.push(vanredna[i])   
                 
    }
    function iscrtajKalendarImpl(kalendarRef, mjesec){
        
    month.innerHTML=months[mjesec];
    var date = new Date(), y = 2020;
    var firstDay = new Date(y, mjesec, 1);
    var lastDay = new Date(y, mjesec + 1, 0);
    var brojDanaUMjesecu=new Date(y, mjesec+1, 0).getDate();
    var prvi=firstDay.getDay();
    var zadnji=lastDay.getDay();
    if(prvi==0) prvi=7;
    if(zadnji==0) zadnji=7
    
    
    
    kalendarRef.innerHTML=" ";
    var dan=1;
    for(var i=0; i<42; i++)//provjeri ovo može li se još smanjiti---provjereno
    {
    var day=document.createElement('li');
    var d=document.createElement('div');
    if(i+1<prvi || dan>brojDanaUMjesecu)
        {
         day.appendChild(document.createTextNode("0"));
         d.classList.add("slobodna");
         day.style.visibility = "hidden";
        }
     else
        {
            day.appendChild(document.createTextNode(dan));
            day.classList.add("dan");//dodano

            d.classList.add("slobodna");
            day.appendChild(d);
            dan++;
        }
    kalendarRef.appendChild(day);
    }

    }
    return {
    obojiZauzeca: obojiZauzecaImpl,
    ucitajPodatke: ucitajPodatkeImpl,
    iscrtajKalendar: iscrtajKalendarImpl
    }
    }());
    