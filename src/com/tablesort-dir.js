/**
 * author Özgür Çimen on 29.09.2015.
 */
ocanMod.directive("ocTableSortable",function(){
    return {        
        restrict:"A",
        scope:{ocTableSortable:"=",sortField:"@"},
        link:function(scope, element, attrs, ctrl) {   
            var target =angular.element(element);
           

            target.addClass("oc-sortable");
            $(element).find(".footable-sort-indicator").addClass("fa");
            
            resetHeaders();
            target.click(function(){
                if(target.hasClass("footable-sorted")){
                    resetHeaders();
                    target.addClass("footable-sorted-desc");
                    target.removeClass("footable-sorted");

                    var indacator = $(element).find(".footable-sort-indicator").first();

                    if(indacator){
                        indacator.removeClass("fa-sort");
                        indacator.addClass("fa-caret-down");                 
                    } 
                 
                    scope.ocTableSortable = scope.sortField;
                    scope.$apply();
                   // scope.ocTableSortable({asc:true});
                }
                else{
                    resetHeaders();
                    target.removeClass("footable-sorted-desc");
                    target.addClass("footable-sorted");
                    var indacator = $(element).find(".footable-sort-indicator").first();

                    if(indacator){
                         indacator.removeClass("fa-sort");
                        indacator.addClass("fa-caret-up");                   
                    }

                    scope.ocTableSortable = "-"+scope.sortField;
                    scope.$apply();
                   // scope.ocTableSortable({asc:false});
                }
            });

            function resetHeaders(){
              
                target.parent().find(".oc-sortable").removeClass("footable-sorted-desc footable-sorted");
                var indacator = target.parent().find(".oc-sortable").find(".footable-sort-indicator");
              
                if(indacator){
                    indacator.removeClass("fa-caret-up");
                    indacator.removeClass("fa-caret-down");
                    indacator.addClass("fa-sort");
                }
            }
        }
    };
});