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
// summary:	Model element of the HTML5_2DREngine.

/*
   Class: Model
   
   This is the base drawable class from which all drawable objects inherit. It can also be used on its own as an empty object which contains children.
   
   Variables:

	  drawableObjects - Array which contains all the objects in this application.
*/

Model = {
	drawableObjects			: new Array(),
	
	/*
	   Function: init
	
	   	Initializes the Model.
	   
	   Returns:
		
		Boolean - True when everything has been loaded.
	*/
	init					: function()
	{
		return true;
	},
	
	/*
	   Function: addDrawable
	
	   Adds a new <BaseDrawable> into the drawing list.
	
	   Parameters:
	
		  elem - Element (object) of HTML5_2DRE type <BaseDrawable> to be added into the rendering list.
		  depth - When should this element be drawn? the lowest will be drawn at the most back.
	
	   See Also:
	
		  <BaseDrawable>
		  <removeDrawable>
	*/

	addDrawable		: function(elem, depth)
	{
		if(depth == null || depth == undefined)
		{
			index = this.drawableObjects.length;
			depth = (index > 0) ? this.drawableObjects[(index-1)].depth + 1 : 0;
		}
		else
		{
			var index = 0;
			for(var i = 0; i < this.drawableObjects.length; i++)
				if(depth >= this.drawableObjects[i].depth)
					index = i + 1;
		}
		
		elem.depth = depth;
		this.drawableObjects.insert(index, elem);
		if(elem.onDrawInit) elem.onDrawInit();
	},

	/*
	   Function: removeDrawable
	
	   Removes a <BaseDrawable> from the drawing list.
	
	   Parameters:
	
		  elem - Element (object) of HTML5_2DRE type <BaseDrawable> to be removed from the rendering list.
	
	   See Also:
	
		  <BaseDrawable>
		  <addDrawable>
	*/
	
	removeDrawable	:	function(elem)
	{
		for(var i = 0; i < this.drawableObjects.length; i++)
			if(this.drawableObjects[i] == elem)
			{
				delete this.drawableObjects[i];
				this.drawableObjects.splice(i, 1)
				break;
			}
	},
	
	/*
		Function: requestFromServer
		
		Requesting data from a server asynchronous (AJAX).
		
		Parameters:
		url - the address we'd like to ask information from.
		data - data in get format (data1=value1&data2=value2).
		functionToCall - when the request is done, call this function.
		[sendDataAsPost] - set to true if you like to send the data via post.
	*/
	requestFromServer		:	function(url, data, functionToCall, sendDataAsPost)
	{
		if(sendDataAsPost == null)
			sendDataAsPost = false;
		
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				this.oncomplete(xmlhttp.responseText);
			}
		}
		
		xmlhttp.open(sendDataAsPost ? "post" : "get", url + (sendDataAsPost ? "" : "?" + data), true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.oncomplete = functionToCall;
		if(sendDataAsPost) xmlhttp.send(); else xmlhttp.send(data);
	}
}
