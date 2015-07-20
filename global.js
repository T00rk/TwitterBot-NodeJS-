// -- INCLUDE LIBS -- //

global.TWITTERBOT 				= require('node-twitterbot').TwitterBot;
global.TWITTERBOTSTREAMACTION 	= require('node-twitterbot').TwitterBotStreamAction;

global.BOT_USERNAME				= ''; // Set your twitter account USERNAME

global.CONSUMER_SECRET 			= ''; // TWITTER API CONSUMER_SECRET
global.CONSUMER_KEY 			= ''; // TWITTER API CONSUMER_KEY
global.ACCESS_TOKEN 			= ''; // TWITTER API ACCESS_TOKEN
global.ACCESS_TOKEN_SECRET 		= ''; // TWITTER API ACCESS_TOKEN_SECRET

global.GAMES 					= [];
global.CORE 					= require('./core.js');
global.SENTENCES				= require('./sentences.js');

global.LETTER_REGEXP 			= new RegExp("^[A-Za-z]{1,1}");
global.MAX_LIVES 				= 5;

// http://fr.piliapp.com/twitter-symbols/
global.SIGNS 					= 
{
	// Symbole for LIFE
	L : '❤',
	// Symbole for empty LIFE
	D : '💔',
	// Symbole for user has Won
	W : '🏆',
	// Symbole for LOSE
	P : '😟'
}

global.getRandomId				= function(max, min)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

String.prototype.replaceAt = function(index, char)
{
	return this.substr(0, index) + char + this.substr(index + char.length);
};

// Add the reply function to TWITTERBOT
// It sets tweet id to in_reply_to_status_id property
TWITTERBOT.prototype.reply = function(text, tweet, callback)
{
	if (typeof text !== "string")
	{
		return callback
		({
			message: "Cannot post a non-string"
		}, null);
	}
	return this.twitter.post("statuses/update",
	{
			status: text,
			in_reply_to_status_id : tweet.id_str
	}, function(err, response) 
	{
		if (callback && typeof callback === "function") 
		{
			return callback(err, response);
		}
	});
};