// Include global
require('./global.js');

// Create Twitter Bot
var BOT = new TWITTERBOT
({
	'consumer_secret' : CONSUMER_SECRET,
	'consumer_key' : CONSUMER_KEY,
	'access_token' : ACCESS_TOKEN,
	'access_token_secret' : ACCESS_TOKEN_SECRET,
});

// Bind Bot to mention stream
var MENTIONS_STREAM_ACTION = new TWITTERBOTSTREAMACTION(null, BOT);
	MENTIONS_STREAM_ACTION.setStreamPath('user');
	MENTIONS_STREAM_ACTION.listen('Listening', function(tweet)
	{
		// Filter tweets to get if our bot is mentionned
		// If bot is mentionned in a tweet and it is alone
		if(tweet.entities.user_mentions.length === 1 && tweet.entities.user_mentions[0].screen_name.toLowerCase() === BOT_USERNAME.toLowerCase())
		{
			return true;
		}
		return false;
	},
	function(twitter, action, tweet)
	{
		// Function is called when previous one return true
		// Here starts the game

		// Compute the tweet
		// Get only the text to lowercase (suppress the mention)
		var TEXT = tweet.text.toLowerCase().replace('@' + BOT_USERNAME + ' ', '').toLowerCase();

		// COMMANDS :
		// 		jouer! => Start a new game
		//		[A-Za-z]{1} => Propose a letter
		// 		Everything else => Nothing

		// Respond to the TEXT command
		if(TEXT.indexOf('jouer!') > -1) 
		{
			// Start a new Game
			GAMES[tweet.user.id] = new CORE.GAME(tweet.user.screen_name);

			// Send sentence to user
			var REPLY_TWEET = GAMES[tweet.user.id].getTweet();
			BOT.reply(REPLY_TWEET, tweet);
		}
		else
		{
			if(TEXT.length  === 1 && LETTER_REGEXP.test(TEXT))
			{
				// Get if the letter is in question
				// Verify user has a already started a game
				if(typeof(GAMES[tweet.user.id]) !== 'undefined' && GAMES[tweet.user.id] !== null)
				{
					// A letter has been sent.
					GAMES[tweet.user.id].askLetter(TEXT);

					// Send sentence to user
					var REPLY_TWEET = GAMES[tweet.user.id].getTweet();
					BOT.reply(REPLY_TWEET, tweet);

					if(GAMES[tweet.user.id].finished === true)
					{
						// Delete User game
						delete GAMES[tweet.user.id];
					}
				}
				else
				{
					// No game started
					// Ask user to send the 'jouer!' command
					BOT.reply('@' + tweet.user.screen_name + "\nVous n'avez pas de partie en cours.\nPour commencer envoyez 'jouer!'", tweet);
				}
			}
			else
			{
				// First we'll verify that a game exists
				// If it does we ask for the whole word
				// Else we ask for something else
				if(typeof(GAMES[tweet.user.id]) !== 'undefined' && GAMES[tweet.user.id] !== null)
				{
					// A word has been sent.
					GAMES[tweet.user.id].askWord(TEXT);

					// Send sentence to user
					var REPLY_TWEET = GAMES[tweet.user.id].getTweet();
					BOT.reply(REPLY_TWEET, tweet);

					if(GAMES[tweet.user.id].finished === true)
					{
						// Delete User game
						delete GAMES[tweet.user.id];
					}
				}
				else
				{
					// Ask for something else
					// Send "I haven't understood (in French)"
					BOT.reply('@' + tweet.user.screen_name + "\nJe n'ai pas compris !", tweet);
				}
			}
		}
	});
	MENTIONS_STREAM_ACTION.start();