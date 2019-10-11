
function Session(bytes)
{
	this.bytes = bytes;
	this.finalNibble = "";
}
{
	// dom

	Session.prototype.domElementUpdate = function()
	{
		var nibblesPerRow = 32;
		var bytesPerRow = nibblesPerRow / 2;

		if (this.domElement == null)
		{
			var d = document;

			var divSession = d.createElement("div");

			var rowCount = 32;

			var textareaOffsets = d.createElement("textarea")
			textareaOffsets.cols = 8;
			textareaOffsets.rows = rowCount;
			textareaOffsets.disabled = true;
			textareaOffsets.style.resize = "none";
			textareaOffsets.spellcheck = false;
			this.textareaOffsets = textareaOffsets;
			divSession.appendChild(textareaOffsets);

			var textareaHexadecimal = d.createElement("textarea");
			textareaHexadecimal.rows = rowCount;
			textareaHexadecimal.onkeyup = this.textareaHexadecimal_KeyUp.bind(this);
			textareaHexadecimal.oninput = this.textareaHexadecimal_Changed.bind(this);
			textareaHexadecimal.style.resize = "none";
			textareaHexadecimal.spellcheck = false;
			this.textareaHexadecimal = textareaHexadecimal;
			divSession.appendChild(textareaHexadecimal);

			var textareaASCII = d.createElement("textarea");
			textareaASCII.cols = bytesPerRow - 1; // Not sure why -1 is needed.
			textareaASCII.rows = rowCount;
			textareaASCII.disabled = true;
			textareaASCII.style.resize = "none";
			textareaASCII.spellcheck = false;
			this.textareaASCII = textareaASCII;
			divSession.appendChild(textareaASCII);

			var divFileOperations = d.createElement("div");

			var buttonSave = d.createElement("button");
			buttonSave.innerHTML = "Save";
			buttonSave.onclick = this.buttonSave_Clicked.bind(this);
			divFileOperations.appendChild(buttonSave);

			var inputFileToLoad = d.createElement("input");
			inputFileToLoad.type = "file";
			inputFileToLoad.onchange = this.inputFileToLoad_Changed.bind(this);
			divFileOperations.appendChild(inputFileToLoad);

			divSession.appendChild(divFileOperations);

			var divCursor = d.createElement("div");

			var labelCursorPosition = d.createElement("label");
			labelCursorPosition.innerHTML = "Cursor Position:";
			divCursor.appendChild(labelCursorPosition);

			var inputCursorPosition = d.createElement("input");
			inputCursorPosition.disabled = true;
			this.inputCursorPosition = inputCursorPosition;
			divCursor.appendChild(inputCursorPosition);

			divSession.appendChild(divCursor);

			var divMain = d.getElementById("divMain");
			divMain.appendChild(divSession);

			this.domElement = divSession;
		}

		var textareaHexadecimalWidthInColumns = nibblesPerRow - 1; // Not sure why -1 is needed.
		if (this.textareaHexadecimal.scrollHeight > this.textareaHexadecimal.clientHeight)
		{
			var scrollbarWidthInChars = 2;  // May be 3 on some systems?
			textareaHexadecimalWidthInColumns += scrollbarWidthInChars;
		}
		this.textareaHexadecimal.cols = textareaHexadecimalWidthInColumns;

		var bytesAsStringHexadecimal = Converter.bytesToStringHexadecimal
		(
			this.bytes
		);
		this.textareaHexadecimal.value =
			bytesAsStringHexadecimal + this.finalNibble;

		var charsPerByte = 2;
		var cursorPos = Math.floor(this.textareaHexadecimal.selectionStart / charsPerByte);
		var cursorPosAsString =
			"0x" + cursorPos.toString(16)
			+ "; 0d" + cursorPos
			+ "; 0b" + cursorPos.toString(2);

		this.inputCursorPosition.value = cursorPosAsString;

		var rowsVisible = this.textareaHexadecimal.rows;
		var rowHeightInPixels = this.textareaHexadecimal.offsetHeight / rowsVisible;
		var scrollOffsetInPixels = this.textareaHexadecimal.scrollTop;
		var scrollOffsetInRows = Math.round(scrollOffsetInPixels / rowHeightInPixels);
		var scrollOffsetInBytes = scrollOffsetInRows * bytesPerRow;
		var offsetsAsStrings = [];
		var bytesForRowsAsASCII = [];
		for (var i = 0; i < rowsVisible; i++)
		{
			var offsetForRow = scrollOffsetInBytes + (i * bytesPerRow);
			var offsetForRowAsHexadecimal = offsetForRow.toString(16)
			offsetsAsStrings.push(offsetForRowAsHexadecimal);

			var bytesForRow = this.bytes.slice(offsetForRow, offsetForRow + bytesPerRow);
			var bytesForRowAsASCII = Converter.bytesToStringASCII(bytesForRow)
			bytesForRowsAsASCII.push(bytesForRowAsASCII);
		}
		var offsetsAsString = offsetsAsStrings.join("\n");
		this.textareaOffsets.value = offsetsAsString;

		var bytesAsStringASCII = bytesForRowsAsASCII.join("\n");
		this.textareaASCII.value = bytesAsStringASCII;

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
		var keyName = event.key;
		if (keyName.startsWith("Arrow") || keyName == "Home" || keyName == "End")
		{
			this.domElementUpdate();
		}
	}

}
