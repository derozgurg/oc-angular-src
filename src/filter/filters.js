 /**
 * @author Özgür Çimen
 * Geçen süreyi gösteren Angular filtresi
 * Kullanışı : |estimateTime:{short:True}
 * @param shorted true ise kısaltma biçimde 
 **/
 ocanMod.filter("estimateTime",function () {
 	return function(value,params){

 		if(typeof value != "number" || typeof value == "undefined") 
 			return value;

 		var ds ="gün";
 		var hs="saat";
 		var ms="dakika";
 		var ss="saniye";

 		if(params){
 			if(params.shorted){ 				
 				ms="dak";
 				ss="san"; 				
 			}
 			
 			/*if(params.lang){ 	
 			//TODO çoklu dil 			
 			}*/
 		}

 		var result = "";

 		var x = value / 1000;
		var s = Math.floor(x % 60);x /= 60;
		var m = Math.floor(x % 60);x /= 60;
		var h = Math.floor(x % 24);x /= 24;  
		var d = Math.floor(x);

		if (d > 0 ) result = d + " "+ds+" ";
		if (h > 0 ) result += h +" "+hs+" ";
		if (m > 0 ) result += m +" "+ms+" ";
		if (s > 0 ) result += s +" "+ss+" ";

		return result;
 	} 	
 });


 ocanMod.filter("exclude",function(){
	return function(items,excludes){	
		if(typeof items =="undefined") return;
		
		if(typeof excludes == "undefined"){
			return items;
		}	

		var result = [];

		for(var i = 0; i < items.length;i++){			
			var item = items[i];			
			if(excludes.indexOf(item) < 0 ){
				result.push(item);				
			} 
			else{
				for (var k = 0; k < excludes.length; k++) {					
					var exclude = excludes[k];
				};
			}
		}		
		return result;
	}
});