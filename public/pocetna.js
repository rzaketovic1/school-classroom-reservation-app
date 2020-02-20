





var btnSljedeci=document.getElementById("sljedeci");
var btnPrethodni=document.getElementById("prethodni");


var slikeDOM=document.getElementById('slike');
 

$( document ).ready(function() {
    var poziv="onload";
    Pozivi.ucitajSlike(poziv);  //onload zbog refresa stranica, da vratimo brojac sesije u index.js

});
 

function sljedeci()
{
    var prvaSlika=$('#prvaSlika');
    var  drugaSlika=$('#drugaSlika');
    var trecaSlika=$('#trecaSlika');
    
    

    var slike=Pozivi.vratiSlike();

    
   
    
    var poziv="poziv";
  
    if(btnPrethodni.disabled==true)
        btnPrethodni.disabled=false;
   
   
     
    
    if(Pozivi.vratiZadnjaSlika()==false)
      {  Pozivi.ucitajSlike(poziv); }//bitno je da je različito od "onload" zbog sesije  i refresha stranica
    else{

       if($('#trecaSlika').attr('src')==slike[slike.length-2])
        {
            drugaSlika.remove();
            trecaSlika.remove();
            prvaSlika.attr('src',slike[slike.length-1]);

        }
        
         else if($('#trecaSlika').attr('src')==slike[slike.length-3])
        {
            trecaSlika.remove();
            prvaSlika.attr('src',slike[slike.length-2]);
            drugaSlika.attr('src',slike[slike.length-1]);
        }
    
        else    
        {

        for(var i=0; i<slike.length; i++)
        {
            if(prvaSlika.attr('src')==slike[i])
            {
              if(slike[i+3]) 
                 prvaSlika.attr('src',slike[i+3]);
              if(slike[i+4]) 
                 drugaSlika.attr('src',slike[i+4]);
              if(slike[i+5])  
                 trecaSlika.attr('src',slike[i+5]);
                break;
             }
        }
    }
    }

  
    if($("#prethodni").css("background-color", "red"))
    $("#prethodni").css("background-color", "lightslategray")   

    if((trecaSlika.attr('src')==slike[slike.length-1] || drugaSlika.attr('src')==slike[slike.length-1]
     || prvaSlika.attr('src')==slike[slike.length-1]) && Pozivi.vratiZadnjaSlika()==true)
        {  $("#sljedeci").css("background-color", "red");  btnSljedeci.disabled=true;
        }


}


function prethodni()
{
    if($("#sljedeci").css("background-color", "red"))
         $("#sljedeci").css("background-color", "lightslategray")


    var slike=Pozivi.vratiSlike();

   
   var prvaSlika=$('#prvaSlika');
   var  drugaSlika=$('#drugaSlika');
   var trecaSlika=$('#trecaSlika');
 
  

   if($('#drugaSlika').attr('src')==undefined)
        {
            var img = document.createElement('img'); 
            slikeDOM.appendChild(img);
            img.id="drugaSlika";
            drugaSlika=$('#drugaSlika');
        }
        
    if($('#trecaSlika').attr('src')==undefined)
        {
            var img = document.createElement('img'); 
            slikeDOM.appendChild(img);
            img.id="trecaSlika";
            trecaSlika=$('#trecaSlika');
        }
    


    for(var i=0; i<slike.length; i++)
    {
        if(prvaSlika.attr('src')==slike[i])
        {
            prvaSlika.attr('src',slike[i-3]);
            drugaSlika.attr('src',slike[i-2]);
            trecaSlika.attr('src',slike[i-1]);
         }
         btnSljedeci.disabled=false;
    }
    
    if(prvaSlika.attr('src')==slike[0])
    {   btnPrethodni.disabled=true;
      $("#prethodni").css("background-color", "red");
    }
      else
         btnPrethodni.disabled=false; 
      
        


}
