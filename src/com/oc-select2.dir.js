/**
 * @author Ozgur Cimen on 27-Oct-15.
 *
 * oc-select 2 v.0
 */	
ocanMod.directive("ocSelect2",function ($timeout) {
	return { 	  
        restrict:"A",
        scope:{ocSelect2:"&",model:"=ngModel"},
        link:function(scope, element, attrs, ctrl) {     
        	$(element).select2();
        	$timeout(function(){
        		$(element).select2().val(scope.model);               		
        	},200);        	  	       
        }     	
    };	
});