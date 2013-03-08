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
// summary:	Basic function for the HTML5_2DREngine.

/*
	Class: BaseFunctions
	
	This section contains some special functions used by the engine.
*/

/* 
	Class: Object
	
	A JavaScript object data type.
	
		Function: clone
		
		Clones the object and all it contains and returns the clone.
		
		Returns:
		
		Object - Clone of the original object.
*/

Object.prototype.clone = function() {
	var newObj = (this instanceof Array) ? [] : {};
	for (var i in this) {
		if (i == 'clone') continue;
		if (this[i] && typeof this[i] == "object") newObj[i] = this[i].cloneNode ? this[i].cloneNode() : this[i].clone();
		else newObj[i] = this[i]
	}
	if(newObj && newObj.onCloneInit) newObj.onCloneInit();
	return newObj;
};

/* 
	Class: Object
	
	A JavaScript object data type.
	
		Function: extend
		
		Extend the object with functions and fields given.
		
		Returns:
		
		data - JSON which should be added to the current object.
*/

Object.prototype.extend = function(data) {   
	for (var property in data)
		this[property] = data[property];
};

/*
	Class: Date
	
	A JavaScript Date data type.
	
		Function: clone
		
		Clones the Date and returns the clone.
		
		Returns:
		
		Date - Clone of the Date.
*/
Date.prototype.clone = function()
{
	var copy = new Date();
	copy.setTime(this.getTime());
	return copy;
};

/*
	Class: Number
	
	A JavaScript Number data type.
	
		Function: clone
		
		Clones the Number and returns the clone.
		
		Returns:
		
		Number - Clone of the Number.
*/
Number.prototype.clone = Boolean.prototype.clone = String.prototype.clone = function()
{
  return this;
};

	/*
		Function: formatMoney
		
		Formats money to a more human-readable form and returns it.
		
		Parameters:
		c - Number of decimals to round at.
		d - Character set between numbers to keep them readable. (3000000 -> 3[d]000[d]000) Defaults to ","
		t - Character set between full numbers and the decimal fractions. (1.5 -> 1[t]5) Defaults to "."
		
		Returns:
		
		Formatted money as string.
	*/
Number.prototype.formatMoney = function(c, d, t){
  var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

	/*
		Function: insert
		
		Inserts an item into an array at the given index
		
		Parameters:
		index - position in the array the new item should take place.
		item - the new item to add.
	*/
Array.prototype.insert = function (index, item) {
  if(index >= this.length)
  	this[this.length] = item;
  else
    this.splice(index, 0, item);
};
