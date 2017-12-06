 
function Session(bytes)
{
    this.bytes = bytes;
    this.finalNibble = "";
}
{
    // dom
 
    Session.prototype.domElementUpdate = function()
    {
        if (this.domElement == null)
        {
            var divSession = document.createElement("div");
 
            var textareaHexadecimal = document.createElement("textarea");
            textareaHexadecimal.cols = 40;
            textareaHexadecimal.rows = 10;
            textareaHexadecimal.onkeyup = this.textareaHexadecimal_KeyUp.bind(this);
            textareaHexadecimal.oninput = this.textareaHexadecimal_Changed.bind(this);
            this.textareaHexadecimal = textareaHexadecimal;
            divSession.appendChild(textareaHexadecimal);
 
            var textareaASCII = document.createElement("textarea");
            textareaASCII.cols = 20;
            textareaASCII.rows = 10;
            textareaASCII.disabled = true;
            this.textareaASCII = textareaASCII;
            divSession.appendChild(textareaASCII);
 
            var divFileOperations = document.createElement("div");
         
            var buttonSave = document.createElement("button");
            buttonSave.innerHTML = "Save";
            buttonSave.onclick = this.buttonSave_Clicked.bind(this);
            divFileOperations.appendChild(buttonSave);
 
            var inputFileToLoad = document.createElement("input");
            inputFileToLoad.type = "file";
            inputFileToLoad.onchange = this.inputFileToLoad_Changed.bind(this);
            divFileOperations.appendChild(inputFileToLoad);
 
            divSession.appendChild(divFileOperations);
 
            var divCursor = document.createElement("div");
             
            var labelCursorPosition = document.createElement("label");
            labelCursorPosition.innerHTML = "Cursor Position:";
            divCursor.appendChild(labelCursorPosition);
 
            var inputCursorPosition = document.createElement("input");
            inputCursorPosition.disabled = true;
            this.inputCursorPosition = inputCursorPosition;
            divCursor.appendChild(inputCursorPosition);
 
            divSession.appendChild(divCursor);
 
            var divMain = document.getElementById("divMain");
            divMain.appendChild(divSession);
 
            this.domElement = divSession;
        }
 
        var bytesAsStringHexadecimal = Converter.bytesToStringHexadecimal
        (
            this.bytes
        );
        this.textareaHexadecimal.value = 
            bytesAsStringHexadecimal + this.finalNibble;
 
        var bytesAsStringASCII = Converter.bytesToStringASCII
        (
            this.bytes
        );
        this.textareaASCII.value = bytesAsStringASCII;
 
        var cursorPos = this.textareaHexadecimal.selectionStart;
        var cursorPosAsString = 
            "0d" + cursorPos 
            + "; 0x" + cursorPos.toString(16)
            + "; 0b" + cursorPos.toString(2);
 
        this.inputCursorPosition.value = cursorPosAsString;
 
        return this.domElement;
    }
 
    // events
 
    Session.prototype.buttonSave_Clicked = function()
    {
        var dataAsArrayBuffer = new ArrayBuffer(this.bytes.length);
        var dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
        for (var i = 0; i < this.bytes.length; i++) 
        {
            dataAsArrayUnsigned[i] = this.bytes[i];
        }
        var dataAsBlob = new Blob([dataAsArrayBuffer], {type:'bytes'});
 
 
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(dataAsBlob);
        link.download = "Data.bin";
        link.click();
    }
 
    Session.prototype.inputFileToLoad_Changed = function(event)
    {
        var inputFileToLoad = event.target;
        var fileToLoad = inputFileToLoad.files[0];
        if (fileToLoad != null)
        {
            var fileReader = new FileReader();
            fileReader.onload = this.inputFileToLoad_Changed_Loaded.bind(this); 
            fileReader.readAsBinaryString(fileToLoad);
        }
    }
 
    Session.prototype.inputFileToLoad_Changed_Loaded = function(fileLoadedEvent) 
    {
        var dataAsBinaryString = fileLoadedEvent.target.result;
 
        this.bytes = [];
 
        for (var i = 0; i < dataAsBinaryString.length; i++)
        {
            var byte = dataAsBinaryString.charCodeAt(i);
            this.bytes.push(byte);
        }
 
        this.domElementUpdate();
    }
 
    Session.prototype.textareaHexadecimal_Changed = function(event)
    {
        var bytesAsStringHexadecimal = event.target.value;
        this.bytes = Converter.stringHexadecimalToBytes
        (
            bytesAsStringHexadecimal
        );
 
        if (bytesAsStringHexadecimal.length % 2 == 0)
        {
            this.finalNibble = "";
        }
        else
        {
            this.finalNibble = bytesAsStringHexadecimal.substr
            (
                bytesAsStringHexadecimal.length - 1,
                1
            );
 
            var finalNibbleAsInt = parseInt(this.finalNibble, 16);
            if (isNaN(finalNibbleAsInt) == true)
            {
                this.finalNibble = "";
            }
        }
 
        this.domElementUpdate();
    }
 
    Session.prototype.textareaHexadecimal_KeyUp = function(event)
    {
        if (event.key.startsWith("Arrow") == true)
        {
            this.domElementUpdate();
        }
    }
 
}
