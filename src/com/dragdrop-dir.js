/**
 * author Özgür Çimen on 29.09.2015.
 DRAG AND DROP 
 */

 var octemp = octemp || {};

ocanMod.directive("ocDraggeble",function () {
	return {
		restrict:"A",
		scope:{dragData:"=",ocDraggeble:"=",ocStartdrag:"&",ocDragover:"&",ocDropover:"&"},
		
		link:function(scope,element){	
			
			element.attr("draggable", scope.ocDraggeble);  			
			scope.$watch("ocDraggeble",function (value){			
				element.attr("draggable", value);			
			});

			element[0].addEventListener("dragstart", function(e) {          	 
				octemp.dragStartedElement = element;
        		if(scope.dragData){        			
        			octemp.dragStartedData = scope.dragData;
					e.dataTransfer.setData("transfer_data",JSON.stringify(scope.dragData));	
        		}
        		else octemp.dragStartedData = null;
				if(scope.ocStartdrag) scope.ocStartdrag({event:e});
			},false); 

			if(scope.ocDragover){
				element[0].addEventListener('dragover', function(e){								
					var event = {e:e};
					if(octemp.dragStartedData)  event.dragData = octemp.dragStartedData;
					if(octemp.dragStartedElement) event.dragElement = octemp.dragStartedElement;
					scope.onDragover({event:event});
					
					if (e.preventDefault) e.preventDefault(); 			
					
				}, false);				
			}

			if(scope.ocDropover){

				if(!scope.ocDragover){
					element[0].addEventListener('dragover', function(e){
						if (e.preventDefault) e.preventDefault();
					}, false);			
				}

				element[0].addEventListener('drop', function(e){					
					if(scope.onDropOver){					
						
						var event = {e:e};
						if(octemp.dragStartedData)  event.dragData = octemp.dragStartedData;
						if(octemp.dragStartedElement) event.dragElement = octemp.dragStartedElement;
						scope.onDropOver({event:event});
					}
					if (e.preventDefault) e.preventDefault(); 	
				}, false);
			}
		}
	}
});

ocanMod.directive("ocDragDrop",function () {
	  return { 
	  	author:{
	  		name:"Özgür Çimen 2014",
	  		mail:"derozgur@gmail.com",
	  		web:"cimenozgur.com",	  		
	  	},
        restrict:"A",
        scope:{onDropOver:"&",ocDragDrop:"=",transferData:"=",onDragEnd:"&",deactiveDrag:"="},
        link:function(scope, element, attrs, ctrl) {   
        	if(!scope.deactiveDrag)
     			element.attr("draggable", "true");    	
     		element.attr("id", new Date().getTime()); 
        	scope.$watch("ocDragDrop",function (value) {element.attr("draggable", value);});
     		///console.log(scope.dropEnable);		
        	dragel = element[0];   
        	var opa = element.css("opacity");
        	
        	dragel.addEventListener("dragstart", function(e) {   

        		console.log("drag start")     				
				e.dataTransfer.setData("sourceId",element.attr("id"));
				e.dataTransfer.setData("transfer_data",JSON.stringify(scope.transferData));   
				element.css("opacity",".3");
			},false); 

			dragel.addEventListener("dragend",function(e){
				element.css("opacity",opa);
				if(scope.onDragEnd) scope.onDragEnd({event:e});
			},false);

			dragel.addEventListener('dragover', function(e){	
				if (e.preventDefault) e.preventDefault(); 				
				
			}, false);
			
			if(scope.onDropOver){				
				dragel.addEventListener('drop', function(e){
					var sourceId = e.dataTransfer.getData("sourceId") || "";
					var transferedData = e.dataTransfer.getData("transfer_data");
					transferedData = (transferedData != "undefined" && transferedData!= "") ? JSON.parse(transferedData) : "";
					var sourceElement = $("#"+sourceId)[0];
					var target;

					if(typeof $(e.target).attr("oc-drag-drop") == "undefined")
						target = e.target.parentElement;			
					else
						target = e.target;

					
					scope.onDropOver({event:{data:transferedData,sourceElement:sourceElement,target:target}});
				}, false);
			}
        }
    };
});
