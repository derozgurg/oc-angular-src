
ocanMod.directive("ocGmapPositionSelector",function ($timeout,$ocMapDelegate) {
	return { 
	  	restrict:"A",       
	  	scope:{mapId:"@ocGmapPositionSelector",onselect:"&", centerPos:"=",options:"=",model:"=ngModel",addMode:"=",onclickMarker:"&"},
        link:function(scope, element, attrs, ctrl) {     
      		var options = scope.options || {};
        	var map = null;
  		
        	if(typeof google == "undefined") return;

        	$timeout(function(){
        		if(scope.centerPos){					
					var center = new google.maps.LatLng(scope.centerPos.lat,scope.centerPos.lng);
					var zoom = 14;
				}
				else{					
					var center ={lat: 39.2601934, lng: 35.431615};
					var zoom = 10 ;
				}			

				map = new google.maps.Map(element.context, {
				    center:center,
				    zoom: zoom,
				    mapTypeId: google.maps.MapTypeId.ROADMAP
				 });

				 if (navigator.geolocation && scope.centerPos == null) {
					navigator.geolocation.getCurrentPosition(function (position) {
						initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);			       
						map.setCenter(initialLocation);
					});
				}

				map.addListener('click', function(e) {						
					if(scope.addMode){					
				    	if(map._proData.markers)
							for(var i = 0 ; i < map._proData.markers.length;i++ ) map._proData.markers[i].setMap(null);							    		
						
						placeMarkerAndPanTo(e.latLng, map);				    	
					}
				});						

				google.maps.event.trigger(map, "resize");
				map._proData = {};

				if(scope.mapId){				
					if(scope.onclickMarker)
						map._proData.onclickMarker = scope.onclickMarker;

					$ocMapDelegate.pushMap(scope.mapId,map);				
				}


				if(!scope.options.searchDisable)
					initAutocomplete();
        	},300);        

			function placeMarkerAndPanTo(latLng, map) {
			 	if(scope.options.singlePointMode){		 		
			 		
			 		if(map._proData.singleMarker) map._proData.singleMarker.setMap(null);

		 			map._proData.singleMarker = new google.maps.Marker({
						position: latLng,
				 		map: map
				  	});		  	

		 			if(scope.onselect) scope.onselect({position: {
				  		latitude:latLng.lat(),
				  		longitude:latLng.lng()
				  	}});
				  	/*scope.model = scope.model || {};
				  	scope.model.coords = {
				  		latitude:latLng.lat(),
				  		longitude:latLng.lng()
				  	},*/

				  	scope.$apply();
			 	}			  
			}

			scope.$on('$destroy', function() {
		        $(element).remove();
		        map = null;
				if(scope.mapId)
					$ocMapDelegate.removeMap(scope.mapId);

			//	google.maps.event.removeListener(map, "bounds_changed", boundChanged);
			});

			function initAutocomplete() {
				
				var ainput = angular.element('<input id="pac-input" class="controls" type="text" placeholder="Ara">');
				$(element).parent().append(ainput);
				
				var input = ainput[0];

				var searchBox = new google.maps.places.SearchBox(input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
			
				map.addListener('bounds_changed', function() {
				    searchBox.setBounds(map.getBounds());
				});
				
				searchBox.addListener('places_changed', function() {
					var places = searchBox.getPlaces();

					if (places.length == 0) return;

					var bounds = new google.maps.LatLngBounds();
					
					places.forEach(function(place) {
						var icon = {
							url: place.icon,
							size: new google.maps.Size(71, 71),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(17, 34),
							scaledSize: new google.maps.Size(25, 25)
						};				
					
						if (place.geometry.viewport) {
						
							bounds.union(place.geometry.viewport);
						} else {
							bounds.extend(place.geometry.location);
						}
					});
				    map.fitBounds(bounds);
				}); 
			}
        }     	
    };		
});

