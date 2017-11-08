/**
 * @author Ozgur Cimen on 27-Oct-15.
 */	
ocanMod.service("$ocScrollDelegate",function(){
	
	var scrollAvailable = false;

	this.infiniteScrollComplete = function(){
		scrollAvailable = true;		
	}

	this.setAvailable = function(value){
		scrollAvailable = value;
	}

	this.getAvailable = function(){
		return scrollAvailable;
	}
});