// -- GAME OBJECT -- //

var GAME = function(tsn)
{
	// Game status
	this.finished = false;
	// Date of game start
	this.START = new Date();
	// Twitter user screen name
	this.USER = tsn;
	// 3 Lives
	this.LIVES = MAX_LIVES;
	// Letters User has already asked for
	this.LETTERS = [];
	// Words User has already asked for
	this.WORDS = [];
	// Sentence to find
	this.SENTENCE =
	{
		// Asked Sentence
		A : '',
		// What user has found
		F : ''
	};

	// Init sentence
	this.initSentence();
};
GAME.prototype = 
{
	initSentence : function()
	{
		// Select a random sentence
		var SID = getRandomId(0, SENTENCES.length - 1);
		this.SENTENCE.A = SENTENCES[SID];

		// Replace all letters by a "-"
		for(var i = 0; i < this.SENTENCE.A.length; i++)
		{
			// Replace by a '-' only if that is a letter
			if(LETTER_REGEXP.test(this.SENTENCE.A[i]) === true)
			{
				this.SENTENCE.F += '-';
			}
			else
			{
				this.SENTENCE.F += this.SENTENCE.A[i];
			}
		}

		// IT WORKS !
		console.log(this.SENTENCE);
	},
	getTweet : function()
	{
		// Creates a tweet with the sentence
		var TWEET = "@" + this.USER + "\n";

		// If there are still letters to discover
		if(this.SENTENCE.F.indexOf('-') > -1)
		{
			// If User has lives remaining
			if(this.LIVES > 0)
			{		
				TWEET += this.getLivesToTweet() + "\n";		
				TWEET += this.SENTENCE.F;

				// Tweet Looks like
				// @user_name
				// ❤❤❤
				// ------ ------
			}
			else
			{
				// Game is Over
				TWEET += SIGNS.P + " PERDU !!! \n";
				TWEET += this.SENTENCE.A;
				this.finished = true;

				// Tweet Looks like
				// @user_name
				// PERDU
				// CORRECT ANSWER
			}
		}
		else
		{
			// USER HAS WON
			TWEET += SIGNS.W + " GAGNÉ !!! " + SIGNS.W;
			this.finished = true;
		}

		return TWEET;
	},
	getLivesToTweet : function()
	{
		var TEXT = '';

		for(var i = 0; i < MAX_LIVES; i++)
		{
			if(i < this.LIVES)
			{
				// If LIVES[i] is okay
				// Add a life symbole
				TEXT += SIGNS.L;
			}
			else
			{
				// Add an empty life symbole
				TEXT += SIGNS.D;
			}
		}

		return TEXT;
	},
	askLetter : function(letter)
	{
		// When user proposes a letter to the bot
		var LETTER = letter.toUpperCase();
		if(this.LETTERS.indexOf(LETTER) < 0)
		{
			var COUNT = 0;
			for(var i = 0; i < this.SENTENCE.A.length; i++)
			{
				if(this.SENTENCE.A[i] === LETTER)
				{
					COUNT++;
					this.SENTENCE.F = this.SENTENCE.F.replaceAt(i, LETTER);
				}
			}

			this.LETTERS.push(LETTER);

			// If letter has not been found in the sentence
			if(COUNT === 0)
			{
				this.LIVES --;
			}
		}
	},
	askWord : function(word)
	{
		var WORD = word.toUpperCase();
		if(this.WORDS.indexOf(WORD) < 0)
		{
			if(this.SENTENCE.A === WORD)
			{
				// That's the correct answer
				this.SENTENCE.F = WORD;
			}
			else
			{
				this.LIVES --;
			}

			this.WORDS.push(WORD);
		}
	}
};

module.exports.GAME = GAME;