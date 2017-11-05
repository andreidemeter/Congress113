
$(function () {
	
	var miembros, miembrosS, miembrosH;
	var birthdayS,birthdayH;
	var datasenate,datahouse;
	
	 $.getJSON('http://congress.api.sunlightfoundation.com/legislators?chamber=senate&per_page=all&apikey=837ea94f520b43a0825be5db3b44a39b', function (data){
		 birthdayS=data;
			birthdayS.results.forEach(function(item){
			birthdayS[item.bioguide_id]= item.birthday;
			 });
		 console.log(birthdayS);
		 });
		
		
		$.getJSON('http://congress.api.sunlightfoundation.com/legislators?chamber=house&per_page=all&apikey=837ea94f520b43a0825be5db3b44a39b', function (data){
			 birthdayH=data;
			birthdayH.results.forEach(function(item){
			birthdayH[item.bioguide_id]= item.birthday;
			});
		});
        
	$.getJSON('https://nytimes-ubiqum.herokuapp.com/congress/113/senate.json', function (data){
          miembrosS=data.results[0].members.map(function(item){ 
			  return {
				  id: item.id,
				  name: [item.first_name, item.middle_name, item.last_name].join(" "),
				  state: item.state,
				  party: item.party,
				  party_name: item.party == "R"?"Republican": (item.party == "D"?"Democrat": "Independent"),
				  seniority: item.seniority,
				  votes_with_party_pct: item.votes_with_party_pct,
				  missed_votes_pct: item.missed_votes_pct,
				  missed_votes: item.missed_votes,
				  total_votes: item.total_votes,
				  url: item.url,
				  birthday: birthdayS[item.id]
				   }
			  });
			 datasenate=data;
        });
        $.getJSON('https://nytimes-ubiqum.herokuapp.com/congress/113/house.json', function (data){
           miembrosH=data.results[0].members.map(function(item){
			  return {
				  id: item.id,
				  name: [item.first_name, item.middle_name, item.last_name].join(" "),
				  state: item.state,
				  party: item.party,
				  party_name: item.party == "R"?"Republican": (item.party == "D"?"Democrat": "Independent"),
				  seniority: item.seniority,
				  votes_with_party_pct: item.votes_with_party_pct,
				  missed_votes_pct: item.missed_votes_pct,
				  missed_votes: item.missed_votes,
				  total_votes: item.total_votes,
				  url: item.url,
				  birthday: birthdayH[item.id]
				   }
			  });
			datahouse=data;
        });
	
		
		
$('.bottonsenate').on("click", function (){
   var datsenID=$(this).attr("data-senid"); 
	switch(datsenID){
		case "datsen1": dataSource(miembrosS,'SENATE MEMBERS');
			break;
		case "datsen2": dataSource(miembrosH,'HOUSE OF REPRESENTANS MEMBERS');
			break;
		case "datsen3": dataSourceAttendance(datasenate,'SENATE MEMBERS');
			break;
		case "datsen4": dataSourceAttendance(datahouse,'HOUSE OF REPRESENTANS MEMBERS');
			break;
		case "datsen5": dataSourceParty(datasenate,'SENATE MEMBERS');
			break;
		case "datsen6": dataSourceParty(datahouse,'HOUSE OF REPRESENTANS MEMBERS');
			break;
				   }
    });

});

var estado, partyR, partyD, partyI;
	var titulo;

function dataSource(source, title){
    data = source;
	getTable(data);
	
}
$("#mapa").on("click",function(){
	$("#chartdiv").css("display","block");
	$("#congres113").hide();
    $("#attendance-table").hide();
	$("#party-loyalty").hide();
	$("#sortByParty").hide();
	
});
				 

function getTable(data){
  estado = document.getElementById("state").value;
  partyR = document.getElementById("partyR").checked;
  partyD = document.getElementById("partyD").checked;
  partyI = document.getElementById("partyI").checked;

    document.getElementById("titulos_tabla").innerHTML = titulo;
    $("#congres113").show();
    $("#attendance-table").hide();
	$("#party-loyalty").hide();
	$("#sortByParty").show();
	$("#chartdiv").css("display","none");
	 var members= data;
	var object= {dato:data};
  	var filterMembers={
	  datos: []
	  }
  for (i=0; i < object.dato.length;i++){
		if (memberValid(object.dato[i])){
			filterMembers.datos.push(object.dato[i]);
		}
	}
	
	var tablaPrueba="{{#datos}}<tr><td><a href='{{url}}'> {{ name }} </a></td><td> {{ birthday }}<td> {{party}} </td><td> {{state}} </td><td> {{seniority}} </td><td> {{votes_with_party_pct}} %</td></tr></a>{{/datos}}";
	var taula= Mustache.to_html(tablaPrueba,filterMembers); 
	$("#data-table").html(taula);
}
 
 function nombre (persona){
     var nombre = persona.first_name;
     if (persona.middle_name!=null){
         nombre+= " "+persona.middle_name;
     }
     nombre+= " "+persona.last_name;
     return nombre;
 }

// function partido (persona){
//  if (persona.party== "I"){
//                         return "Independent";
//                     } else if (persona.party== "R"){
//                         return "Republican";
//                     } else if (persona.party== "D"){
////                         return "Democrat";
////                     }
////                     return " ";
//
// }
 function memberValid(persona){
     if (!stateValid(persona.state)){return false;}
     if (!partyR && !partyD && !partyI){return true;}
     if ((partyR&&persona.party=="R")||(partyD&&persona.party=="D")||(partyI&&persona.party=="I")){return true;}
     return false;
 }
 function stateValid(state){
     return estado== "All" || estado == state;
 }
//Task 3-------------------//
var membersR,membersD,membersI;

function nMembers1(){

  var stadistics = { nRepublicans:membersR.length,nDemocrats:membersD.length,nIndependents:membersI.length, pctR:0,pctD:0,pctI:0};
    stadistics.pctR = totalPct(membersR);
    stadistics.pctD = totalPct(membersD);
    stadistics.pctI = totalPct(membersI);

    var salida1="";
        salida1 +=  "<tr><th>Party</th><th>Number of Reps</th><th>% Voted with Prty</th></tr><tr><td>Republican</td><td>"
              +stadistics.nRepublicans+"</td><td>"+stadistics.pctR+"</td></tr><tr><td>Democrat</td><td>"
              +stadistics.nDemocrats+"</td><td>"+stadistics.pctD+"</td></tr><tr><td>Independent</td><td>"
              +stadistics.nIndependents+"</td><td>"+stadistics.pctI+"</td></tr>"
              document.getElementById("tablatend1").innerHTML = salida1;
              document.getElementById("tablatend2").innerHTML = salida1;

 function totalPct(membersX){
   var sumaX=0;
   var mediaX;
   for (var i=0; i < membersX.length; i++){
     sumaX += parseFloat(membersX[i].votes_with_party_pct);
  }
  mediaX=parseFloat(sumaX/membersX.length).toFixed(2);
  return mediaX;
    }
  }

function dataSourceAttendance(datasource, title){
  document.getElementById("titulos_tabla2").innerHTML = titulo;
  $("#congres113").hide();
  $("#attendance-table").show();
  $("#party-loyalty").hide();
	$("#chartdiv").css("display","none");
    data=datasource;
     members= data.results[0].members;
     membersR=members.filter(function(item){return item.party=="R";});
     membersD=members.filter(function(item){return item.party=="D";});
     membersI=members.filter(function(item){return item.party=="I";});
    nMembers1();
    lessengaged1();
    mostengaged1();
  }
function mostengaged1(){

  var leastengaged = members.sort(function(a,b){
    return parseFloat(a.missed_votes_pct) - parseFloat(b.missed_votes_pct);
  })
  var maximo = parseInt(members.length/10);
  while (maximo < members.lenght && mebers[maximo].missed_votes == members[maximo -1].missed_votes){
    maximo++;
  }
  var salida= "<tr><th>Name</th><th>Number Missed Votes</th><th>% Missed Votes</th></tr>";
;
  for(i=0;i<maximo;i++){
  salida+="<tr><td>"+nombre(leastengaged[i])+ "</td><td>"+leastengaged[i].missed_votes+"</td><td>"+leastengaged[i].missed_votes_pct+"</td></tr>"
  }
  document.getElementById('most-engaged1').innerHTML=salida;
}
function lessengaged1(){
  var leastengaged = members.sort(function(a,b){
    return parseFloat(b.missed_votes_pct) - parseFloat(a.missed_votes_pct);
  })
  var maximo = parseInt(members.length/10);
  while (maximo < members.lenght && mebers[maximo].missed_votes == members[maximo -1].missed_votes){
    maximo++;
  }
  var salida= "<tr><th>Name</th><th>Number Missed Votes</th><th>% Missed Votes</th></tr>";
;
  for(i=0;i<maximo;i++){
  salida+="<tr><td>"+nombre(leastengaged[i])+ "</td><td>"+leastengaged[i].missed_votes+"</td><td>"+leastengaged[i].missed_votes_pct+"</td></tr>"
  }
  document.getElementById('least-engaged1').innerHTML=salida;
}
function dataSourceParty(datasource,title){

    document.getElementById("titulos_tabla2").innerHTML = titulo;
    $("#congres113").hide();
    $("#attendance-table").hide();
    $("#party-loyalty").show();
	$("#chartdiv").css("display","none");
  data=datasource;
   members= data.results[0].members;
   membersR=members.filter(function(item){return item.party=="R";});
   membersD=members.filter(function(item){return item.party=="D";});
   membersI=members.filter(function(item){return item.party=="I";});
  nMembers1();
  lessengaged2();
  mostengaged2();
}
function lessengaged2(){

    var  Lessloyal= members.sort(function(a, b){return a.votes_with_party_pct - b.votes_with_party_pct}),
      maximo = parseInt(members.length/10);

      while(maximo<members.length && members[maximo].missed_votes == members[maximo-1].missed_votes){
        maximo++;
    }


    var salida4= "<tr><th>Name</th><th>Number Party Votes</th><th>	% Party Votes</th></tr>";

        for (i=0; i<maximo; i++){
            salida4+=
            "<tr><td><a href=" +
            Lessloyal[i].url +
            ">" +
            nombre(Lessloyal[i]) +
            "</a></td><td>"+
            partyVotes(Lessloyal[i]) +"</td><td>"+
            Lessloyal[i].votes_with_party_pct +
            "</td></tr>"
            }

    document.getElementById("least-engaged2").innerHTML = salida4;
}
function mostengaged2(){

    var  Lessloyal= members.sort(function(a, b){return b.votes_with_party_pct - a.votes_with_party_pct}),
      maximo = parseInt(members.length/10);

      while(maximo<members.length && members[maximo].missed_votes == members[maximo-1].missed_votes){
        maximo++;
    }


    var salida4= "<tr><th>Name</th><th>Number Party Votes</th><th>	% Party Votes</th></tr>"

        for (i=0; i<maximo; i++){
            salida4+=
            "<tr><td><a href=" +
            Lessloyal[i].url +
            ">" +
            nombre(Lessloyal[i]) +
            "</a></td><td>"+
            partyVotes(Lessloyal[i]) +"</td><td>"+
            Lessloyal[i].votes_with_party_pct +
            "</td></tr>"
            }

    document.getElementById("most-engaged2").innerHTML = salida4;
  }
function partyVotes(x){

   return parseFloat(x.total_votes*(x.votes_with_party_pct/100)).toFixed(2);
}
//MAPA//
var map = AmCharts.makeChart( "chartdiv", {
  "type": "map",
  "theme": "patterns",
  "colorSteps": 10,

  "dataProvider": {
    "map": "usaLow",
    "areas": [ {
      "id": "US-AL",
      "value": 4447100
    }, {
      "id": "US-AK",
      "value": 626932
    }, {
      "id": "US-AZ",
      "value": 5130632
    }, {
      "id": "US-AR",
      "value": 2673400
    }, {
      "id": "US-CA",
      "value": 33871648
    }, {
      "id": "US-CO",
      "value": 4301261
    }, {
      "id": "US-CT",
      "value": 3405565
    }, {
      "id": "US-DE",
      "value": 783600
    }, {
      "id": "US-FL",
      "value": 15982378
    }, {
      "id": "US-GA",
      "value": 8186453
    }, {
      "id": "US-HI",
      "value": 1211537
    }, {
      "id": "US-ID",
      "value": 1293953
    }, {
      "id": "US-IL",
      "value": 12419293
    }, {
      "id": "US-IN",
      "value": 6080485
    }, {
      "id": "US-IA",
      "value": 2926324
    }, {
      "id": "US-KS",
      "value": 2688418
    }, {
      "id": "US-KY",
      "value": 4041769
    }, {
      "id": "US-LA",
      "value": 4468976
    }, {
      "id": "US-ME",
      "value": 1274923
    }, {
      "id": "US-MD",
      "value": 5296486
    }, {
      "id": "US-MA",
      "value": 6349097
    }, {
      "id": "US-MI",
      "value": 9938444
    }, {
      "id": "US-MN",
      "value": 4919479
    }, {
      "id": "US-MS",
      "value": 2844658
    }, {
      "id": "US-MO",
      "value": 5595211
    }, {
      "id": "US-MT",
      "value": 902195
    }, {
      "id": "US-NE",
      "value": 1711263
    }, {
      "id": "US-NV",
      "value": 1998257
    }, {
      "id": "US-NH",
      "value": 1235786
    }, {
      "id": "US-NJ",
      "value": 8414350
    }, {
      "id": "US-NM",
      "value": 1819046
    }, {
      "id": "US-NY",
      "value": 18976457
    }, {
      "id": "US-NC",
      "value": 8049313
    }, {
      "id": "US-ND",
      "value": 642200
    }, {
      "id": "US-OH",
      "value": 11353140
    }, {
      "id": "US-OK",
      "value": 3450654
    }, {
      "id": "US-OR",
      "value": 3421399
    }, {
      "id": "US-PA",
      "value": 12281054
    }, {
      "id": "US-RI",
      "value": 1048319
    }, {
      "id": "US-SC",
      "value": 4012012
    }, {
      "id": "US-SD",
      "value": 754844
    }, {
      "id": "US-TN",
      "value": 5689283
    }, {
      "id": "US-TX",
      "value": 20851820
    }, {
      "id": "US-UT",
      "value": 2233169
    }, {
      "id": "US-VT",
      "value": 608827
    }, {
      "id": "US-VA",
      "value": 7078515
    }, {
      "id": "US-WA",
      "value": 5894121
    }, {
      "id": "US-WV",
      "value": 1808344
    }, {
      "id": "US-WI",
      "value": 5363675
    }, {
      "id": "US-WY",
      "value": 493782
    } ]
  },

  "areasSettings": {
    "autoZoom": true
  },

  "valueLegend": {
    "right": 10,
    "minValue": "little",
    "maxValue": "a lot!"
  },

  "export": {
    "enabled": true
  }

} );