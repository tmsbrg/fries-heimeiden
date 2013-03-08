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
// summary:	Controller element of the HTML5_2DREngine.

/* Class: Controller

	Variables:
	
	isCtrl - True if control key is pressed down.
	keyDown - Array of all the keycodes and their boolean state.
*/

Controller = {

	isCtrl 			: false,
	keyDown 		: [],
	/*
	   Function: init
	
	   Initializes the Controller.
	   
	   Returns:
		
		Boolean - True when everything has been loaded.
	*/
	init			:	function()
	{
		document.onkeyup=function(e){
			if(e.which == 17)
				Controller.isCtrl=false;
			
			Controller.keyDown[e.which] = false;
		}
		
		document.onkeydown=function(e){
			if(e.which == 17)
				Controller.isCtrl=true;
			
			Controller.keyDown[e.which] = true;
		}
		return true;
	},
	
	/*
	   Function: base_update
	
	   update function will be called before every draw call.
	
	   See Also:
	
		  <View.base_draw>
		  <Controller.update>
	*/
	base_update			:	function()
	{
		for(var i = 0; i < Model.drawableObjects.length; i++)
			if(Model.drawableObjects[i])
				Model.drawableObjects[i].base_update();
		
		if(this.update)
			this.update();
	},
	
	/*
	   Function: update
	
	   update function will be called before every draw call.
	   Most of the game logic will be put in here.
	
	   See Also:
	
		  <View.base_draw>
		  <Controller.update>
	*/
	update			:	function()
	{
		
	},
	
	/*
	   Function: mouse_objectClick
	
	   will be called by the <View> when an object has been pressed with the mouse button.
	
		Parameters:
			object - Object that has been pressed by the mouse button.
	*/
	mouse_objectClick		:	function(object)
	{
		if(object !== null)
			object.onclick();
	},
	
	/*
	   Function: mouse_objectDoubleClick
	
	   will be called by the <View> when an object has been double clicked with the mouse button.
	
		Parameters:
			object - Object that has been double clicked by the mouse button.
	*/
	mouse_objectDoubleClick		:	function(object)
	{
		if(object !== null)
			object.onclick();
	},
	
	/*
	   Function: mouse_objectHover
	
	   will be called by the <View> when an object is being hovered the mouse.
	
		Parameters:
			object - Object that is being hovered by the mouse.
	*/
	mouse_objectHover		:	function(object)
	{
		if(object !== null)
			object.onhover();
	},
	
	/*
	   Function: mouse_objectHoverOut
	
	   will be called by the <View> when an object is not being hovered anymore by the mouse.
	
		Parameters:
			object - Object that is not being hovered anymore by the mouse.
	*/
	mouse_objectHoverOut	:	function(object)
	{
		if(object !== null && object['onmouseout'])
			object.onmouseout();
	},

	/*
	   Function: mouse_objectHoverIn
	
	   will be called by the <View> when an object is hovered the first time by the mouse.
	
		Parameters:
			object - Object that is being hovered by the mouse.
	*/
	mouse_objectHoverIn		:	function(object)
	{
		if(object !== null && object['onmousein'])
			object.onmousein();
	}	
}
