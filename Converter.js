 
// classes
 
function Converter()
{
    // static class
}

{
    Converter.PrintableCharacters = 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        + "abcdefghijklmnopqrstuvwxyz"
        + "0123456789"
		+ "!@#$%^&*()"
		+ "`-=[]\\;',./"
		+ "~_+{}|:\"<>?";
 
    Converter.bytesToStringASCII = function(bytes)
    {
        var returnValue = "";
 
        for (var i = 0; i < bytes.length; i++)
        {
            var byte = bytes[i];
            var byteAsCharASCII = String.fromCharCode
            (
                byte
            );
 
            if (Converter.PrintableCharacters.indexOf(byteAsCharASCII) == -1)
            {
                byteAsCharASCII = ".";  
            }
 
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
