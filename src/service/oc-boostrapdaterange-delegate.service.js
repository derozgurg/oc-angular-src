/**
 * @author Ozgur Cimen on 27-Oct-15.
 */	
ocanMod.service("$ocDateRangeDelegate",function($timeout){
	
	var delegates = [];

	this.set = function(id,range){		
		delegates[id] = range;		
	}

	this.getDatePicker = function(id){
		console.log(delegates[id]);
		if(delegates[id] == null){
			$timeout(function(){
				return delegates[id];
			},200);			
		} 
		else return delegates[id];
	}

	this.remove = function(id){
		if(delegates[id]) delegates[id] = null;
		delete delegates[id];
	}
});