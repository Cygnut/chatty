
/*
	Subbot interface:
	
	send = function(content, to)
		Callback to send a response. Leave to unset to issue it to no specific user.
	name
		Should provide the subbot's name. This name should begin with '~'.
	description
		Should describe the subbot.
	function onEnabled(on) - optional [function enable(on)]
		If on = true, then starts the subbot, else stops the subbot.
		Should be used by subbots that work in the background.
	function getTests()
		Get tests as an array of strings.
	function onNewMessage(msg)
		Called whenever a new non-subbot message is added.
		msg = 
		{
			content - the content of the message.
			from - originator of the message.
			directed - boolean: true if directed at that particular subbot, else not directed at a subbot.
		}
*/

function Subbot(settings)
{
	this.name = '~' + settings.name;
	this.description = settings.description;
	// Indicates ability to be disabled. Defaults to true.
	this.disableable = settings.hasOwnProperty("disableable") ? settings.disableable : true;
	
	this.enabled = false;
	
	this.enable = function(on)
	{
		//console.log(this.disableable)
		//console.log(!on && !this.disableable)
		
		// If we're not allowed to disable this Subbot, then we're done.
		if (!on && !this.disableable) return;
		
		console.log((on ? 'Enabling' : 'Disabling') + ' ' + this.name);
		
		this.enabled = on;
		if (this.onEnabled)
			this.onEnabled(on);
	}
}

module.exports.Subbot = Subbot;