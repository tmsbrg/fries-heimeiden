/* copyright qwerty,
source: http://dumpsite.com/forum/index.php?PHPSESSID=tn6u7iqbnavoqummsr9om2cjg6&topic=4.msg29#msg29
*/

String.prototype.replaceAll = function(str1, str2, ignore) 
{
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};
