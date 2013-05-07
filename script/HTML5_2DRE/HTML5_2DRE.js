// HTML5 Rendering Engine 
// authors: Ylon Schaeffer, Thomas van der Berg
// @source: https://github.com/tmsbrg/fries-heimeiden/tree/engine/script/HTML5_2DRE
// @license: http://eraclesoftware.com/legal/
function includeJS(e){var t=document.createElement("script");t.setAttribute("src",e);t.setAttribute("type","text/javascript");document.getElementsByTagName("head")[0].appendChild(t)}function HTML5_2DRE_start(){loaded=View.init()&&Model.init()&&Controller.init();if(loaded){HTML5_2DRE_initialize();HTML5_2DRE_gameLoop()}else{console.log("Error: One or more of MVC main objects could be initialized.")}}function HTML5_2DRE_gameLoop(){prevTime=curTime;curTime=Date.now();if(deltaTime===-1)deltaTime=1/View.fps;else deltaTime=(curTime-prevTime)/1e3;Controller.base_update();View.base_draw();setTimeout(function(){HTML5_2DRE_gameLoop()},View.fpsinterval)}function HTML5_2DRE_initialize(){if(initialize)initialize()}var prevTime=0;var curTime=0;var deltaTime=-1;var IE=document.all?true:false;if(!IE)document.captureEvents(Event.MOUSEMOVE);Object.prototype.clone=function(){var e=this instanceof Array?[]:{};for(var t in this){if(t=="clone")continue;if(this[t]&&typeof this[t]=="object")e[t]=this[t].cloneNode?this[t].cloneNode():this[t].clone();else e[t]=this[t]}if(e&&e.onCloneInit)e.onCloneInit();return e};Object.prototype.extend=function(e){for(var t in e)this[t]=e[t]};Date.prototype.clone=function(){var e=new Date;e.setTime(this.getTime());return e};Number.prototype.clone=Boolean.prototype.clone=String.prototype.clone=function(){return this};Number.prototype.formatMoney=function(e,t,n){var r=this,e=isNaN(e=Math.abs(e))?2:e,t=t==undefined?",":t,n=n==undefined?".":n,i=r<0?"-":"",s=parseInt(r=Math.abs(+r||0).toFixed(e))+"",o=(o=s.length)>3?o%3:0;return i+(o?s.substr(0,o)+n:"")+s.substr(o).replace(/(\d{3})(?=\d)/g,"$1"+n)+(e?t+Math.abs(r-s).toFixed(e).slice(2):"")};Array.prototype.insert=function(e,t){if(e>=this.length)this[this.length]=t;else this.splice(e,0,t)};Model={drawableObjects:new Array,init:function(){return true},addDrawable:function(e,t){if(t==null||t==undefined){n=this.drawableObjects.length;t=n>0?this.drawableObjects[n-1].depth+1:0}else{var n=0;for(var r=0;r<this.drawableObjects.length;r++)if(t>=this.drawableObjects[r].depth)n=r+1}e.depth=t;this.drawableObjects.insert(n,e);if(e.onDrawInit)e.onDrawInit()},removeDrawable:function(e){for(var t=0;t<this.drawableObjects.length;t++)if(this.drawableObjects[t]==e){delete this.drawableObjects[t];this.drawableObjects.splice(t,1);break}},requestFromServer:function(e,t,n,r){if(r==null)r=false;xmlhttp=new XMLHttpRequest;xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==4&&xmlhttp.status==200){this.oncomplete(xmlhttp.responseText)}};xmlhttp.open(r?"post":"get",e+(r?"":"?"+t),true);xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xmlhttp.oncomplete=n;if(r)xmlhttp.send();else xmlhttp.send(t)}};Model.Drawables=new Array;Model.Drawables.BaseDrawable={name:"Rectangle",position:{x:0,y:0},size:{x:1,y:1},scale:{x:1,y:1},rotation:0,depth:0,color:"#000000",alpha:1,visible:true,active:true,parent:null,drawableObjects:new Array,cursor:"default",onCloneInit:function(){},onDrawInit:function(){},base_draw:function(e){if(!this.visible)return false;this.draw(e);e.translate(-(this.size.x/2),-(this.size.y/2));for(var t=0;t<this.drawableObjects.length;t++)if(this.drawableObjects[t]){e.save();e.translate(this.drawableObjects[t].position.x+this.drawableObjects[t].size.x/2,this.drawableObjects[t].position.y+this.drawableObjects[t].size.y/2);e.rotate(this.drawableObjects[t].rotation);e.globalAlpha = this.drawableObjects[t].alpha;this.drawableObjects[t].base_draw(e);e.restore()}},base_update:function(){if(!this.active)return false;this.update();for(var e=0;e<this.drawableObjects.length;e++)if(this.drawableObjects[e])this.drawableObjects[e].base_update()},draw:function(e){},update:function(){},setParent:function(e){this.parent=e},addDrawable:function(e,t){if(t==null||t==undefined){n=this.drawableObjects.length;t=n>0?this.drawableObjects[n-1].depth+1:0}else{var n=0;for(var r=0;r<this.drawableObjects.length;r++)if(t>=this.drawableObjects[r].depth)n=r+1}e.depth=t;e.setParent(this);this.drawableObjects.insert(n,e);if(e.onDrawInit)e.onDrawInit()},removeDrawable:function(e){for(var t=0;t<this.drawableObjects.length;t++)if(this.drawableObjects[t]==e){delete this.drawableObjects[t];this.drawableObjects.splice(t,1);break}},getobjectatpos:function(e,t){if(!e||!t)return this;e-=this.position.x;t-=this.position.y;if(this.drawableObjects&&this.drawableObjects.length>0)for(var n=this.drawableObjects.length-1;n>=0;n--)if(e>=this.drawableObjects[n].position.x&&e<=this.drawableObjects[n].position.x+this.drawableObjects[n].size.x&&t>=this.drawableObjects[n].position.y&&t<=this.drawableObjects[n].position.y+this.drawableObjects[n].size.y&&this.drawableObjects[n].visible)return this.drawableObjects[n].getobjectatpos(e,t);return this},onclick:function(){},onhover:function(){},onmouseout:function(){},onmousein:function(){}};Model.Drawables.RectangleDrawable=Model.Drawables.BaseDrawable.clone();Model.Drawables.RectangleDrawable.borderColor="#000000";Model.Drawables.RectangleDrawable.borderWidth=0;Model.Drawables.RectangleDrawable.draw=function(e){if(this.borderWidth>0){e.lineWidth=this.borderWidth;e.strokeStyle=this.borderColor;e.strokeRect(-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)}e.fillStyle=this.color;e.fillRect(-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)};Model.Drawables.TextDrawable=Model.Drawables.BaseDrawable.clone();Model.Drawables.TextDrawable.text="";Model.Drawables.TextDrawable.borderColor="#000000";Model.Drawables.TextDrawable.borderWidth=0;Model.Drawables.TextDrawable.font="normal 12px Arial";Model.Drawables.TextDrawable.draw=function(e){if(this.text!==""){this.setStyle(e);if(this.borderWidth>0){e.lineWidth=this.borderWidth;e.strokeStyle=this.borderColor;e.strokeText(this.text,-(this.size.x/2),-(this.size.y/2),this.size.x)}e.fillText(this.text,-(this.size.x/2),-(this.size.y/2),this.size.x)}};Model.Drawables.TextDrawable.setStyle=function(e){e.font=this.font;e.fillStyle=this.color;e.textBaseline="top"};Model.Drawables.TextDrawable.setText=function(e){this.text=e;View.ctx.font=this.font;View.ctx.fillStyle=this.color;View.ctx.textBaseline="top";this.size.x=View.ctx.measureText(e).width};Model.Drawables.SpriteDrawable=Model.Drawables.BaseDrawable.clone();Model.Drawables.SpriteDrawable._image=new Image;Model.Drawables.SpriteDrawable.curImage="";Model.Drawables.SpriteDrawable.onload=function(){this.loaded=true};Model.Drawables.SpriteDrawable.load=function(e){this._image.onload=this.onload;this._image.src=e;this.curImage=e};Model.Drawables.SpriteDrawable.draw=function(e){if(this._image.loaded){e.drawImage(this._image,-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)}};Model.Drawables.ButtonDrawable=Model.Drawables.SpriteDrawable.clone();Model.Drawables.ButtonDrawable.text="";Model.Drawables.ButtonDrawable.font="normal 12px Arial";Model.Drawables.ButtonDrawable.cursor="pointer";Model.Drawables.ButtonDrawable.textPos=[5,5];Model.Drawables.ButtonDrawable.onclick=function(){var e=window[this.name+"_onclick"];if(e)e()};Model.Drawables.ButtonDrawable.draw=function(e){if(this._image.loaded){e.drawImage(this._image,-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y);if(this.text!==""){e.font=this.font;e.fillStyle=this.color;e.textBaseline="top";e.fillText(this.text,-(this.size.x/2)+this.textPos[0],-(this.size.y/2)+this.textPos[1],this.size.x)}}};View={canvasID:"HTML5_2DRE",canvas:null,ctx:null,fps:50,fpsinterval:0,lastfps:0,fpscounter:0,fpstimer:0,mousePos:{x:0,y:0},canvasWidth:0,canvasHeight:0,mhoverObject:null,mdownObject:null,init:function(){this.canvas=document.getElementById(this.canvasID);if(this.canvas.getContext){this.ctx=this.canvas.getContext("2d");this.canvas.onselectstart=function(){return false};this.canvas.oncontextmenu=function(){return false};this.canvasWidth=this.canvas.width;this.canvasHeight=this.canvas.height;this.fpsinterval=1e3/this.fps;this.canvas.onmousedown=function(e){View.mousedown(e)};this.canvas.onmouseup=function(e){View.mouseup(e)};this.canvas.onmousemove=function(e){View.mousemove(e)};this.canvas.ondblclick=function(e){View.mousedblclick(e)};return true}return false},base_draw:function(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);for(var e=0;e<Model.drawableObjects.length;e++)if(Model.drawableObjects[e]){this.ctx.save();this.ctx.translate(Model.drawableObjects[e].position.x+Model.drawableObjects[e].size.x/2,Model.drawableObjects[e].position.y+Model.drawableObjects[e].size.y/2);this.ctx.rotate(Model.drawableObjects[e].rotation);this.ctx.globalAlpha=Model.drawableObjects[e].alpha;Model.drawableObjects[e].base_draw(this.ctx);this.ctx.restore()}if(this.fpstimer>=1){this.lastfps=this.fpscounter;this.fpscounter=0;this.fpstimer=0}this.fpstimer+=deltaTime;this.fpscounter++;if(this.draw)this.draw()},mouseposition:function(e){if(e==null)return this.mousePos;var t=this.canvas.getBoundingClientRect(),n=document.documentElement;var r=e.clientX-t.left;var i=e.clientY-t.top;return this.mousePos={x:r,y:i}},mousedown:function(e){var t=this.mouseposition(e);this.mdownObject=this.getobjectatpos(t.x,t.y)},mouseup:function(e){var t=this.mouseposition(e);var n=this.getobjectatpos(t.x,t.y);if(n!==null&&this.mdownObject===n)Controller.mouse_objectClick(n);n=null},mousemove:function(e){var t=this.mouseposition(e);var n=this.getobjectatpos(t.x,t.y);if(this.mhoverObject!==null&&n!=this.mhoverObject)Controller.mouse_objectHoverOut(this.mhoverObject);if(n!=null&&n!=this.mhoverObject)Controller.mouse_objectHoverIn(n);if(n){this.canvas.style.cursor=n.cursor;Controller.mouse_objectHover(n);this.mhoverObject=n}else{this.setstyledefaults();this.mhoverObject=null}},setstyledefaults:function(){this.canvas.style.cursor="default"},mousedblclick:function(e){var t=this.mouseposition(e);var n=this.getobjectatpos(t.x,t.y);if(n!==null&&this.mdownObject===n)Controller.mouse_objectDoubleClick(n);n=null},getobjectatpos:function(e,t){if(!e||!t)return false;if(Model.drawableObjects&&Model.drawableObjects.length>0)for(var n=Model.drawableObjects.length-1;n>=0;n--)if(e>=Model.drawableObjects[n].position.x&&e<=Model.drawableObjects[n].position.x+Model.drawableObjects[n].size.x&&t>=Model.drawableObjects[n].position.y&&t<=Model.drawableObjects[n].position.y+Model.drawableObjects[n].size.y&&Model.drawableObjects[n].visible)return Model.drawableObjects[n].getobjectatpos(e,t);return null}};Controller={isCtrl:false,keyDown:[],init:function(){document.onkeyup=function(e){if(e.which==17)Controller.isCtrl=false;Controller.keyDown[e.which]=false};document.onkeydown=function(e){if(e.which==17)Controller.isCtrl=true;Controller.keyDown[e.which]=true};return true},base_update:function(){for(var e=0;e<Model.drawableObjects.length;e++)if(Model.drawableObjects[e])Model.drawableObjects[e].base_update();if(this.update)this.update()},update:function(){},mouse_objectClick:function(e){if(e!==null)e.onclick()},mouse_objectDoubleClick:function(e){if(e!==null)e.onclick()},mouse_objectHover:function(e){if(e!==null)e.onhover()},mouse_objectHoverOut:function(e){if(e!==null&&e["onmouseout"])e.onmouseout()},mouse_objectHoverIn:function(e){if(e!==null&&e["onmousein"])e.onmousein()}};window.onload=HTML5_2DRE_start
