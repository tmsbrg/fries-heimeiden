// Copyright (c) 2012 All Right Reserved, Eracle Software and Thomas van der Berg
//
// This source is subject to the Eracle License.
// Please see the license page on http://eraclesoftware.com/legal/ file for more information.
// All other rights reserved.
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
// KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// authors:	Ylon Schaeffer, Thomas van der Berg
// email:	yschaeffer@eraclesoftware.com, thomas.van.der.berg@hotmail.com
// date:	14-11-2012
// summary:	View element of the HTML5_2DREngine.

/* Class: View

	Variables:
	
	canvasID - HTML ID for the Canvas element to use.
	canvas - Contains the canvas element.
	ctx - Contains the Canvas' 2D renderer.
	fps - targeted fps which you like to run this game at (default 50).
	fpsinterval - (do not set) time to start the next update/draw.
	canvasWidth - The width of the game in pixels.
	canvasHeight - The height of the game in pixels.
	fpscounter - will count up every frame it renders.
	fpstimer - (do not set) will count to 1 with deltatime and when hit will grab <fpscounter> count and set it into <lastfps>.
	lastfps - Last FPS.

	mdownObject - Object currently being clicked on by the mouse.
	mhoverObject - Object which the mouse is hovering over.

	IE - Is the client using internet exploder? if true we can use other functions that do work on internet exploder.
*/

View = {
	canvasID		:	"HTML5_2DRE",
	canvas			:	null,
	ctx 			: 	null,
	fps 			:	50,
	fpsinterval		:	0, // will be set by start function
	lastfps 		:	0,
	fpscounter		:	0,
	fpstimer		:	0,
	mousePos		:	{ x:0, y:0 },
	
	canvasWidth 	:	0,
	canvasHeight	:	0,

	mhoverObject	:	null,
	mdownObject		:	null,
	
	/*
		Function: init
		
		Initializes the View,
		Connects to the canvas and gets its variables. Sets desired FPS.
		
		Returns:
		
		Boolean - True if it could connect to the HTML canvas with the canvas ID. Otherwise false.
	*/
	init :	function()
	{
		this.canvas = document.getElementById(this.canvasID);
		if (this.canvas.getContext)
		{
			this.ctx = this.canvas.getContext('2d');
			this.canvas.onselectstart = function () { return false; }
			this.canvas.oncontextmenu = function () { return false; }
			this.canvasWidth = this.canvas.width;
			this.canvasHeight = this.canvas.height;
			this.fpsinterval = 1000 / this.fps;
			
			this.canvas.onmousedown = 	function(e) { View.mousedown(e); }
			this.canvas.onmouseup 	= 	function(e) { View.mouseup(e); }
			this.canvas.onmousemove = 	function(e) { View.mousemove(e); }
			this.canvas.ondblclick 	= 	function(e) { View.mousedblclick(e); }
			
			return true;
		}
		return false;
	},
	
	/*
	   Function: base_draw
	
	   Draws every object on the canvas every frame.
	
	   See Also:
	
		  <Controller.base_update>
	*/
	base_draw	:	function()
	{
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		for(var i = 0; i < Model.drawableObjects.length; i++)
			if(Model.drawableObjects[i])
			{
				this.ctx.save();
				this.ctx.translate(Model.drawableObjects[i].position.x + (Model.drawableObjects[i].size.x / 2), Model.drawableObjects[i].position.y + (Model.drawableObjects[i].size.y / 2));
				this.ctx.rotate(Model.drawableObjects[i].rotation);
				this.ctx.globalAlpha = Model.drawableObjects[i].alpha;
				Model.drawableObjects[i].base_draw(this.ctx);
				this.ctx.restore();
			}
		
		if(this.fpstimer >= 1)
		{
			this.lastfps = this.fpscounter;
			this.fpscounter = 0;
			this.fpstimer = 0;
		}
		
		this.fpstimer += deltaTime;
		this.fpscounter++;
		
		if(this.draw)
			this.draw();
	},

	/*
	   Function: mouseposition
	
	   Will return the position of the mouse on the canvas.
	
	   Parameters:
	
		  e - event object.
		
	   Returns:
		  
		  Object.x - the x position of our mouse.
		  Object.y - the y position of our mouse.
	*/
	mouseposition			:	function(e)
	{
		if(e == null)
			return this.mousePos;
		
		var rect = this.canvas.getBoundingClientRect(), root = document.documentElement;
	
		// return relative mouse position
		var mouseX = e.clientX - rect.left;
		var mouseY = e.clientY - rect.top;
			
		return this.mousePos = { x: mouseX, y: mouseY };
	},

	/*
	   Function: mousedown
	
	   Called when the mouse is clicked.
	   Will set <mdownObject> to the currently clicked object.
	
	   Parameters:
	
		  e - event object.
	
	   See Also:
	
		  <mouseposition>
		  <getobjectatpos>
	*/
	mousedown		:	function(e)
	{
		var mposition = this.mouseposition(e);
		this.mdownObject = this.getobjectatpos(mposition.x, mposition.y);
	},
	
	/*
	   Function: mouseup
	
	   Called when the mouse button is released.
	   Will call <Controller.mouse_objectClick> with the object the mouse is hovering over as parameter if it is the same object it was pressed down on.
	
	   Parameters:
	
		  e - event object.
	
	   See Also:
		  <mdownObject>
		  <mouseposition>
		  <getobjectatpos>
	*/
	mouseup			:	function(e)
	{
		var mposition = this.mouseposition(e);
		var object = this.getobjectatpos(mposition.x, mposition.y);
		if(object !== null && this.mdownObject === object)
			Controller.mouse_objectClick(object);
		
		object = null;
	},
	
	/*
	   Function: mousemove
	
	   Called when the mouse moves.
	   Will call the <Controller.mouse_objectHover> when <mhoverObject> is hovered by the mouse.
	   Will call the <Controller.mouse_objectHoverOut> when <mhoverObject> is no longer being hovered.
	
	   Parameters:
	
		  e - event object.
	
	   See Also:
		  <mdownObject>
		  <mouseposition>
		  <getobjectatpos>
	*/
	mousemove			:	function(e)
	{		
		var mposition = this.mouseposition(e);
		var object = this.getobjectatpos(mposition.x, mposition.y);
		if(this.mhoverObject !== null && object != this.mhoverObject)
			Controller.mouse_objectHoverOut(this.mhoverObject);
		if(object != null && object != this.mhoverObject)
			Controller.mouse_objectHoverIn(object);
		
		if(object)
		{
			this.canvas.style.cursor = object.cursor;
			Controller.mouse_objectHover(object);
			this.mhoverObject = object;
		}
		else
		{
			//reset to default settings
			this.setstyledefaults();
			this.mhoverObject = null;
		}
	},
	
	/*
	   Function: setstyledefaults
	
	   When the mouse hovers out of an object this function will be called to return settings to their defaults.
	*/
	
	setstyledefaults			:	function()
	{
		this.canvas.style.cursor = "default";
	},
	
	/*
	   Function: mousedblclick
	
	   Called when the mouse is clicked twice in short succession.
	   Will call <Controller.mouse_objectDoubleClick> 
	
	   Parameters:
	
		  e - event object.
		  
	   See also:
	   
		  <mousedown>
		  <mouseup>
	*/
	mousedblclick			:	function(e)
	{
		var mposition = this.mouseposition(e);
		var object = this.getobjectatpos(mposition.x, mposition.y);
		if(object !== null && this.mdownObject === object)
			Controller.mouse_objectDoubleClick(object);
		
		object = null;
	},
	
	/*
	   Function: getobjectatpos
	
	   Will get the object at the given position.
	
	   Parameters:
	
		  x - x position to check.
		  y - y position to check.
		
	   Returns:
		  
		  <BaseDrawable> - the object which is at this place.
		  
	   See Also:
	   
		  <BaseDrawable>
	*/
	getobjectatpos				:	function(x, y)
	{
		if(!x || !y)
			return false;
		
		if(Model.drawableObjects && Model.drawableObjects.length > 0)
			for(var i = Model.drawableObjects.length - 1; i >= 0; i--)
				if(	x >= Model.drawableObjects[i].position.x && x <= Model.drawableObjects[i].position.x + Model.drawableObjects[i].size.x &&
					y >= Model.drawableObjects[i].position.y && y <= Model.drawableObjects[i].position.y + Model.drawableObjects[i].size.y &&
					Model.drawableObjects[i].visible)
					return Model.drawableObjects[i].getobjectatpos(x, y);
		
		return null;
	}
}