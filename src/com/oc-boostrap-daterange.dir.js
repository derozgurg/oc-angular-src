
ocanMod.directive("ocBoostrapDatetimepicker",function () {
	return { 
	  	author:{
	  		name:"Özgür Çimen 2014",
	  		mail:"derozgur@gmail.com",
	  		web:"cimenozgur.com",	  		
	  	},
        restrict:"A",        
        link:function(scope, element, attrs, ctrl) {        		
			element.datetimepicker();
        }     	
    };		
});

ocanMod.directive("ocBoostrapDaterangePicker",function ($ocDateRangeDelegate) {
	return { 
	  	author:{
	  		name:"Özgür Çimen 2014",
	  		mail:"derozgur@gmail.com",
	  		web:"cimenozgur.com",	  		
	  	},
        restrict:"A",        
        scope:{onApply:"&",options:"=",onClear:"&",id:"@ocBoostrapDaterangePicker"},
        link:function(scope, element, attrs, ctrl) {        

			var dateRange = $(element);

			if(typeof scope.options =="object") dateRange.daterangepicker(scope.options);
			else{				
				dateRange.daterangepicker();
			}

		    dateRange.on('apply.daterangepicker', function(ev, picker) {			      				
	      		if(!scope.options.singleDatePicker){
	      			scope.model = {start:picker.startDate._d,end:picker.endDate._d};
		  			if(scope.onApply) scope.onApply({dateRange:{start:picker.startDate._d,end:picker.endDate._d}});				  			  	      	
	      		}
		  		else{
		  			scope.model = picker.startDate._d;
		  			if(scope.onApply) scope.onApply({date:picker.startDate._d});				  			  	      	
		  		}			  			
			  
		      	scope.$apply()
			});		

			dateRange.on('cancel.daterangepicker', function(ev, picker) {	
				if(scope.onClear) scope.onClear();
			});
		
			if(scope.id)
				$ocDateRangeDelegate.set(scope.id,dateRange);

			scope.$on('$destroy', function() {		        		        
				if(scope.id)
					$ocDateRangeDelegate.remove(scope.id);
			});	
        }     	        
    };		
});