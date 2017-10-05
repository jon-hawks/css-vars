/*-----------------------------------------------------------------------------\
| CSS Variables Polyfill                                                       |
|                                                                              |
| Enables support for browsers which do not support CSS variables.             |
+------------------------------------------------------------------------------+
| Author: Jon Hawks                                                            |
| Version: 1.2                                                                 |
\-----------------------------------------------------------------------------*/
function cssVars(){
    if(
        typeof window.CSS !== "function"            ||
        typeof window.CSS.supports !== "function"   ||
        !window.CSS.supports("(--property: value)") ||
        navigator.userAgent.indexOf('Edge/') > -1   ||
        navigator.userAgent.indexOf('MSIE ') > -1   ||
        navigator.userAgent.indexOf('Trident/') > -1
    ){
        console.log("Polyfilling CSS variables.");

        /* Get all of the stylesheets. */
        var styleElements = document.getElementsByTagName("style");

        /* Find CSS variables. */
        var foundVars = {};
        for(var i = styleElements.length - 1; i >= 0; i--){
            if(typeof styleElements[i].innerHTML !== "string") continue;
            /* Oh my... this is getting a little out of hand:| Property Name | Value No () | Variable With ()             */
            foundVars[i] = styleElements[i].innerHTML.match(/((--([\w-]+)\s*):\s*([^;\}]+|(?:.*\)[^;]*))\s*;(?![^(]*\)))/g);
        }

        /* Parse CSS variables. */
        var parsedVars = {};
        for(var i in foundVars){
            if(typeof foundVars[i] !== "object" || !foundVars[i]) continue;
            for(var j = foundVars[i].length - 1; j >= 0; j--){
                var curVar = foundVars[i][j].split(/:(?![^(]*\))/);
                parsedVars[curVar[0]] = curVar[1].split(/;(?![^(]*\))/)[0];
            }
        }

        /* Replace CSS variables. */
        for(var i in styleElements){
            if(typeof styleElements[i].innerHTML !== "string") continue;
            for(var j in parsedVars){
                var regex = new RegExp("var\\(\\s*" + j + "\\s*\\)", "g");
                styleElements[i].innerHTML = styleElements[i].innerHTML.replace(regex, parsedVars[j]);
            }
        }
    }
}

/* Page load events for IE 9+ and everyone else. */
if(document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    cssVars();
}else{
    document.addEventListener("DOMContentLoaded", cssVars);
}
