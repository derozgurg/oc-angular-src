/**
 * @author Ozgur Cimen on 27-Oct-15.
 *
 *
 * oc-popup Modal POPUP
 */	
ocanMod.factory("$ocPopup",function($rootScope,$timeout,$q,$compile,$templateRequest,$controller,$window){
	
	var OcPopup = function(options){
		var deffered = $q.defer();
		var _p = this;

		var posx = 0;
		var posy = 0;

		var swMargin = oc.getScrollBarWidth();

		_p.close = function(val){
			$("body").removeClass("modal-open");
//			$("body").css("margin-right","0");

			$(document).off("mousedown",onmouseActive);
			$(backDrop).remove();
			deffered.resolve(val);
		}

		if(options.event){
			var $event = options.event;
			posx = $event.pageX;// - $event.offsetX;
			posy = $event.pageY;// - $event.offsetY;
		} 

		var _st1,_st2, popup ;
		var modalScope = null;
		var ctrlLocals = {};

		if(options.resolve){
			for(fn in options.resolve)
				ctrlLocals[fn] = options.resolve[fn].apply();
		}

		ctrlLocals["$ocPopupInstance"] = {
			close:_p.close
		};	

		if(options.controller){
			modalScope = $rootScope.$new();
			ctrlLocals.$scope = modalScope;
			var ctrlInstance = $controller(options.controller, ctrlLocals);			
		}

		var windowClass = options.windowClass || '';
	
		if(options.minWidth && !options.minHeight)
			_st1 = "style='min-width:"+options.minWidth+"px;'";		
		if(!options.minWidth && options.minHeight)
			_st1 = "style='min-height:"+options.minHeight+"px;'";		
		if(options.minWidth && options.minHeight)
			_st1 = "style='min-width:"+options.minWidth+"px; min-height:"+options.minHeight+"px'";
		if(_st1)
			popup= angular.element("<div "+_st1+" class='"+windowClass+" oc-free-com oc-popup-content'></div>");	
		else
			popup= angular.element("<div class='"+windowClass+" oc-free-com oc-popup-content'></div>");	
	
		var backDrop  = null;
		if(options.blackBack)
			backDrop= angular.element("<div class='oc-full-component black-shadow'></div>");
		else
			backDrop= angular.element("<div class='oc-full-component'></div>");

		backDrop.append(popup);

	//	$("body").css("margin-right",swMargin+"px");
		
		$("body").addClass("modal-open");
		$("body").append(backDrop);	

		if(options.templateUrl && options.templateUrl.length > 0){
			$templateRequest(options.templateUrl).then(function(resp){
				popup.html(resp);

				if(modalScope){
					$compile(popup)(modalScope);		
				}
				else if(options.scope){
					$compile(popup)(options.scope);					
				}

				$timeout(function(){
					$(popup).ready(function(){
						
						console.log("popupwith",popup.width());

						if(posx + popup.width() + 50 > $window.innerWidth)				
							posx = posx - popup.width();	

						if(posy + popup.height() + 50 > $window.innerHeight)				
							posy = posy - popup.height();				

						posy = (posy < 0 ) ? 0 : posy;

						$(popup).css("top",posy+"px");
						$(popup).css("left",posx+"px");	
						
						$(popup).addClass("oc-fade-in");
						$(document).on("mousedown",onmouseActive);				
					})
				},100);	

			},function(err){
				console.error("Template cannot load",err);
			});
		}		

		function onmouseActive(event){	
			if($(backDrop).find(event.target).length == 0 ) _p.close();
		}		
		var pro = deffered.promise;

		pro.close = _p.close;

		return pro;
	}

	return {
		show:function(options){
			return new OcPopup(options)
		}
	}
});