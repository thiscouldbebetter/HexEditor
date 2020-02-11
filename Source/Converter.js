 
// classes
 
function Converter()
{
	// static class
}

{
	Converter.AsciiCharacters =
		"␀☺☻♥♦♣♠•◘○◙♂♀♪♫☼►" // 0-16
		+ "◄↕‼¶§▬↨↑↓→←∟↔▲▼␠" // 17-32
		+ "!\"#$%&'()*+,-./0" // 33-48
		+ "123456789:;<=>?@" // 49-64
		+ "ABCDEFGHIJKLMNOP" // 65-80
		+ "QRSTUVWXYZ[\\]^_`" // 81-96
		+ "abcdefghijklmnop" // 97-112
		+ "qrstuvwxyz{|}~⌂Ç" // 113-128
		+ "üéâäàåçêëèïîìÄÅÉ" // 129-144
		+ "æÆôöòûùÿÖÜ¢£¥₧ƒá" // 145-160
		+ "óúñÑªº¿⌐¬½¼¡«»░▒" // 161-176
		+ "▒▓│┤╡╢╖╕╣║╗╝╜╛┐└" // 177-192
		+ "┴┬├─┼╞╟╚╔╩╦╠═╬╧╨" // 193-208
		+ "╤╥╙╘╒╓╫╪┘Ç█▄▌▐▀α" // 209-224
		+ "ßΓπΣσµτΦΘΩδ∞φε∩≡" // 225-240
		+ "±≥≤⌠⌡÷≈°∙·√ⁿ²■⍽"; //241-255 
 
	Converter.bytesToStringASCII = function(bytes)
	{
		var returnValue = "";
 
		for (var i = 0; i < bytes.length; i++)
		{
			var byte = bytes[i];
			var byteAsCharASCII = String.fromCharCode(Converter.AsciiCharacters.codePointAt(byte)); 
			returnValue += byteAsCharASCII;
		}
 
		return returnValue;
	}
 
	Converter.bytesToStringHexadecimal = function(bytes)
	{
		var returnValue = "";
 
		for (var i = 0; i < bytes.length; i++)
		{
			var byte = bytes[i];
			var byteAsStringHexadecimal = 
				byte.toString(16).padLeft(2, '0');
 
			returnValue += byteAsStringHexadecimal;
		}
 
		return returnValue;
	}
 
	Converter.stringHexadecimalToBytes = function(stringHexadecimal)
	{
		var returnValues = [];
 
		var nibblesForByteCurrent = [];
 
		for (i = 0; i < stringHexadecimal.length; i++)
		{
			var charForNibble = stringHexadecimal[i];
			var nibbleAsInt = parseInt(charForNibble, 16);
			if (isNaN(nibbleAsInt) == false)
			{
				nibblesForByteCurrent.push(nibbleAsInt);
				if (nibblesForByteCurrent.length == 2)
				{
					var byte = 
						(nibblesForByteCurrent[0] << 4) 
						+ nibblesForByteCurrent[1];
					returnValues.push(byte);
					nibblesForByteCurrent.length = 0;
				}
			}		   
		}
 
		return returnValues;
	}   
}
