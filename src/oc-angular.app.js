// /((0090)|(\+90))([ ]?)(5[\d ]{2})([ ]?)([\d ]{3})([ ]?)([\d ]{2})([ ]?)([\d ]{2})/g
window.oc = window.oc || {};
var ocanMod = angular.module("oc-angular",[]);

oc.controller = function(target,controller) {
	target.controller(controller.name,controller);
}

oc.appendArray = function(source,target){
    for(var i = 0 ; i < source.length;i++)
        target.push(source[i]);
}

oc.append = function(source,target){       
    console.warn("oc.append is deprecieted use oc.appendArray instead of oc.append");
    oc.appendArray(source,target);
}
oc.emptyArray = function(array){
	var k = array.length;
	while(k--) array.pop();
}

oc.randomRange = function(min,max){
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

oc.trimArray =  function (array,indexs){
        var shl = 0;
        for(var i = 0 ; i < indexs.length; i ++){
            array.splice(parseInt(indexs[i]) - i,1);
        }
    }
oc.getRandomColor = function(){
    var color = new Color('#' + (Math.random().toString(16) + '0000000').slice(2, 8));
   /* color.desaturate(.5);
    color.lighten(.1);*/
    return "#" + ((1 << 24) + (color.rgb().r << 16) + (color.rgb().g << 8) + color.rgb().b).toString(16).slice(1); ;
}

oc.getRandomMetarialColor = function(exception){

    exception = exception || [];
    var color = getColor();

    while(exception.indexOf(color) != -1) color = getColor();

    function getColor(){
        var b = oc.MetarialColorSets[Object.keys(oc.MetarialColorSets)[oc.randomRange(0,Object.keys(oc.MetarialColorSets).length-1)]];
        return  b[oc.randomRange(0,b.length-1)];
    }

    return color;
}

oc.getScrollBarWidth = function() {
  var parent, child, width;

  if(width===undefined) {
    parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
    child=parent.children();
    width=child.innerWidth()-child.height(99).innerWidth();
    parent.remove();
  }

 return width;
};

oc.Svg = function(url){
    var _p = this;
    var _data = null;
    var _svg = null;
    _p.onready = null;

    $.get(url,function(data){
        _svg = data;
        if(_p.onready) _p.onready(_svg);
    });

    _p.fillColor = function(color){
        if(!_svg) return null;
        $(_svg).find("svg").attr("style","fill:"+color+";");
    }

    _p.getSvgData = function(){
        if(!_svg) return null;
        return "data:image/svg+xml;charset=UTF-8;base64," + btoa(new XMLSerializer().serializeToString(_svg));
    }

    _p.getSvg = function(){
        if(!_svg) return null;
        return _svg;
    }

    _p.dispose = function(){
        _svg = null;        
    }
}

oc.generateGUID = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


 oc.ImageComposite = function(width,height){
    /**
    *  author Ozgur Cimen cimenozgur.com 
    **/
    var _p = this;
    var _currentProgress = 0 ; 
    var _totalProgress = 0 ; 
    var _resultCallBack = null;

    var _totalLayer = 0;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext("2d");

    function reset(){
        _resultCallBack = null;
        _totalProgress = 0 ; 
        _currentProgress = 0 ; 
    }

    _p.destroy = function(){
        context = null;
        convas = null;

    }
    
    _p.createLayer = function(image,callback){

        var loader = new Image();
         _totalProgress ++ ; 
        
        loader.onload = function(){                  
            
            if(callback) callback({x:0,y:0,width:this.width,height:this.height,image:this});
            
            if(++_currentProgress >= _totalProgress){
                _totalProgress = 0 ; 
                _currentProgress = 0 ; 
                if(_resultCallBack){
                    _p.getBase64(_resultCallBack);
                    reset();
                } 
            }  
        }    

        loader.src = image;
    }

    _p.addLayer = function(layer,x,y){         
        context.drawImage(layer.image,x,y)   
    }

    _p.addSrcLayer = function(image,x,y,callback){
        _totalProgress ++;

        var loader = new Image();
        loader.onload = function(){   
            if(_totalLayer++  == 0){
                if(width == null)
                    canvas.width = this.width;                    
                if(height == null)
                    canvas.height = this.height;
            }
          
            context.drawImage(this,x,y)
            if(callback) callback({x:x,y:y,width:this.width,height:this.height,image:this});
            
            if(++_currentProgress >= _totalProgress){
                _totalProgress = 0 ; 
                _currentProgress = 0 ; 
                if(_resultCallBack){
                    _p.getBase64(_resultCallBack);
                    reset();
                } 
            }              
        }

        loader.src = image;
    }

    _p.getBase64 = function(callback){
        if(_currentProgress < _totalProgress) {
            _resultCallBack = callback;
            return null;
        }
        else if(callback){
            reset();
            callback(canvas.toDataURL("image/png"));
        } 
    }
}

/*
(function (oc){
    "use strict";
    const ImageComposite = function(width,height){
        var _p = this;
        var _currentProgress = 0 ; 
        var _totalProgress = 0 ; 
        var _resultCallBack = null;

        var _totalLayer = 0;

        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext("2d");

        function reset(){
            _resultCallBack = null;
            _totalProgress = 0 ; 
            _currentProgress = 0 ; 
        }
        
        _p.createLayer = function(image,callback){

            var loader = new Image();
             _totalProgress ++ ; 
            
            loader.onload = function(){                  
                
                if(callback) callback({x:0,y:0,width:this.width,height:this.height,image:this});
                
                if(++_currentProgress >= _totalProgress){
                    _totalProgress = 0 ; 
                    _currentProgress = 0 ; 
                    if(_resultCallBack){
                        _p.getBase64(_resultCallBack);
                        reset();
                    } 
                }  
            }    

            loader.src = image;
        }

        _p.addLayer = function(layer,x,y){         
            context.drawImage(layer.image,x,y)   
        }

        _p.addSrcLayer = function(image,x,y,callback){
            _totalProgress ++;

            var loader = new Image();
            loader.onload = function(){   
                if(_totalLayer++  == 0){
                    if(width == null)
                        canvas.width = this.width;                    
                    if(height == null)
                        canvas.height = this.height;
                }
              
                context.drawImage(this,x,y)
                if(callback) callback({x:x,y:y,width:this.width,height:this.height,image:this});
                
                if(++_currentProgress >= _totalProgress){
                    _totalProgress = 0 ; 
                    _currentProgress = 0 ; 
                    if(_resultCallBack){
                        _p.getBase64(_resultCallBack);
                        reset();
                    } 
                }              
            }

            loader.src = image;
        }

        _p.getBase64 = function(callback){
            if(_currentProgress < _totalProgress) {
                _resultCallBack = callback;
                return null;
            }
            else if(callback){
                reset();
                callback(canvas.toDataURL("image/png"));
            } 
        }
    }

    oc.ImageComposite = ImageComposite;
}(window.oc)); */

