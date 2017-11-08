/**
 * @author Ozgur Cimen on 27-Oct-15.
 */	
ocanMod.service("$ocFullCalendarDelegate",function($q,$timeout){
	var delegates = [];

	function CalendarDelagete(id){
		var calendar = delegates[id];
		var _p = this;

		_p.addEvents = function(events){
			if(!events || events.length <= 0 ) return;			

			calendar.fullCalendar( 'addEventSource',{
				events: events
			});

			calendar.fullCalendar( 'rerenderEvents');			
		}
		_p.removeEvents =function(events){
			calendar.fullCalendar( 'removeEventSource',events );			

		}

		_p.changeView = function(viewName){
			calendar.fullCalendar( 'changeView', viewName );
		}	

		_p.getView = function(){
			return calendar.fullCalendar( 'getView' );
		}

		_p.gotoDate = function(date){
			calendar.fullCalendar( 'gotoDate', date );
		}

		_p.getEvents = function(){
			return calendar.fullCalendar( 'clientEvents');
		}
	}

	this._push = function(id,com){
		delegates[id] = com;		
	};

	this._remove = function(id){
		if(delegates[id]) delegates[id] = null;
		delete delegates[id];
	}

	this.getDelegate = function(id){
		var deffered = $q.defer();
        $(document).ready(function() { 	
			$timeout(function(){
				if (delegates[id] != null)
					deffered.resolve(new CalendarDelagete(id));
				else 
					deffered.reject("calendar could not be found "+id);
			},200);
		});
		return deffered.promise;
	}	
});