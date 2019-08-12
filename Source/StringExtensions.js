 
// extensions
 
function StringExtensions()
{
	// extension class
}

{
	String.prototype.padLeft = function(lengthToPadTo, charToPadWith)
	{
		var thisPadded = this;
 
		while (thisPadded.length < lengthToPadTo)
		{
			thisPadded = 
				charToPadWith + thisPadded;
		}
 
		return thisPadded;
	}
}
