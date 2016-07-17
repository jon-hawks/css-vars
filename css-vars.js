// CSS variables polyfill; enables support for CSS variables on older browsers.
// Author: Jon Hawks

// Page load events for IE and everyone else.
document.addEventListener('readystatechange', function(){ if(document.readyState === 'complete') cssVars() });
window.onload = cssVars();

function cssVars(){
	if(typeof window.CSS !== 'function' || typeof window.CSS.supports !== 'function' || !window.CSS.supports('(--property: value)')){
		// Get all of the stylesheets.
		var styleElements = document.getElementsByTagName('style');
		
		// Find CSS variables.
		var foundVars = {};
		for(var i = styleElements.length - 1; i >= 0; i--){
			if(typeof styleElements[i].innerHTML !== 'string') continue;
			foundVars[i] = styleElements[i].innerHTML.match(/(--[^;)]+:.+;)/g);
		}
		
		// Parse CSS variables.
		var parsedVars = {};
		for(var i in foundVars){
			if(foundVars[i] !== 'object' && !foundVars[i]) continue;
			for(var j = foundVars[i].length - 1; j >= 0; j--){
				var curVar = foundVars[i][j].split(/:/);
				parsedVars[curVar[0]] = curVar[1].split(/;/)[0];
			}
		}
		
		// Replace CSS variables.
		for(var i in styleElements){
			if(typeof styleElements[i].innerHTML === 'undefined') continue;
			for(var j in parsedVars){
				var regex = new RegExp('var\\(\\s*' + j + '\\s*\\)', 'g');
				styleElements[i].innerHTML = styleElements[i].innerHTML.replace(regex, parsedVars[j]);
			}
		}
	}
}