/**
 * @author Ozgur Cimen on 27-Oct-15.
 *
 * oc-infinite-scroll v.0
 */	
ocanMod.directive("ocInfiniteScroll",function ($ocScrollDelegate) {
	return { 
	  	author:{
	  		name:"Özgür Çimen 2014",
	  		mail:"derozgur@gmail.com",
	  		web:"cimenozgur.com",	  		
	  	},
        restrict:"A",
        scope:{ocInfiniteScroll:"&",winscroll:"@"},
        link:function(scope, element, attrs, ctrl) {    
        	
	        function isScrolledIntoView(elem){
			    var $elem = $(elem);
			    var $window = $(window);

			    var docViewTop = $window.scrollTop();
			    var docViewBottom = docViewTop + $window.height();

			    var elemTop = $elem.offset().top;
			    var elemBottom = elemTop + $elem.height();

			    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
			}       

			$(element).css("height","10px");
			$(element).css("overflow","auto");
			$(element).css("overflow-x","hidden");		

			$ocScrollDelegate.setAvailable(true)
        	var target = element[0];
        	console.log("wind",scope.winscroll);
        	
        	if(!scope.winscroll){
        		$(element).parent().scroll(function(onscroll){	        			
	        		if($ocScrollDelegate.getAvailable()){	        	
		        		if(isScrolledIntoView(target)){	        			
		        			$ocScrollDelegate.setAvailable(false)
		        			if(scope.ocInfiniteScroll) scope.ocInfiniteScroll();
		        		}        			
	        		}
	        	})
        	}
        	else {
				window.onscroll = function(event){      	
	        		if($ocScrollDelegate.getAvailable()){	        	
		        		if(isScrolledIntoView(target)){	        			
		        			$ocScrollDelegate.setAvailable(false)
		        			if(scope.ocInfiniteScroll) scope.ocInfiniteScroll();
		        		}        			
	        		}
	        	}
        	}        	       	

        	scope.$on("$destroy",function(){
        		window.onscroll = null;
        	})
        }     	
    };	
});