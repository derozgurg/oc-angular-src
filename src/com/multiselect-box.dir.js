/**
 * @author Ozgur Cimen on 27-Oct-15.
 *
 * usage attributes
 *	 data-source =  [
 * 		{id:"101", title:"Kategory",type:"divider",css:"item-red-box"},
 *    	{id:"1",title: "osman",css:"item-red-box"}
 *	 ng-model = []
 */	
ocanMod.directive("ocMultiSelectBox",function () {	 
	var tpl ='<div style="position:relative">'+
                '<div class="receiver-holder {{formControlCSS}}" >'+
                    '<div ng-click="onclickItem({item:item});console.log(\'hoop\')" ng-repeat="item in model" class="oc-none-select receiver-item btn-sm {{(item.css) ? item.css :\'\'}} btn-addon">'+
                        '<i ng-click="onClickRemove($index)" class="fa fa-times pull-right"></i>{{item.title}}'+
                    '</div>'+
                    '<input ng-readonly="readonly" style=" outline: none;" type="text" ng-model="searchText" placeholder="{{(model.length > 0 ) ? \'\' : ph}}">'+                 
                '</div>'+                
	            '<ul class="oc-auto-list">'+
	            	'<li ng-click="selectStaticItem($index)" ng-repeat="item in staticList" class="select-item static-item" data-index="{{$index}}">'+
	            		'<i ng-if="item.icon" class="fa {{item.icon}} fa-fw text-muted"></i>'+
	            		'&nbsp;{{item.title}}'+
	            	'</li>'+
	            	'<li ng-click="selectItem(item)" ng-repeat="item in sourceData |filter:searchText | exclude:model" class="{{(item.type==\'divider\') ? \'divider\' : \'select-item\'}}" data-item="{{item}}">'+
	            		'{{item.title}}'+
	            	'</li>'+
	            '</ul>'+                
            '</div>';	
     	
	return {
		author:{
	  		name:"Özgür Çimen 2014",
	  		mail:"derozgur@gmail.com",
	  		web:"cimenozgur.com",	  		
	  	},
		restrict:"E",	
		link:function(scope, element, attrs, ctrl){		

			if(typeof scope.border == "undefined" )
				scope.formControlCSS = "form-control";
			else scope.formControlCSS = "";

			if(typeof scope.model == "undefined") scope.model = [];
			if(scope.model == null) scope.model= [];

			var input = $(element).find("input").first();
			var list = $(element).find(".oc-auto-list");
			scope.searchText = "";
			list.hide();
			scope.listElement = list;
			scope.input = input;			

			scope.selectItem = function(item){		
				if(item.type == "divider") return;
				scope.model[scope.model.length] = item;		
				scope.searchText = "";
				scope.listElement.hide();			
				scope.input.focus();	
				if(scope.onChanged) scope.onChanged()		
			}		

			scope.onClickRemove = function(index){
				if(scope.readonly) return;
				scope.model.splice(index,1);
				if(scope.onChanged) scope.onChanged()
				scope.listElement.hide();					
			}	

			scope.selectStaticItem = function(index){
				if(scope.readonly) return;
				scope.searchText = "";
				scope.listElement.hide();			
				scope.input.focus();	
				if(scope.onSelectStaticItem)
					scope.onSelectStaticItem({index:index})
			}

			input[0].onkeydown = function(event) {			
				if(scope.readonly) return;
				scope.showList();
			    var key = event.keyCode || event.charCode;
			    
			    if(key == 40){
			    	if(list.is(":visible")){
			    		var items = list.find(".select-item")
			    		var found = false;
			    		items.each(function(index){
			    			if($(this).hasClass("selected")){	
			    				found = true;								
								if(index < items.length-1){
									$(this).removeClass("selected");								
									$(items[index+1]).addClass("selected");
									
									var offsettop = (list[0].scrollHeight / (items.length  *40)) *  (index*40);
									console.log(offsettop)

									list[0].scrollTop = offsettop;
									//console.log(list[0].scrollTop)
								} 								
								return false									
			    			}										    			
						});

						if(!found){
							$(items[0]).addClass("selected");		
							list[0].scrollTop = 0 ;
						}			
			    	}

			    	event.preventDefault();
			    	return false;
			    }

			    if(key == 38){
			    	if(list.is(":visible")){
			    		var items = list.find(".select-item")
			    		var found = false;
			    		items.each(function(index){
			    			if($(this).hasClass("selected")){	
			    				found = true;	
								if(0 < index){
									$(this).removeClass("selected");							
									$(items[index+-1]).addClass("selected");								
									var offsettop = (list[0].scrollHeight / (items.length  *40)) *  ((index-1)*40);	
									list[0].scrollTop = offsettop;
								} 	
								return !found;							
			    			}										    			
						});
			    	}

					event.preventDefault();
			    	return false;
			    }

			    if( key == 8 || key == 46 )	{			    
			    	scope.$apply(function(){
			    		//console.log(scope.searchText.length)
			    		if(scope.model.length > 0 ){	    				    			
			    			if(scope.searchText.length == 0 ){
			    				list.hide();
			    				scope.model.splice(scope.model.length-1,1);

			    				if(scope.onChanged) scope.onChanged()
			    			}
			    		}
			    		else{
			    			scope.model = [];
			    		}
			    	});
			    }			

			    if(key == 13){
			    	if(list.is(":visible")){
			    		var items = list.find(".select-item.selected").first();

						if($(items[0]).hasClass("divider")) return;

			    		if(items.length> 0 ){
			    			if($(items[0]).hasClass("static-item")){
			    				var indeX=$(items[0]).data("index");			    			
			    				scope.selectStaticItem(indeX);
			    			}
			    			else{
			    				scope.$apply(function(){

			    					var itemData= $(items[0]).data("item");

			    					if(itemData.type == "divider") return;

			    					var ix = scope.sourceData.map(function(x){return x.id}).indexOf(itemData.id);

			    					if(ix < 0 ) return;

			    					scope.model[scope.model.length] = scope.sourceData[ix];
									scope.searchText = "";
									scope.listElement.hide();			
									scope.input.focus();			    					
									if(scope.onChanged) scope.onChanged()		
			    					//scope.selectItem($(items[0]).data("item"));			    						    					
			    				});
			    			}
			    		}
			    	}

					event.preventDefault();
			    	return false;
			    }
			};

			input[0].onclick = function(){		
				if(scope.readonly) return;		
				scope.showList();
			}

			function onInputBlur(){	
				list.hide();
				input[0].onblur  = null;
			}		

			input[0].onblur = onInputBlur;

			input[0].onmouseover = function(){
				input[0].onblur = onInputBlur;
			}
			
			list[0].onmouseover = function(event){
				input[0].onblur = null;
				if(event.target){
					if(event.target.nodeName =="LI" || event.target.nodeName == "li"){
						if(!$(event.target).hasClass("selected")){							
							list.find(".select-item").each(function(index){							
								$(this).removeClass("selected");
							});
							$(event.target).addClass("selected");
						}
					}
				}
			}

			list[0].onmouseout = function(){				
				input[0].onblur = onInputBlur;
			}

			scope.showList = function(){
				list.show();
				input[0].onblur = onInputBlur;
			}
		},
		scope:{ph:"@placeholder",model:"=ngModel",sourceData:"=",staticList:"=",onclickItem:"&",onSelectStaticItem:"&onselectStaticitem",border:"=",onChanged:"&",readonly:"="},
		template:tpl					
	}
});



