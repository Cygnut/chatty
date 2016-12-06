const fs = require('fs');

// TODO: Pass url in here.
//TODO: describe subbots.config syntax here.
function SubbotLoader(configFilepath, subbotsDir)
{
	this.configFilepath = configFilepath;
	this.subbotsDir = subbotsDir;
	// Only pick up files which have at least one character before Subbot.js.
	this.SUBBOT_REGEX = /.+Subbot.js/;
}

// TODO: Error handling


// Combine all settings in the pods provided.
function combineSettings(common, specific)
{
	var combined = {};
	
	// Copy common into combined to start with.
	for (var prop in common)
		if (common.hasOwnProperty(prop))
			// Iterate over all of common's own properties.
			combined[prop] = common[prop];
	
	// If specific has nothing, then we're done.
	if (specific === null || specific === undefined)
		return combined;
	
	for (var property in specific) {
		if (specific.hasOwnProperty(property)) {
			// Iterate over all of specific's own properties.
			
			// If there's a clash between the properties that common and specific has, use common.
			if (combined.hasOwnProperty(property)) 
				continue;
			
			// Otherwise, add the properties from specific
			combined[property] = specific[property];
		}
	}
	
	return combined;
}

SubbotLoader.prototype.fromConfigFile = function(commonSettings)
{
	// Load the config file
	var config = JSON.parse(
		fs.readFileSync(this.configFilepath, 'utf8')
	);
	
	var filenames = fs.readdirSync(this.subbotsDir);
	
	var subbots = [];
	
	filenames.forEach(function(filename) {
		
		// Only  load files which have match the filename pattern.
		if (!filename.match(this.SUBBOT_REGEX))
			return;
		
		var r = null;
		
		try
		{
			r = require(this.subbotsDir + '/' + filename);
		}
		catch (err)
		{
			console.log('Failed to load subbot source at ' + filename + '.' + err);
			return;
		}
		
		if (!r) return;
		
		// Strip '.js' to get the name of the class to index with into the config file.
		var className = filename.slice(0, -3);
		
		// Get the subbot specific settings for this subbot.
		var subbotConfig = config.subbots.find(function(subbot) {
			return subbot.name === className;
		}.bind(this));
		
		var subbotSettings = subbotConfig ? subbotConfig.settings : {};
		
		var settings = combineSettings(commonSettings, subbotSettings);
		
		// Instantiate the subbot.
		var s = null;
		
		try
		{
			s = new r(settings);
			console.log('Loaded subbot ' + className);
		}
		catch (err)
		{
			console.log('Failed to load subbot ' + className + '.' + err);
			return;
		}
		
		if (!s) return;
		
		subbots.push(s);
		
	}.bind(this));
	
	return subbots;
}

module.exports.SubbotLoader = SubbotLoader;