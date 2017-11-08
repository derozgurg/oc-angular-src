/**
 * @author Ozgur Cimen on 18-Dec-15.
 */
ocanMod.service("$ocMapDelegate",function($timeout,$compile){
	var maps = [];

	function MapDelagete(id){
		var _p = this;
		var markerClusterEnabled =false;
		var typedCluster = [];
		mc = null;

		if(typeof google == "undefined") return;

		var infowindow = new google.maps.InfoWindow();	
		var _bound_callback
		_p.addAreaEvent = function(callback){

			if(maps[id] == null) $timeout(function(){
				if(maps[id] == null) $timeout(_apply,1500);else _apply();
			},1700);else _apply();
			
			function _apply(){
				_bound_callback = callback;
				//google.maps.event.addListener(maps[id], "dragend", boundChanged);
				//google.maps.event.addListener(maps[id], "zoom_changed", boundChanged);
				google.maps.event.addListener(maps[id], "bounds_changed", boundChanged);
				console.log("bound event added");	
			}
		}

		_p.setCenter = function(pos){
			if(maps[id] == null) $timeout(function(){
				if(maps[id] == null) $timeout(_apply,1500);else _apply();
			},1700);else _apply();
			function _apply(){
			
				var lat,lng;

				if(pos.lat && pos.lng) {
					console.warn("Use $ocMapDelegate.setCenter({latitude,longitude}) instead of {lat,lng} is deprecieted")
					lat = pos.lat;
					lng = pos.lng;
				}
				else if(pos.latitude && pos.longitude){
					lat = pos.latitude;
					lng = pos.longitude;
				}

				maps[id].setCenter(new google.maps.LatLng(lat,lng));				
			}
		}

		_p.isInMapArea = function(latitude,longitude){
			var b = maps[id].getBounds()
			
			var start = {x:b.getNorthEast().lat(),y:b.getNorthEast().lng()}
			var end = {x:b.getSouthWest().lat(),y:b.getSouthWest().lng()}	

			if(latitude <= start.x && longitude <= start.y &&
				latitude >= end.x && longitude >= end.y ) return true;
			
			return false;
		}

		_p.setZoom = function(value){
			if(maps[id] != null)
				maps[id].setZoom(value);
		}

		_p.addMarker = function(mark){
			if(maps[id] == null) $timeout(function(){
				if(maps[id] == null) $timeout(_apply,1500);else _apply();
			},1700);else _apply();

			function _apply(){
				if(maps[id] != null ){        	
					var map = maps[id];

					if(map._proData.markers == null )
						map._proData.markers = []; 
					
					if(mark.position){	

						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(mark.position.lat, mark.position.lng),
					 		map: map,
					 		title:mark.title,
					 		data:mark,
					 		icon:mark.icon					
					  	});

	    				map._proData.markers.push(marker);	
	    				
	    				if(mark.type && markerClusterEnabled)	
		    				if(typedCluster[mark.type]) typedCluster[mark.type].addMarker(marker);	
	    									  	
					  	google.maps.event.addListener(marker, 'click', function(event) {						  		
					  		if(map._proData.onclickMarker)
					  			return map._proData.onclickMarker({marker:this});

					  		if(infowindow) infowindow.close();
					  		
					  		if(this.data.infoContent){
								infowindow.setContent(this.data.infoContent);
						        infowindow.open(map, this);						  			
					  		}					  		
					  		else if(this.data.title){
								infowindow.setContent('<div><strong>' + this.data.title + '</strong><br>');						          
						        infowindow.open(map, this);						  			
					  		}
						});							
					}	
				}				
			} 				
		}

		_p.setMarkers = function(markers,clear){		

			if(maps[id] == null) $timeout(function(){
				if(maps[id] == null) $timeout(_apply,1500);else _apply();
			},1700);else _apply();
		
			function _apply(){
				if(maps[id] != null && markers!=null){        	
					var map = maps[id];

					if(clear)
						_p.clearMarkers() ;					

					var tmpMarkers = null;

					if(map._proData.markers == null ){
						map._proData.markers = []; 
					} 
					else tmpMarkers = [];

					for(var i = 0 ; i < markers.length;i++){
						var mark = markers[i];
						if(mark.position){	

							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(mark.position.lat, mark.position.lng),
						 		map: map,
						 		title:mark.title,
						 		data:mark,
						 		icon:mark.icon					
						  	});

		    				map._proData.markers.push(marker);	

		    				if(mark.type && markerClusterEnabled)					
		    					if(typedCluster[mark.type])typedCluster[mark.type].addMarker(marker);		    						    				

		    				if(tmpMarkers) tmpMarkers.push(marker);
						  	
						  	google.maps.event.addListener(marker, 'click', function(event) {						  		
						  		if(map._proData.onclickMarker)
						  			return map._proData.onclickMarker({marker:this});

						  		if(infowindow) infowindow.close();
						  		
						  		if(this.data.infoContent){
									infowindow.setContent(this.data.infoContent);
							        infowindow.open(map, this);						  			
						  		}
						  		
						  		else if(this.data.title){
									infowindow.setContent('<div><strong>' + this.data.title + '</strong><br>');						          
							        infowindow.open(map, this);						  			
						  		}
							});							
						}
					}

					tmpMarkers = null;
					
				} else console.warn("map not found",id);
			}
		}

		function boundChanged(){
			if(_bound_callback) _bound_callback(maps[id].getBounds());    	    		
    	}


		_p.getMap = function(){
			if(maps[id] == null) return console.warn("map not found",id);
			return maps[id];
		}

		_p.enableMarkerCluster = function(type){
			if(maps[id] == null) return console.warn("map not found",id);
			var _map =  maps[id];	
			var mcOptions = {gridSize: 28, maxZoom: 16, imagePath: 'assets/img/m'};			
			mcOptions.zoomOnClick =false;

			typedCluster[type] =  new MarkerClusterer(_map, [], mcOptions);

			for(var i = 0; i< _map._proData.markers.length;i++){
				var marker = _map._proData.markers[i];
				if(marker.data && marker.data.type && marker.data.type == type)					
					typedCluster[type].addMarker(marker);				
			}
			
			markerClusterEnabled = true;			
		}

		_p.getAllClusters = function(){
			if(maps[id] == null) return console.warn("map not found",id);
			if(!mc) return;

			return mc.clusters_;
		}

		_p.addClusterEvent = function(type,eventName,callback){
			if(maps[id] == null) return console.warn("map not found",id);
			
			if(typedCluster[type])
				google.maps.event.addListener(typedCluster[type],eventName,callback);
		}
		
		_p.removeClusterEvent = function(eventName,callback){
			if(maps[id] == null) return console.warn("map not found",id);
			if(!mc) return;
			google.maps.event.removeListener(mc,eventName,callback);
		}

		_p.getMarkers = function(){
			if(maps[id] == null) return console.warn("map not found",id);
			var _map =  maps[id];

			if (_map._proData.markers) return _map._proData.markers; 
			return null;
		}

		_p.openInfoWindow = function(marker,content){
			if(maps[id] == null) return console.warn("map not found",id);
			var _map =  maps[id];
			if(infowindow) infowindow.close();
			infowindow.setContent(content );						          
			infowindow.open(_map, marker);
			return function(id,s){
				if(id&&s) $compile($("#"+id)[0])(s);
				return infowindow				
			}
		}

		_p.clearByType = function(type){
			if(maps[id] == null) return console.warn("map not found",id);
			var _map =  maps[id];
		

			if(_map._proData.markers){			

				var k = _map._proData.markers.length;
				var a = 0 ; 
				
				if(typedCluster[type]) typedCluster[type].clearMarkers();

				while(k--){				
					if(_map._proData.markers[k].data && _map._proData.markers[k].data.type && _map._proData.markers[k].data.type == type){						
						//if(mc) mc.removeMarker(_map._proData.markers[k]);
						_map._proData.markers[k].setMap(null);
						_map._proData.markers[k] = null;				
						_map._proData.markers.splice(k,1);
						k = _map._proData.markers.length;
					}					
				}
			}	
		}


		_p.clearMarkers = function(){
			if(maps[id] == null) return console.warn("map not found",id);
			var _map =  maps[id];

			for(var i = 0 ;i <  typedCluster.length ; i++){				
				typedCluster[i].clearMarkers();
				typedCluster[i] = null;
			}

			if(_map._proData.markers){			
				for(var i = 0 ; i < _map._proData.markers.length;i++ )
					_map._proData.markers[i].setMap(null);			
				_map._proData.markers = null;
				_map._proData.markers = [];
			}			

			if(_map._proData.singleMarker)	
				_map._proData.singleMarker.setMap(null);
			_map._proData.singleMarker = null;
		}
	}



	this.pushMap = function(id,map){
		maps[id] = map;		
	};

	this.removeMap = function(id){
		if(maps[id]) maps[id] = null;
		delete maps[id];
	}

	this.getMapDelegate = function(id){
		return new MapDelagete(id);
	}	
})