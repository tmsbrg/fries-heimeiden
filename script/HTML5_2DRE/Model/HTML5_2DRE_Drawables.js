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
// summary:	Contains the basic MVC Objects for the HTML5_2DREngine.

// -------------------------------------------------------------------------------------------------------------
//
//	Class: Drawables
//	This section contains all base drawable objects. These can be used as a basis for game-specific objects.
// -------------------------------------------------------------------------------------------------------------

/*
   Class: Model.Drawables.BaseDrawable
   
   This is the base drawable class from which all drawable objects inherit. It can also be used on its own as an empty object which contains children.
   
   Variables:

      name - The name of this object.
	  position - Where the variable will be drawn in pixels of the canvas. Relative to its parent if it has one.
	  size - The size of the object is used to draw the object and to check for mouse input. Make sure all buttons that are childs of this object fall inside its size.
	  scale - Used to scale the size.
	  rotation - Determines its rotation in radians. Relative to its parent if it has one.
	  color - Determines the colour to draw it with, if applicable.
	  alpha - Determines its alpha channel between 1 and 0.
	  visible - Determines whether it is visible (boolean).
	  parent - Contains its parent. If the object has no parent, it contains "null".
	  drawableObjects - Array which contains all of its children. See also: <BaseGame.drawableObjects>
	  cursor - Determines which type of cursor is used when the mouse hovers over the object.

   See Also:

	  <BaseGame.addDrawable>
	  <BaseGame.removeDrawable>
*/

Model.Drawables = new Array();

Model.Drawables.BaseDrawable = {
		name			: 	"DrawableObject",
		position		: 	{ x:0, y:0 },
		size			: 	{ x:1, y:1 },
		scale			: 	{ x:1, y:1 },
		rotation		:	0,
		depth			:	0,
		color			:	"#000000",
		alpha			:	1,
		visible			:	true,
		active			:	true,
		parent			:	null,
		drawableObjects	:	new Array(),
		cursor			:	"default",
		/* 
		   Function: onCloneInit
		
		   This function will be called when this object is being cloned.
		
		   See Also:
		
			  <BaseFunctions.Object.clone>
		*/
		onCloneInit		:	function() {},
		/* 
		   Function: onDrawInit
		
		   This function will be called when this object has been added into the drawable list.
		
		   See Also:
			  
			  <BaseGame.addDrawable>
			  <BaseDrawable.addDrawable>
		*/
		onDrawInit		:	function() {},
		/* 
		   Function: base_draw
		
		   Will check if this object is visible and if so will render itself to the canvas plus all its children.
		   
		   Returns:
		   
		   Boolean - false if invisible.
		
		   See Also:
		
			  <BaseDrawable.draw>
		*/
		base_draw	 	: 	function(ctx)
							{
								if(!this.visible)
									return false;
								
								this.draw(ctx);
								ctx.translate(-(this.size.x / 2), -(this.size.y / 2));
								
								for(var i = 0; i < this.drawableObjects.length; i++)
									if(this.drawableObjects[i])
									{
										ctx.save();
										ctx.translate(this.drawableObjects[i].position.x + (this.drawableObjects[i].size.x / 2), this.drawableObjects[i].position.y + (this.drawableObjects[i].size.y / 2));
										ctx.rotate(this.drawableObjects[i].rotation);
										this.drawableObjects[i].base_draw(ctx);
										ctx.restore();
									}
							},
		/* 
		   Function: base_update
		
		   Will check if this object is visible and if so will update itself to the canvas plus all its children.
		   
		   Returns:
		   
		   Boolean - False if invisible.
		
		   See Also:
		
			  <BaseDrawable.update>
		*/
		base_update	 	: 	function()
							{
								if(!this.active)
									return false;
								
								this.update();
								
								for(var i = 0; i < this.drawableObjects.length; i++)
									if(this.drawableObjects[i])
										this.drawableObjects[i].base_update();
							},
		/* 
		   Function: draw
		
		   Contains the HTML5 redering part for this object.
		*/
		draw			:	function(ctx) {},
		/* 
		   Function: update
		
		   Will be called before every draw call.
		*/
		update	 		: 	function() {},
		/* 
		   Function: setParent
		
		   Will be called when this object is added into the drawlist of another object.
		*/
		setParent		:	function(parent)
							{
								this.parent = parent;
							},
		/* 
		   Function: addDrawable
		
		   Will add a new object as child and will render it in the future.
		   
		   Parameters:
	
		   elem - Element (object) of base type <BaseDrawable> to be added into the rendering list.
		   depth - When should this element be drawn? the lowest will be drawn at the most back.
	
		   See Also:
		
			   <BaseGame.addDrawable>
			   <BaseDrawable.removeDrawable>
			   <BaseDrawable.setParent>
		*/
		addDrawable		:	function(elem, depth)
							{
								if(depth == null || depth == undefined)
								{
									index = this.drawableObjects.length;
									depth = (index > 0) ? this.drawableObjects[index - 1].depth + 1 : 0;
								}
								else
								{
									var index = 0;
									for(var i = 0; i < this.drawableObjects.length; i++)
										if(depth >= this.drawableObjects[i].depth)
											index = i + 1;
								}
								elem.depth = depth;
								elem.setParent(this);
												
								this.drawableObjects.insert(index, elem);
								if(elem.onDrawInit) elem.onDrawInit();
							},
		/*
			Function: removeDrawable
			
			Removes a <BaseDrawable> from the drawing list.
			
			Parameters:
	
				elem - Element (object) of base type <BaseDrawable> to be removed from the rendering list.
	
			See Also:
	
				<BaseGame.removeDrawable>
				<BaseDrawable.addDrawable>
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
			Function: getobjectatpos
			
			Checks through its children and returns the first one that contains the position [x, y]. If none is found, returns itself.
			
			Parameters:
			
				x - X co-ordinate to check at
				y - Y co-ordinate to check at
				
			Returns:
			
			Object - Most forward child at position [x, y] or itself.
			
			See Also:
			
				<BaseGame.base_getobjectatpos>
		*/
		getobjectatpos	:	function(x, y)
							{
								if(!x || !y)
									return this;
								
								x -= this.position.x;
								y -= this.position.y;
								
								if(this.drawableObjects && this.drawableObjects.length > 0)
									for(var i = this.drawableObjects.length - 1; i >= 0; i--)
										if(	x >= this.drawableObjects[i].position.x && x <= this.drawableObjects[i].position.x + this.drawableObjects[i].size.x &&
											y >= this.drawableObjects[i].position.y && y <= this.drawableObjects[i].position.y + this.drawableObjects[i].size.y &&
											this.drawableObjects[i].visible)
											return this.drawableObjects[i].getobjectatpos(x, y);
								
								return this;
							},
		/* 
			Function: onclick
			
			Triggered when the object is clicked.
			
			See Also:
			
				<BaseDrawable.onhover>
				<BaseDrawable.onmouseout>
		*/
		onclick			:	function() {},
		/* 
			Function: onhover
			
			Triggered when the mouse hovers over the object.
			
			See Also:
			
				<BaseDrawable.onclick>
				<BaseDrawable.onmouseout>
		*/
		onhover			:	function() {},
		/* 
			Function: onmouseout
			
			Triggered when the mouse moves out of the object.
			
			See Also:
			
				<BaseDrawable.onclick>
				<BaseDrawable.onhover>
		*/
		onmouseout		:	function() {},
		/* 
			Function: onmouseout
			
			Triggered when the mouse moves out of the object.
			
			See Also:
			
				<BaseDrawable.onclick>
				<BaseDrawable.onhover>
		*/
		onmousein		:	function() {}
	};

	/*
		Class: Model.Drawables.RectangleDrawable
		
		Object that is drawn as a rectangle. As with every drawable object, it inherits from <BaseDrawable>.
		
		Variables:
		borderColor - The colour of the rectangle's border
		borderWidth - The width of the rectangle's border	
	*/
Model.Drawables.RectangleDrawable = Model.Drawables.BaseDrawable.clone();
Model.Drawables.RectangleDrawable.borderColor = "#000000";
Model.Drawables.RectangleDrawable.borderWidth = 0;
	/*
		Function: draw
		
		Draws the rectangle.
		
		See also: <BaseDrawable.draw>
	*/
Model.Drawables.RectangleDrawable.draw = function(ctx)
{
	if(this.borderWidth > 0)
	{
		ctx.lineWidth = this.borderWidth;
		ctx.strokeStyle = this.borderColor;
		ctx.strokeRect(-(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
	}
	
	ctx.fillStyle = this.color;
	ctx.fillRect(-(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
}
	
/*
	Class: Model.Drawables.TextDrawable
	
	A textbox. As with every drawable object, it inherits from <BaseDrawable>.
	
	Variables:
	text - Contains the text to draw
	borderColor - The colour of the text box's border
	borderWidth - The width of the text box's border	
	font - Determines the font information to use when drawing the text.
*/
Model.Drawables.TextDrawable = Model.Drawables.BaseDrawable.clone();
Model.Drawables.TextDrawable.text = "";
Model.Drawables.TextDrawable.borderColor = "#000000";
Model.Drawables.TextDrawable.borderWidth = 0;
Model.Drawables.TextDrawable.font = "normal 12px Arial";
	/* 
		Function: draw
		
		Draws the text.
		
		See also: <BaseDrawable.draw>
	*/
Model.Drawables.TextDrawable.draw =		function(ctx)
{
	if(this.text !== "")
	{
		this.setStyle(ctx);
		
		if(this.borderWidth > 0)
		{
			ctx.lineWidth = this.borderWidth;
			ctx.strokeStyle = this.borderColor;
			ctx.strokeText(this.text, -(this.size.x / 2), -(this.size.y / 2), this.size.x);
		}
		ctx.fillText(this.text, -(this.size.x / 2), -(this.size.y / 2), this.size.x);
	}
}

Model.Drawables.TextDrawable.setStyle = function(ctx) 
{
		ctx.font = this.font;
		ctx.fillStyle = this.color;
		ctx.textBaseline = 'top'
};
	/*
		Function: setText
		
		Sets the text. Automatically adjusts the width of the object so it fits the complete new text.
	*/
Model.Drawables.TextDrawable.setText =	function(text)
{
	this.text = text;
	View.ctx.font = this.font;
	View.ctx.fillStyle = this.color;
	View.ctx.textBaseline = 'top';
	this.size.x = View.ctx.measureText(text).width;
}
						
/*
	Class: Model.Drawables.SpriteDrawable
	
	An object that is drawn as an image. As with every drawable object, it inherits from <BaseDrawable>.
	
	Variables:
	
    borderColor - The colour of the sprite's border
    borderWidth - The width of the sprite's border	
	_image - Contains image element used to draw.
	curImage - Contains the source link or path for the current image.
*/
Model.Drawables.SpriteDrawable = Model.Drawables.BaseDrawable.clone();
Model.Drawables.SpriteDrawable.borderColor = "#000000";
Model.Drawables.SpriteDrawable.borderWidth = 0;
Model.Drawables.SpriteDrawable._image = new Image();
Model.Drawables.SpriteDrawable.curImage = "";
	/*
		Function: onload
		
		Magic function that is called when the image has been loaded onto the user's computer.
	*/
Model.Drawables.SpriteDrawable.onload = function ()
{
	this.loaded = true;
}
	/*
		Function: load
		
		Used to load an image into the sprite. Also sets curImage to the given path.
		
		Parameters:
		
		src - The source of the image to load in as a full or relative link/path.
	*/
Model.Drawables.SpriteDrawable.load = 	function(src)
{
	this._image.onload = this.onload; // workaround
	this._image.parent = this;
	this._image.src = src;
	this.curImage = src;
}
	/*
		Function: draw
		
		Draws the image if it has been loaded.
		
		See also:
		
			<BaseDrawable.draw>
	*/
Model.Drawables.SpriteDrawable.draw = 	function(ctx)
{
	if(this._image.loaded)
	{
        if(this.borderWidth > 0)
        {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(-(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
        }
		ctx.drawImage(this._image, -(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
	}
}

/*
	Class: Model.Drawables.ButtonDrawable
	
	A button object. Inherits from <SpriteDrawable>, which inherits from <BaseDrawable>.
	
	Variables:
	text - Text to draw on the button. Leave empty to draw no text.
	font - Font to use for drawing the text.
	textPos - Position of the button's text, relative to its own.
	
	See also:
	
		<TextDrawable>
*/
Model.Drawables.ButtonDrawable = Model.Drawables.SpriteDrawable.clone();
Model.Drawables.ButtonDrawable.text = "";
Model.Drawables.ButtonDrawable.font = "normal 12px Arial";
Model.Drawables.ButtonDrawable.cursor = "pointer";
Model.Drawables.ButtonDrawable.textPos = [5, 5];
/*
	Function: onclick
	
	Triggered when the object is clicked. If this function is not changed, it will also trigger the function nameofobject_onclick if it is defined outside any class.

	See also: <BaseDrawable.onclick>
*/
Model.Drawables.ButtonDrawable.onclick = function()
{
	var func = window[this.name + "_onclick"];
	if(func)
		func();
}
/*
	Function: draw
	
	Draws the button and its text if it has it.
	
	See also: <BaseDrawable.draw>
*/
Model.Drawables.ButtonDrawable.draw = 	function(ctx)
{
	if(this._image.loaded)
	{
		ctx.drawImage(this._image, -(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
		if(this.text !== "")
		{
			ctx.font = this.font;
			ctx.fillStyle = this.color;
			ctx.textBaseline = 'top';
			ctx.fillText(this.text, -(this.size.x / 2) + this.textPos[0], -(this.size.y / 2) + this.textPos[1], this.size.x);
		}
	}
}

// TODO: Make this class work more efficiently by making it use with strings and a custom draw function instead of a list of TextDrawables
Model.Drawables.TextBox = Model.Drawables.RectangleDrawable.clone()
Model.Drawables.TextBox.padding = 5;
Model.Drawables.TextBox.textVerticalSize = 20;
Model.Drawables.TextBox.color = "#8FD8D8";
Model.Drawables.TextBox.borderWidth = 3;
Model.Drawables.TextBox.borderColor = "#000";
Model.Drawables.TextBox.lines = new Array();
Model.Drawables.TextBox.lineWidth = 300;
Model.Drawables.TextBox.largestLine = 0;
Model.Drawables.TextBox.fontSize = 14;
Model.Drawables.TextBox.font = "normal " + Model.Drawables.TextBox.fontSize + "px Courier";
Model.Drawables.TextBox.text = "";
Model.Drawables.TextBox.setFont = function(newFont)
							{
								this.font = newFont;
								this.fontSize = Number(this.font.substring(this.font.indexOf(" "), this.font.indexOf("px"))); // bad assumptions, but simple code!
								this.setText(this.text);
							}
Model.Drawables.TextBox.setText = function (text)
							{
								this.clearText();
								this.appendText(text);
								this.updateSize();
							}
Model.Drawables.TextBox.appendText = function (text)
							{
								text = this.removeLeadingWhiteSpace(text);
								var lineSize = this.lineWidth / this.fontSize;
								if (lineSize >= text.length) {
									this.lines[this.lines.length] = this.createLine(text);
								}
								else {
									var string = text.substr(0, lineSize);
									var lastSpace = string.lastIndexOf(" ");
									if (lastSpace > 0) {
										string = string.substr(0, lastSpace);
									}
									this.lines[this.lines.length] = this.createLine(string);
									this.appendText(text.substr(string.length, text.length - string.length));
								}
							}
Model.Drawables.TextBox.createLine = function (text)
							{
								if (text.length > this.largestLine) {
									this.largestLine = text.length;
								}
								var line = Model.Drawables.TextDrawable.clone()
								line.position = { x: this.padding, y: this.padding + this.textVerticalSize * this.lines.length };
								line.font = this.font;
								line.setText(text);
								this.text += text;
								this.addDrawable(line);
								return line;
							}
Model.Drawables.TextBox.clearText = function ()
							{
								for (var i = 0; i < this.lines.length; i++) {
									this.removeDrawable(this.lines[i]);
								}
								this.largestLine = 0;
								this.text = "";
								this.lines = new Array();
							}
Model.Drawables.TextBox.updateSize = function ()
							{
								this.size = { x: this.padding * 2 + this.largestLine * this.fontSize / 2 + this.fontSize * 2, y: this.padding * 2 + this.textVerticalSize * this.lines.length };
							}
Model.Drawables.TextBox.removeLeadingWhiteSpace = function (text)
							{
								for (var i = 0; i < text.length && text.charAt(i) == " "; i++)
									;
								return text.substring(i, text.length);
							}

//TODO: Fix padding
Model.Drawables.AnimatedDrawable = Model.Drawables.SpriteDrawable.clone();
Model.Drawables.AnimatedDrawable.frameSize = {x:1, y:1};
Model.Drawables.AnimatedDrawable.frameN = 1;
Model.Drawables.AnimatedDrawable.secondsPerFrame = 1;
Model.Drawables.AnimatedDrawable.startPadding = {x:0, y:0};
Model.Drawables.AnimatedDrawable.framePadding = {x:0, y:0};
Model.Drawables.AnimatedDrawable._framesPerRow = 0;
Model.Drawables.AnimatedDrawable._currentFrame = 0;
Model.Drawables.AnimatedDrawable._currentFrameOfRow = 0;
Model.Drawables.AnimatedDrawable._currentRow = 0;
Model.Drawables.AnimatedDrawable._secondsSinceNewFrame = 0.0;
// WARNING: Magic onload function is called by this._image, not by this
Model.Drawables.AnimatedDrawable.onload = function ()
{
	this.loaded = true;
	this.parent.calculateFramesPerRow();
}
Model.Drawables.AnimatedDrawable.calculateFramesPerRow = function ()
{
	this._framesPerRow = Math.floor((this._image.naturalWidth - this.startPadding.x) / (this.framePadding.x + this.frameSize.x));
}
Model.Drawables.AnimatedDrawable.draw = function(ctx)
{
	if(this._image.loaded) {
		this._secondsSinceNewFrame += deltaTime;
		if (this._secondsSinceNewFrame >= this.secondsPerFrame) {
			this._secondsSinceNewFrame -= this.secondsPerFrame;
			this._currentFrame++;
			this._currentFrameOfRow++;
			if (this._currentFrame >= this.frameN) {
				this._currentFrame = 0;
				this._currentFrameOfRow = this._currentFrame;
				this._currentRow = this._currentFrame;
			} else if (this._currentFrameOfRow >= this._framesPerRow) {
				this._currentRow++;
				this._currentFrameOfRow = 0;
			}
		}
        if(this.borderWidth > 0)
        {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(-(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
        }
		ctx.drawImage(this._image, this.startPadding.x + this.framePadding.x * this._currentFrameOfRow + this.frameSize.x * this._currentFrameOfRow,
					  this.startPadding.y + this.framePadding.y * this._currentRow + this.frameSize.y * this._currentRow,
					  this.frameSize.x, this.frameSize.y, -(this.size.x / 2), -(this.size.y / 2), this.size.x * this.scale.x, this.size.y * this.scale.y);
	}
}
