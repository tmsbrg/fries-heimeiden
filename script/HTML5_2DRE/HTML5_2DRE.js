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
// summary:	Main initiator of the HTML5_2DREngine.

/* Class: HTML5_2DRE

	Initializes the engine.

	Variables:
	
	IE - Is the client using internet exploder? If true we can use other functions that do work on internet exploder.
*/

var prevTime = 0;
var curTime = 0;
var deltaTime = -1

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);

function includeJS(jsPath){
  var js = document.createElement("script");
  js.setAttribute("src", jsPath);
  js.setAttribute("type", "text/javascript");
  document.getElementsByTagName("head")[0].appendChild(js);
}

includeJS("./script/HTML5_2DRE/Model/HTML5_2DRE_Model.js");
includeJS("./script/HTML5_2DRE/Model/HTML5_2DRE_Functions.js");
includeJS("./script/HTML5_2DRE/Model/HTML5_2DRE_Drawables.js");
includeJS("./script/HTML5_2DRE/View/HTML5_2DRE_View.js");
includeJS("./script/HTML5_2DRE/Controller/HTML5_2DRE_Controller.js"); 


/*
   Function: HTML5_2DRE_start

   Initializes MVC main objects, then initializes the game and starts the game loop.

   See Also:

      <HTML5_2DRE_initialize>
*/
function HTML5_2DRE_start()
{
	loaded = View.init() && Model.init() && Controller.init();
	if(loaded)
	{
		HTML5_2DRE_initialize();
		HTML5_2DRE_gameLoop();
	}
	else
	{
		console.log("Error: One or more of MVC main objects could be initialized.");
	}
}

/*
   Function: HTML5_2DRE_gameLoop

   Main loop which calls all the update and draw functions.
*/
function HTML5_2DRE_gameLoop()
{
	//time
	prevTime = curTime;
	curTime = Date.now();
	if(deltaTime === -1)
		deltaTime = 1 / View.fps;
	else
		deltaTime = (curTime - prevTime) / 1000;
	
	Controller.base_update();
	View.base_draw();
	setTimeout(function(){HTML5_2DRE_gameLoop()}, View.fpsinterval);
}

/*
   Function: HTML5_2DRE_initialize

   Initializes the game (not rendering engine).

   See Also:

      <HTML5_2DRE_start>
*/
function HTML5_2DRE_initialize()
{
	if(initialize)
		initialize();
}

window.onload = HTML5_2DRE_start;