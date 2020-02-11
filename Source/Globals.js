
function Globals()
{
	// do nothing
}

{
	Globals.Instance = new Globals();
	
	Globals.prototype.initialize = function(session)
	{
		this.session = session;
		this.session.domElementUpdate();
	}
}
