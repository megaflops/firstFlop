
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./iotConfigs.json', 'utf8'));
console.log("output  " +config.HOME.LP.count  +" " +config.HOME.LP.mapping[0].state);

printConfig(config);
updateConfig(config,"LP",0,0);
updateConfig(config,"FP",0,0);
updateConfig(config,"AP",0,0);
printConfig(config)

function printConfig(config){
	id = config.HOME.id;
	var i,j,k;
	var count =0;
	var typeObj;
	var string="def";
	console.log("HOME ID" +id);
	var numType = config.HOME.numType;
	for(j=0; j<numType ;j++){
		switch(config.HOME.typeArray[j]){
		case "LP":
		  count =  config.HOME.LP.count;
		  string = "LP";
		  typeObj=config.HOME.LP;
		  break;
		case "FP":
		  count =  config.HOME.FP.count;
		  string = "FP";
		  typeObj=config.HOME.FP;
		  break;
		case "AP":
		  count =  config.HOME.AP.count;
		  string = "AP";
		  typeObj=config.HOME.AP;
		  break;
		default:
		  typeObj=0;
		}
	if(typeObj !=0){	
	for(i=0 ; i <count ; i++) {
		var state1 =  ((typeObj.mapping[i].state) == "1") ? "ON" : "OFF";
		console.log("Room" + typeObj.mapping[i].link +" " +string +" State:" +state1);
	}
	}
   }
}

function updateConfig(config,type,index,value) {
	var typeObj;	
	switch(type){
		case "LP":
		  count =  config.HOME.LP.count;
		  string = "LP";
		  typeObj=config.HOME.LP;
		  break;
		case "FP":
		  count =  config.HOME.FP.count;
		  string = "FP";
		  typeObj=config.HOME.FP;
		  break;
		case "AP":
		  count =  config.HOME.AP.count;
		  string = "AP";
		  typeObj=config.HOME.AP;
		  break;
		default:
		  console.log("Wrong type receoved" +type);

		}
		if(index >= count){
			console.log("Outof bound index " +index +" count " +count +" For " +string);
			return;
		}
		if(typeObj != 0){
		   typeObj.mapping[index].state=value
		}
	
		var json = JSON.stringify(config); //convert it back to json
	        //console.log(json);	
    		fs.writeFile('./myjsonfile.json', json, 'utf8', function(err) { // write it back 
			 if (err) { throw 'error writing file: ' + err;}
			 else {
           		     console.log("JASON file modification done"); }
		  })
		//var json = JSON.stringify(config); 
	//var newConfig = JSON.parse(json);
	//printConfig(newConfig);
}

function fileWriteBack(err){
	console.log("JASON file modified done");

}
/*
function readObject(arg1, arg2,count){
	numHomes = config.GWID.count;
	var i,j;
	for(i=0 ; i <numHomes ; i++) {
		var obj = config.GWID;
		if(obj[arg1]){
			console.log(" HOME found" +arg1 + arg2 +obj[arg1] );
			var objRoom = config.GWID.HOME[i];
			if(objRoom[arg2]){
			console.log(" room found" +arg1 + arg2 +objRoom[arg2]);
			  if(config.GWID.HOME[i].rCount < count) {
			     console.log("given index is more than available index" +count + config.GWID.HOME[i].rCoun);
			  }
			  else{
			     console.log("return data " +config.GWID.HOME[i].room[count].ID);
			  }
			}
			else{
			     console.log(" room found" +arg1 + arg2 +objRoom[arg2]);
			}
		}
		else{
			console.log(" HOME Not found" +arg1 + arg2 +obj[arg1]);
		}
	}
}
*/
