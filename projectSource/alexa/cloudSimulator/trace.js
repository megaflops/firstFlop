
module.exports.Err = function(tag,string){
	console.log("ERROR  " +tag +" " +string);
}

module.exports.Info = function(tag,string){
	console.log("INFO " +tag +" " +string);
}

module.exports.War = function(tag,string){
	console.log("WARNING " +tag +" " +string);
}

module.exports.Debug = function(tag,string){
	console.log("DEBUG " +tag +" " +string);
}



