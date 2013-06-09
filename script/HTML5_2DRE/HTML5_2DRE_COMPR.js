// HTML5 Rendering Engine
// authors: Ylon Schaeffer, Thomas van der Berg
// source: https://github.com/tmsbrg/fries-heimeiden/tree/engine/script/HTML5_2DRE
// license: XFree86 license - http://eraclesoftware.com/legal/
function includeJS(e){var t=document.createElement("script");t.setAttribute("src",e),t.setAttribute("type","text/javascript"),document.getElementsByTagName("head")[0].appendChild(t)}function HTML5_2DRE_start(){loaded=View.init()&&Model.init()&&Controller.init(),loaded?(HTML5_2DRE_initialize(),HTML5_2DRE_gameLoop()):console.log("Error: One or more of MVC main objects could be initialized.")}function HTML5_2DRE_gameLoop(){prevTime=curTime,curTime=Date.now(),deltaTime===-1?deltaTime=1/View.fps:deltaTime=(curTime-prevTime)/1e3,Controller.base_update(),View.base_draw(),setTimeout(function(){HTML5_2DRE_gameLoop()},View.fpsinterval)}function HTML5_2DRE_initialize(){initialize&&initialize()}var prevTime=0,curTime=0,deltaTime=-1,IE=document.all?!0:!1;IE||document.captureEvents(Event.MOUSEMOVE),window.onload=HTML5_2DRE_start,Model={drawableObjects:new Array,init:function(){return!0},addDrawable:function(e,t){if(t==null||t==undefined)n=this.drawableObjects.length,t=n>0?this.drawableObjects[n-1].depth+1:0;else{var n=0;for(var r=0;r<this.drawableObjects.length;r++)t>=this.drawableObjects[r].depth&&(n=r+1)}e.depth=t,this.drawableObjects.insert(n,e),e.onDrawInit&&e.onDrawInit()},removeDrawable:function(e){for(var t=0;t<this.drawableObjects.length;t++)if(this.drawableObjects[t]==e){delete this.drawableObjects[t],this.drawableObjects.splice(t,1);break}},requestFromServer:function(e,t,n,r){r==null&&(r=!1),xmlhttp=new XMLHttpRequest,xmlhttp.onreadystatechange=function(){xmlhttp.readyState==4&&xmlhttp.status==200&&this.oncomplete(xmlhttp.responseText)},xmlhttp.open(r?"post":"get",e+(r?"":"?"+t),!0),xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),xmlhttp.oncomplete=n,r?xmlhttp.send():xmlhttp.send(t)},getLocalTextFile:function(e){var t=new XMLHttpRequest;return t.open("GET",window.chrome?chrome.extension.getURL(e):e,!1),t.overrideMimeType("text/plain"),t.send(),t.responseText}},Object.prototype.clone=function(){var e=this instanceof Array?[]:{};for(var t in this){if(t=="clone")continue;this[t]&&typeof this[t]=="object"?e[t]=this[t].cloneNode?this[t].cloneNode():this[t].clone():e[t]=this[t]}return e&&e.onCloneInit&&e.onCloneInit(),e},Object.prototype.extend=function(e){for(var t in e)this[t]=e[t]},Date.prototype.clone=function(){var e=new Date;return e.setTime(this.getTime()),e},Number.prototype.clone=Boolean.prototype.clone=String.prototype.clone=function(){return this},Number.prototype.formatMoney=function(e,t,n){var r=this,e=isNaN(e=Math.abs(e))?2:e,t=t==undefined?",":t,n=n==undefined?".":n,i=r<0?"-":"",s=parseInt(r=Math.abs(+r||0).toFixed(e))+"",o=(o=s.length)>3?o%3:0;return i+(o?s.substr(0,o)+n:"")+s.substr(o).replace(/(\d{3})(?=\d)/g,"$1"+n)+(e?t+Math.abs(r-s).toFixed(e).slice(2):"")},Array.prototype.insert=function(e,t){e>=this.length?this[this.length]=t:this.splice(e,0,t)},Model.Drawables=new Array,Model.Drawables.BaseDrawable={name:"DrawableObject",position:{x:0,y:0},size:{x:1,y:1},scale:{x:1,y:1},rotation:0,depth:0,color:"#000000",alpha:1,visible:!0,active:!0,ignoremouse:!1,parent:null,drawableObjects:new Array,cursor:"default",onCloneInit:function(){},onDrawInit:function(){},base_draw:function(e){if(!this.visible)return!1;this.draw(e),e.translate(-(this.size.x/2),-(this.size.y/2));for(var t=0;t<this.drawableObjects.length;t++)this.drawableObjects[t]&&(e.save(),e.translate(this.drawableObjects[t].position.x+this.drawableObjects[t].size.x/2,this.drawableObjects[t].position.y+this.drawableObjects[t].size.y/2),e.rotate(this.drawableObjects[t].rotation),e.globalAlpha=this.drawableObjects[t].alpha,this.drawableObjects[t].base_draw(e),e.restore())},base_update:function(){if(!this.active)return!1;this.update();for(var e=0;e<this.drawableObjects.length;e++)this.drawableObjects[e]&&this.drawableObjects[e].base_update()},draw:function(e){},update:function(){},setParent:function(e){this.parent=e},addDrawable:function(e,t){if(t==null||t==undefined)n=this.drawableObjects.length,t=n>0?this.drawableObjects[n-1].depth+1:0;else{var n=0;for(var r=0;r<this.drawableObjects.length;r++)t>=this.drawableObjects[r].depth&&(n=r+1)}e.depth=t,e.setParent(this),this.drawableObjects.insert(n,e),e.onDrawInit&&e.onDrawInit()},removeDrawable:function(e){for(var t=0;t<this.drawableObjects.length;t++)if(this.drawableObjects[t]==e){delete this.drawableObjects[t],this.drawableObjects.splice(t,1);break}},getobjectatpos:function(e,t){if(!e||!t)return this;e-=this.position.x,t-=this.position.y;if(this.drawableObjects&&this.drawableObjects.length>0)for(var n=this.drawableObjects.length-1;n>=0;n--)if(e>=this.drawableObjects[n].position.x&&e<=this.drawableObjects[n].position.x+this.drawableObjects[n].size.x&&t>=this.drawableObjects[n].position.y&&t<=this.drawableObjects[n].position.y+this.drawableObjects[n].size.y&&this.drawableObjects[n].visible&&this.drawableObjects[n].ignoremouse==0)return this.drawableObjects[n].getobjectatpos(e,t);return this},onmousedown:function(){},onclick:function(){},onhover:function(){},onmouseout:function(){},onmousein:function(){}},Model.Drawables.RectangleDrawable=Model.Drawables.BaseDrawable.clone(),Model.Drawables.RectangleDrawable.borderColor="#000000",Model.Drawables.RectangleDrawable.borderWidth=0,Model.Drawables.RectangleDrawable.draw=function(e){this.borderWidth>0&&(e.lineWidth=this.borderWidth,e.strokeStyle=this.borderColor,e.strokeRect(-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)),e.fillStyle=this.color,e.fillRect(-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)},Model.Drawables.TextDrawable=Model.Drawables.BaseDrawable.clone(),Model.Drawables.TextDrawable.text="",Model.Drawables.TextDrawable.borderColor="#000000",Model.Drawables.TextDrawable.borderWidth=0,Model.Drawables.TextDrawable.font="normal 12px Arial",Model.Drawables.TextDrawable.draw=function(e){this.text!==""&&(this.setStyle(e),this.borderWidth>0&&(e.lineWidth=this.borderWidth,e.strokeStyle=this.borderColor,e.strokeText(this.text,-(this.size.x/2),-(this.size.y/2),this.size.x)),e.fillText(this.text,-(this.size.x/2),-(this.size.y/2),this.size.x))},Model.Drawables.TextDrawable.setStyle=function(e){e.font=this.font,e.fillStyle=this.color,e.textBaseline="top"},Model.Drawables.TextDrawable.setText=function(e){this.text=e,View.ctx.font=this.font,View.ctx.fillStyle=this.color,View.ctx.textBaseline="top",this.size.x=View.ctx.measureText(e).width},Model.Drawables.SpriteDrawable=Model.Drawables.BaseDrawable.clone(),Model.Drawables.SpriteDrawable.borderColor="#000000",Model.Drawables.SpriteDrawable.borderWidth=0,Model.Drawables.SpriteDrawable._image=new Image,Model.Drawables.SpriteDrawable.curImage="",Model.Drawables.SpriteDrawable.onload=function(){this.loaded=!0},Model.Drawables.SpriteDrawable.load=function(e){this._image.onload=this.onload,this._image.parent=this,this._image.src=e,this.curImage=e},Model.Drawables.SpriteDrawable.draw=function(e){this._image.loaded&&(this.borderWidth>0&&(e.lineWidth=this.borderWidth,e.strokeStyle=this.borderColor,e.strokeRect(-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)),e.drawImage(this._image,-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y))},Model.Drawables.ButtonDrawable=Model.Drawables.SpriteDrawable.clone(),Model.Drawables.ButtonDrawable.text="",Model.Drawables.ButtonDrawable.font="normal 12px Arial",Model.Drawables.ButtonDrawable.cursor="pointer",Model.Drawables.ButtonDrawable.textPos=[5,5],Model.Drawables.ButtonDrawable.onclick=function(){var e=window[this.name+"_onclick"];e&&e()},Model.Drawables.ButtonDrawable.draw=function(e){this._image.loaded&&(e.drawImage(this._image,-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y),this.text!==""&&(e.font=this.font,e.fillStyle=this.color,e.textBaseline="top",e.fillText(this.text,-(this.size.x/2)+this.textPos[0],-(this.size.y/2)+this.textPos[1],this.size.x)))},Model.Drawables.TextBox=Model.Drawables.RectangleDrawable.clone(),Model.Drawables.TextBox.padding=5,Model.Drawables.TextBox.textVerticalSize=20,Model.Drawables.TextBox.color="#8FD8D8",Model.Drawables.TextBox.borderWidth=3,Model.Drawables.TextBox.borderColor="#000",Model.Drawables.TextBox.lines=new Array,Model.Drawables.TextBox.lineWidth=300,Model.Drawables.TextBox.largestLine=0,Model.Drawables.TextBox.fontSize=14,Model.Drawables.TextBox.font="normal "+Model.Drawables.TextBox.fontSize+"px Courier",Model.Drawables.TextBox.text="",Model.Drawables.TextBox.setFont=function(e){this.font=e,this.fontSize=Number(this.font.substring(this.font.indexOf(" "),this.font.indexOf("px"))),this.setText(this.text)},Model.Drawables.TextBox.setText=function(e){this.clearText(),this.appendText(e),this.updateSize()},Model.Drawables.TextBox.appendText=function(e){e=this.removeLeadingWhiteSpace(e);var t=this.lineWidth/this.fontSize;if(t>=e.length)this.lines[this.lines.length]=this.createLine(e);else{var n=e.substr(0,t),r=n.lastIndexOf(" ");r>0&&(n=n.substr(0,r)),this.lines[this.lines.length]=this.createLine(n),this.appendText(e.substr(n.length,e.length-n.length))}},Model.Drawables.TextBox.createLine=function(e){e.length>this.largestLine&&(this.largestLine=e.length);var t=Model.Drawables.TextDrawable.clone();return t.position={x:this.padding,y:this.padding+this.textVerticalSize*this.lines.length},t.font=this.font,t.setText(e),this.text+=e,this.addDrawable(t),t},Model.Drawables.TextBox.clearText=function(){for(var e=0;e<this.lines.length;e++)this.removeDrawable(this.lines[e]);this.largestLine=0,this.text="",this.lines=new Array},Model.Drawables.TextBox.updateSize=function(){this.size={x:this.padding*2+this.largestLine*this.fontSize/2+this.fontSize*2,y:this.padding*2+this.textVerticalSize*this.lines.length}},Model.Drawables.TextBox.removeLeadingWhiteSpace=function(e){for(var t=0;t<e.length&&e.charAt(t)==" ";t++);return e.substring(t,e.length)},Model.Drawables.AnimationDrawable=Model.Drawables.SpriteDrawable.clone(),Model.Drawables.AnimationDrawable.frameSize={x:1,y:1},Model.Drawables.AnimationDrawable.frameN=1,Model.Drawables.AnimationDrawable.secondsPerFrame=1,Model.Drawables.AnimationDrawable.offset={x:0,y:0},Model.Drawables.AnimationDrawable.framePadding={x:0,y:0},Model.Drawables.AnimationDrawable.paused=!1,Model.Drawables.AnimationDrawable._framesPerRow=0,Model.Drawables.AnimationDrawable._currentFrame=0,Model.Drawables.AnimationDrawable._currentFrameOfRow=0,Model.Drawables.AnimationDrawable._currentRow=0,Model.Drawables.AnimationDrawable._secondsSinceNewFrame=0,Model.Drawables.AnimationDrawable.base_update=function(){Model.Drawables.BaseDrawable.base_update.apply(this),this.updateAnimation()},Model.Drawables.AnimationDrawable.loadAnimation=function(e,t){this.load(e),this.loadSettings(t)},Model.Drawables.AnimationDrawable.loadSettings=function(e){},Model.Drawables.AnimationDrawable.onload=function(){this.loaded=!0,this.parent.calculateFramesPerRow()},Model.Drawables.AnimationDrawable.calculateFramesPerRow=function(){this._framesPerRow=Math.floor((this._image.naturalWidth-this.offset.x)/(this.framePadding.x+this.frameSize.x))},Model.Drawables.AnimationDrawable.reset=function(){this._currentFrame=this._currentFrameOfRow=this._currentRow=this._secondsSinceNewFrame=0,this.paused=!1},Model.Drawables.AnimationDrawable.pause=function(){this.paused=!0},Model.Drawables.AnimationDrawable.unpause=function(){this.paused=!1},Model.Drawables.AnimationDrawable.draw=function(){this._image.loaded&&(this.paused||(this._secondsSinceNewFrame+=deltaTime),this._secondsSinceNewFrame>=this.secondsPerFrame&&(this._secondsSinceNewFrame=0,this._currentFrame++,this._currentFrameOfRow++,this._currentFrame==this.frameN-1&&this.onAnimationComplete(),this._currentFrame>=this.frameN?(this._currentFrame=0,this._currentFrameOfRow=this._currentFrame,this._currentRow=this._currentFrame):this._currentFrameOfRow>=this._framesPerRow&&(this._currentRow++,this._currentFrameOfRow=0)),this.borderWidth>0&&(ctx.lineWidth=this.borderWidth,ctx.strokeStyle=this.borderColor,ctx.strokeRect(-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y)),ctx.drawImage(this._image,this.offset.x+this.framePadding.x+this.framePadding.x*2*this._currentFrameOfRow+this.frameSize.x*this._currentFrameOfRow,this.offset.y+this.framePadding.y+this.framePadding.y*2*this._currentRow+this.frameSize.y*this._currentRow,this.frameSize.x,this.frameSize.y,-(this.size.x/2),-(this.size.y/2),this.size.x*this.scale.x,this.size.y*this.scale.y))},Model.Drawables.AnimationDrawable.onAnimationComplete=function(){},Model.Drawables.AnimatedDrawable=Model.Drawables.BaseDrawable.clone(),Model.Drawables.AnimatedDrawable.animationList=new Array,Model.Drawables.AnimatedDrawable.currentAnimation=null,Model.Drawables.AnimatedDrawable.currentAnimationIndex=null,Model.Drawables.AnimatedDrawable.addAnimations=function(){for(var e=0;e<arguments.length;e++)this.animationList[this.animationList.length]=arguments[e],arguments[e].visible=!1,arguments[e].size=this.size.clone(),arguments[e].ignoremouse=!0,arguments[e].onAnimationComplete=function(){this.parent.handleAnimationComplete()},this.addDrawable(arguments[e])},Model.Drawables.AnimatedDrawable.showAnimation=function(e){this.animationList[e]?(this.currentAnimation&&this.stopAnimation(),this.currentAnimation=this.animationList[e],this.currentAnimationIndex=e,this.currentAnimation.visible=!0):console.log("No animation with index number: "+e)},Model.Drawables.AnimatedDrawable.stopAnimation=function(){this.currentAnimationIndex=null,this.currentAnimation.visible=!1,this.currentAnimation.reset(),this.currentAnimation=null},Model.Drawables.AnimatedDrawable.onAnimationComplete=function(e){},Model.Drawables.AnimatedDrawable.handleAnimationComplete=function(){this.onAnimationComplete(this.currentAnimationIndex)},Model.Drawables.AnimatedDrawable.reset=function(){this.currentAnimation&&this.currentAnimation.reset()},Model.Drawables.AnimatedDrawable.pause=function(){this.currentAnimation&&this.currentAnimation.pause()},Model.Drawables.AnimatedDrawable.unpause=function(){this.currentAnimation&&this.currentAnimation.unpause()},View={canvasID:"HTML5_2DRE",canvas:null,ctx:null,fps:50,fpsinterval:0,lastfps:0,fpscounter:0,fpstimer:0,mousePos:{x:0,y:0},canvasWidth:0,canvasHeight:0,mhoverObject:null,mdownObject:null,init:function(){return this.canvas=document.getElementById(this.canvasID),this.canvas.getContext?(this.ctx=this.canvas.getContext("2d"),this.canvas.onselectstart=function(){return!1},this.canvas.oncontextmenu=function(){return!1},this.canvasWidth=this.canvas.width,this.canvasHeight=this.canvas.height,this.fpsinterval=1e3/this.fps,this.canvas.onmousedown=function(e){View.mousedown(e)},this.canvas.onmouseup=function(e){View.mouseup(e)},this.canvas.onmousemove=function(e){View.mousemove(e)},this.canvas.ondblclick=function(e){View.mousedblclick(e)},!0):!1},base_draw:function(){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);for(var e=0;e<Model.drawableObjects.length;e++)Model.drawableObjects[e]&&(this.ctx.save(),this.ctx.translate(Model.drawableObjects[e].position.x+Model.drawableObjects[e].size.x/2,Model.drawableObjects[e].position.y+Model.drawableObjects[e].size.y/2),this.ctx.rotate(Model.drawableObjects[e].rotation),this.ctx.globalAlpha=Model.drawableObjects[e].alpha,Model.drawableObjects[e].base_draw(this.ctx),this.ctx.restore());this.fpstimer>=1&&(this.lastfps=this.fpscounter,this.fpscounter=0,this.fpstimer=0),this.fpstimer+=deltaTime,this.fpscounter++,this.draw&&this.draw()},mouseposition:function(e){if(e==null)return this.mousePos;var t=this.canvas.getBoundingClientRect(),n=document.documentElement,r=e.clientX-t.left,i=e.clientY-t.top;return this.mousePos={x:r,y:i}},mousedown:function(e){var t=this.mouseposition(e);this.mdownObject=this.getobjectatpos(t.x,t.y),this.mdownObject!==null&&Controller.mouse_objectMouseDown(this.mdownObject)},mouseup:function(e){var t=this.mouseposition(e),n=this.getobjectatpos(t.x,t.y);n!==null&&this.mdownObject===n&&Controller.mouse_objectClick(n),n=null},mousemove:function(e){var t=this.mouseposition(e),n=this.getobjectatpos(t.x,t.y);this.mhoverObject!==null&&n!=this.mhoverObject&&Controller.mouse_objectHoverOut(this.mhoverObject),n!=null&&n!=this.mhoverObject&&Controller.mouse_objectHoverIn(n),n?(this.canvas.style.cursor=n.cursor,Controller.mouse_objectHover(n),this.mhoverObject=n):(this.setstyledefaults(),this.mhoverObject=null)},setstyledefaults:function(){this.canvas.style.cursor="default"},mousedblclick:function(e){var t=this.mouseposition(e),n=this.getobjectatpos(t.x,t.y);n!==null&&this.mdownObject===n&&Controller.mouse_objectDoubleClick(n),n=null},getobjectatpos:function(e,t){if(!e||!t)return!1;if(Model.drawableObjects&&Model.drawableObjects.length>0)for(var n=Model.drawableObjects.length-1;n>=0;n--)if(e>=Model.drawableObjects[n].position.x&&e<=Model.drawableObjects[n].position.x+Model.drawableObjects[n].size.x&&t>=Model.drawableObjects[n].position.y&&t<=Model.drawableObjects[n].position.y+Model.drawableObjects[n].size.y&&Model.drawableObjects[n].visible&&Model.drawableObjects[n].ignoremouse==0)return Model.drawableObjects[n].getobjectatpos(e,t);return null}},Controller={isCtrl:!1,keyDown:[],init:function(){return document.onkeyup=function(e){e.which==17&&(Controller.isCtrl=!1),Controller.keyDown[e.which]=!1},document.onkeydown=function(e){e.which==17&&(Controller.isCtrl=!0),Controller.keyDown[e.which]=!0},!0},base_update:function(){for(var e=0;e<Model.drawableObjects.length;e++)Model.drawableObjects[e]&&Model.drawableObjects[e].base_update();this.update&&this.update()},update:function(){},mouse_objectMouseDown:function(e){e!==null&&e.onmousedown()},mouse_objectClick:function(e){e!==null&&e.onclick()},mouse_objectDoubleClick:function(e){e!==null&&e.onclick()},mouse_objectHover:function(e){e!==null&&e.onhover()},mouse_objectHoverOut:function(e){e!==null&&e.onmouseout&&e.onmouseout()},mouse_objectHoverIn:function(e){e!==null&&e.onmousein&&e.onmousein()}};
