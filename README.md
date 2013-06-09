Fries Museum Heimeidenspel - Engine Branch
========================

Dutch
-----

Dit is de rendering-engine-branche voor het heimeiden/paalwormen spel voor een project van de Minor Game Design van de opleiding
Communication & Multimedia Design op de NHL Hogeschool.

Hier staat de HTML5_2DRE Rendering Engine. Deze engine is origineel ontwikkeld door Ylon Scheaffer(Eracle Software) en Thomas van der Berg. Dit is op dit moment de plek waar de engine actief geupdate wordt.

### Gebruik

Zie ook: voorbeeld game in ./script/game/example.js en "Technische informatie"-sectie in deze readme.

Open index.htm in een browser om het voorbeeldspel te spelen.
Om uw eigen spellen te maken met de HTML5_2DRE rendering engine, raadpleeg de technische documentatie of de code.

Probeer eerst maar het voorbeeldspel een beetje aan te passen. Een aantal suggesties van dingen die je kunt toevoegen aan het voorbeeldspel om de engine te leren kennen:
 * Een tekstobject die de score bijhoudt. Elke keer als je het vierkant klikt krijg je er een punt bij.
 * Dat het vierkant elke keer dat hij geklikt wordt sneller en kleiner wordt, tot een bepaald maximum.
 * Het vierkantje vervangen met een plaatje
 * Meerdere vierkantjes!

Als je de engine wilt gebruiken in een game, is het verstandig om de compressed versie te gebruiken(HTML5_2DRE_COMPR.js).
Dit is omdat de engine anders afhankelijk is van de asynchrone "includeJS" functie, die niet altijd goed werkt, vooral met hogere latency.

Als je de engine hebt aangepast en hem wilt compressen, dit is wat wij hebben gedaan:
 * Voeg alle bestanden in deze volgorde samen: HTML5_2DRE.js(zonder line 40 tot 44), HTML5_2DRE_Model.js, HTML5_2DRE_Functions.js,
   HTML5_2DRE_Drawables.js, HTML5_2DRE_View.js en ten slotte HTML5_2DRE_Controller.js
 * Gebruik uglifyjs(een JavaScript programma die op Node.js werkt) om het samengevoegde bestand te comprimeren
 
Het is handig als je dit kunt automatiseren met een script. Dit is wat wij hebben gedaan.
 
### Licentie

Deze engine staat onder de XFree86 Licensie, aangepast voor gebruik van onze namen:

Copyright (C) 1994-2006 The XFree86 Project, Inc.
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. Redistributions of source code must retain the above copyright notice, this list of conditions, and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution, and in the same place and form as other copyright, license and disclaimer information.

3. The end-user documentation included with the redistribution, if any, must include the following acknowledgment: "This product includes software developed by Eracle Software(http://www.eraclesoftware.com/) and Thomas van der Berg", in the same place and form as other third-party acknowledgments. Alternately, this acknowledgment may appear in the software itself, in the same form and location as other such third-party acknowledgments.

4. Except as contained in this notice, the name of Eracle Software shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Eracle Software.

THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE XFREE86 PROJECT, INC OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

_bron origineel_: http://www.xfree86.org/current/LICENSE4.html

### Technische informatie

In "./docs/Technisch design.pdf" staat het originele ontwerpdocument van de HTML5_2DRE Rendering Engine. Er is geen Engelse versie van dit document.
"./docs/reference/index.htm" is een referentie voor de originele HTML5_2DRE code. Met alles basisclasses en -functies.

Deze documenten zijn echter wel veroudert, een aantal belangrijke nieuwe features staan er niet in. Bekijk altijd de code om de nieuwste features te vinden.

Een aantal dingen die niet in de documentatie staan maar wel in de rendering engine zitten:
 * AnimationDrawable en AnimatedDrawable die samen animaties regelen.
 * de onmousedown functie bij elke drawableObject
 * de ignoremouse boolean voor elke drawableObject
 * TextBox, een drawableObject met word wrap. Niet de meest efficiente implementatie.
 * Model.getLocalTextFile(filepath), een functie die locale tekstbestanden inlaadt en de tekst ervan teruggeeft.

### Copyright

 * *Ylon Scheaffer for Eracle Software*
 * *Thomas van der Berg*

English
-------

This is the rendering engine branch for the heimeiden/paalwormen game for a project of Minor Game Design of the study
Communication & Multimedia Design at the NHL University of Applied Sciences.

This is the HTML5_2DRE Rendering Engine. This engine is originally developed by Ylon Scheaffer(Eracle Software) and Thomas van der Berg. This is currently the page the engine gets updated actively on.

### Use

See also: example game in ./script/game/example.js and "Technical information"-section in this readme.

Open index.htm in a browser to play the example game.
To make your own games using the HTML5_2DRE rendering engine, look at the technical documentation and the code.

First try editing the example game. Some suggestions of things you can add to learn how to use the HTML5_2DRE rendering engine:
 * A textobject that keeps the score. Every time you click the square, a point is added.
 * Increasing difficulty as the square keeps getting smaller and faster every time it is clicked.
 * Replacing the square with an image.
 * Making more squares!

If you want to use the engine in a game, it is recommended to use the compressed version(HTML5_2DRE_COMPR.js).
This is because otherwise, the engine is dependent on the asynchronous "includeJS" function, which doesn't always work correctly, especially with high latency.

If you've edited the engine and want to compress it, this is what we did:
 * Join all files into one big file in this order: HTML5_2DRE.js(without line 40 to 44), HTML5_2DRE_Model.js, HTML5_2DRE_Functions.js,
   HTML5_2DRE_Drawables.js, HTML5_2DRE_View.js and finally HTML5_2DRE_Controller.js
 * Use uglifyjs(a JavaScript program that works through Node.js) to compress this file
 
It's handy to automate this with a script. That is what we have done.
 
### Licence

This engine is under the XFree86 license, edited to use our names:

Copyright (C) 1994-2006 The XFree86 Project, Inc.
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. Redistributions of source code must retain the above copyright notice, this list of conditions, and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution, and in the same place and form as other copyright, license and disclaimer information.

3. The end-user documentation included with the redistribution, if any, must include the following acknowledgment: "This product includes software developed by Eracle Software(http://www.eraclesoftware.com/) and Thomas van der Berg", in the same place and form as other third-party acknowledgments. Alternately, this acknowledgment may appear in the software itself, in the same form and location as other such third-party acknowledgments.

4. Except as contained in this notice, the name of Eracle Software shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Eracle Software.

THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE XFREE86 PROJECT, INC OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

_source original_: http://www.xfree86.org/current/LICENSE4.html

### Technical information

In "./docs/Technisch design.pdf" is the original design document for the HTML5_2DRE Rendering Engine. There is no English version of this document.
"./docs/reference/index.htm" is a reference for the original HTML5_2DRE code. With all basic classes and functions.

These documents are however outdated, some important new functions aren't in them. Always look at the code to find the newest features.

Some things that aren't in the documentation but are in the rendering engine:
 * AnimationDrawable and AnimatedDrawable which handle animations together
 * the onmousedown function for every drawableObject
 * the ignoremouse boolean for every drawableObject
 * TextBox, a drawableObject with word wrap. Not the most efficient implementation.
 * Model.getLocalTextFile(filepath), a function that loads local text files, and returns their text content.

### Copyright

 * *Ylon Scheaffer for Eracle Software*
 * *Thomas van der Berg*