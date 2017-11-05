var members= datasenate.results[0].members;
var membersR=members.filter(function(item){return item.party=="R";});
var membersD=members.filter(function(item){return item.party=="D";});
var membersI=members.filter(function(item){return item.party=="I";});
var stadistics = { nRepublicans:membersR.length,nDemocrats:membersD.length,nIndependents:membersI.length};


 console.log(stadistics.nRepublicans);
