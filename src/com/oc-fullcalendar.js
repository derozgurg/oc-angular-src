/**
 * @author Ozgur Cimen on 27-Oct-15.
 *
 * oc-infinite-scroll v.0
 */	
ocanMod.directive("ocFullcalendar",function ($timeout,$ocFullCalendarDelegate) {
	return { 
	  	author:{
	  		name:"Özgür Çimen 2014",
	  		mail:"derozgur@gmail.com",
	  		web:"cimenozgur.com",	  		
	  	},
        restrict:"A",
        scope:{calendarId:"@ocFullcalendar",calenderOptions:"="},
        link:function(scope, element, attrs, ctrl) { 

            $(document).ready(function() { 	
        		var calendar = $(element).fullCalendar(scope.calenderOptions);

                if(scope.calendarId){                
                    $ocFullCalendarDelegate._push(scope.calendarId,calendar);                
                }
        		
				//console.log(calendar.fullCalendar( 'getResources' ))
			/*	$timeout(function(){
	        		calendar.fullCalendar( 'removeEvents' ,1);
	        		//calendar.fullCalendar( 'rerenderEvents' )
				},600);*/
        	});
        }     	
    };	
});