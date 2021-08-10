var gamestage = "ask for number of players";
var numOfPlayersCheckedIn = 0;
var numberOfPlayers = 0;

var deck = [];
var shuffledDeck = [];
var playerName = "";
var dealerName = "";

//players data would consists of their cards(both face up and hidden), their face up cards, their current points , their win count.
var playersData = [];

//everyone is dealt face up card
// everyone except dealer is given another face up card except computer gets it face
//number = score, aces = 1 (currently), jack king queen =10
//if score = 21 , it is an automatic win
// if want another card, say hit, no limit to card u can ask for
// if u dont want anymore cards, say stay
// once the round has ended, delaer shall flip the facedown card
//if its 16 and below, they need to take another card

// make a scoreboard
var makeScoreBoard = function () {
  var scoreBoard = `<br><br>${dealerName} points : ${dealerPoints}<br>
  ${playerName} points : ${playerPoints}<br>
  ${dealerName} win count : ${DealerWinCount}<br>
  ${playerName} win count : ${playerWinCount}   `;
  return scoreBoard;
};

// make the deck of 52 cards
var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  var names = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];
  // rank 1 - 13
  // suits hearts diamonds clubs spades
  // ace 2-10 jack queen king

  for (index = 0; index < suits.length; index += 1) {
    var currentSuit = suits[index];
    for (i = 0; i < names.length; i += 1) {
      var currentName = names[i];
      if (currentName == "ace") {
        var currentScore = 11;
        //by default
      } else if (currentName == "jack" || currentName == "queen" || currentName == "king") {
        var currentScore = 10;
      } else if (currentName != NaN) {
        var currentScore = currentName;
      }
      var card = {
        name: currentName,
        suit: currentSuit,
        score: currentScore,
      };
      cardDeck.push(card);
    }
  }
  return cardDeck;
};
// function that randomly shuffles the deck
var shuffleTheDeck = function (deck) {
  for (i = 0; i < deck.length; i += 1) {
    var randomNumber = Math.random() * deck.length;
    var randomInteger = Math.floor(randomNumber);
    var currentCard = deck[i];
    var randomCard = deck[randomInteger];
    deck[i] = randomCard;
    deck[randomInteger] = currentCard;
  }
  return deck;
};
//function that actually calculates the score of the cards in the players hand
var calcPlayerScore = function () {
  var playerScore = 0;
  var playerNumberOfAces = 0;
  for (i = 0; i < PlayerCards.length; i += 1) {
    if (PlayerCards[i].name == "ace") {
      playerNumberOfAces += 1;
    }
    playerScore += PlayerCards[i].score;
  }
  if (playerScore > 21) {
    for (i = 0; i < playerNumberOfAces; i += 1) {
      playerScore -= 10;
    }
  }
  return playerScore;
};

//function that calculate the score of the dealer cards after his hidden cards are revealed

var calcDealerScore = function () {
  var dealerScore = 0;
  var dealerNumberOfAces = 0;
  for (i = 0; i < dealerCards.length; i += 1) {
    if (dealerCards[i].name == "ace") {
      dealerNumberOfAces += 1;
    }
    dealerScore += dealerCards[i].score;
  }
  if (dealerScore > 21) {
    for (i = 0; i < dealerNumberOfAces; i += 1) {
      dealerscore -= 10;
    }
  }
  return dealerScore;
};

var givePlayerCard = function () {
  var playerDraws = shuffledDeck.pop();
  PlayerCards.push(playerDraws);
  PlayerFaceUp.push(`${playerDraws.name} of ${playerDraws.suit}`);
};
var giveDealerCard = function () {
  var dealerDraws = shuffledDeck.pop();
  dealerCards.push(dealerDraws);
  if (dealerCards.length == 1) {
    dealerFaceUp.push(`${dealerDraws.name} of ${dealerDraws.suit}`);
  } else if (dealerCards.length > 1) {
    dealerFaceUp.push("hidden card");
  }
};
var main = function (input) {
  deck = makeDeck();
  shuffledDeck = shuffleTheDeck(deck);
  //both player and computer gets dealt one card each
  if (gamestage == "ask for number of players") {
    gamestage = "ask for player name";
    numberOfPlayers = Number(input);
    outputvalue = "May the first player now enter his/her name!😊";
  } else if (gamestage == "ask for player name") {
    currentPlayerName = input;
    var player = {
      name: currentPlayerName,
      wincount: 0,
      points: 100,
    };
    playersData.push(player);

    gamestage = "ask for player wager";
    outputvalue = `Hi ${input}! you are now a player ▶! <br> <br> ${playersData[numOfPlayersCheckedIn].name}, please enter the amount of points you want to wager`;
  } else if (gamestage == "ask for player wager") {
    currentPlayerWager = input;
    playersData[numOfPlayersCheckedIn].wager = currentPlayerWager;
    numOfPlayersCheckedIn += 1;
    if (numOfPlayersCheckedIn < numberOfPlayers) {
      gamestage = "ask for player name";
      outputvalue = `${playersData[numOfPlayersCheckedIn].name}, you have decided to wager ${currentPlayerWager} points! <br><br>May player ${numOfPlayersCheckedIn + 1} now enter his/her name!😊`;
    } else if (numOfPlayersCheckedIn == numberOfPlayers) {
      gamestage = "ask for dealer name";
      outputvalue = `${playersData[numOfPlayersCheckedIn].name}, you have decided to wager ${currentPlayerWager} points! <br><br> It is now the dealer's turn 🤝to enter his/her name!`;
    }
  } else if (gamestage == "ask for dealer name") {
    dealerName = input;
    gamestage = "ask for dealer wager";
    outputvalue = `Hi ${input}! you are now the dealer 🤝 of the game <br> <br> ${dealerName}, please enter the amount of points you want to wager`;
  } else if (gamestage == "ask for dealer wager") {
    gamestage = "dealing 1st card";
    dealerWager = Number(input);
    outputvalue = `${dealerName}, you have decided to wager ${dealerWager} points! <br><br> Click "submit" to start the game and let the player start his turn!🃏🎰`;
  } else if (gamestage == "dealing 1st card") {
    for (i = 0; i < 2; i += 1) {
      giveDealerCard();
      givePlayerCard();
    }
    //check if either dealer or player has score 21
    var playerscore = calcPlayerScore();
    console.log("player score= " + playerscore);
    var dealerscore = calcDealerScore();
    console.log("dealer score = " + dealerscore);
    //outputvalue for if there are no naturals
    var outputvalue = `Your player ▶ cards are ${PlayerFaceUp} <br>  the dealer🤝 cards are ${dealerFaceUp}! <br><br>you the player ▶ can continue the game by choosing to "hit" or "stay".  `;
    if (playerscore == 21) {
      //player21 = true;
      if (dealerscore == 21) {
        //dealer21 = true;
        outputvalue = "there is a draw";
      } else if (dealerscore != 21) {
        // player wins here
        playerPoints += dealerWager;
        dealerPoints -= dealerWager;
        playerWinCount += 1;
        outputvalue = "player ▶ has won by scoring 21 and dealer 🤝 did not score 21" + makeScoreBoard();
      }
    }
    gamestage = "player hit stay";
    //dealer choose hit or stay , there are win or lose outcomes here to sift
  } else if (gamestage == "player hit stay") {
    //player opts to hit so deal that guy a card!
    if (input == "hit") {
      givePlayerCard();
      var playerscore = calcPlayerScore();
      console.log(`player score = ` + playerscore);
      if (playerscore > 21) {
        // dealer wins here
        DealerWinCount += 1;
        playerPoints -= playerWager;
        dealerPoints += playerWager;
        outputvalue = "OH NO! you the player ▶ have busted the score of 21" + makeScoreBoard();
      } else if (playerscore == 21) {
        //player wins here
        playerPoints += dealerWager;
        dealerPoints -= dealerWager;
        playerWinCount += 1;
        outputvalue = "YAY! you the player ▶ have won because you scored 21" + makeScoreBoard();
      } else if (playerscore < 21) {
        outputvalue = `you the player ▶ have not hit 21.<br> <br>Your cards are ${PlayerFaceUp} <br>the dealer 🤝 cards are ${dealerFaceUp}!<br><br>you can continue to choose "hit" or "stay"`;
      }
    } else if (input == "stay") {
      gamestage = "dealer hit stay";
      //remove all the 'hidden cards' from the face up array
      while (dealerFaceUp.length > 1) {
        dealerFaceUp.pop();
      }
      var counter = 1;
      //replace the hidden cards with legit cards
      while (dealerFaceUp.length < dealerCards.length) {
        dealerFaceUp.push(`${dealerCards[counter].name} of ${dealerCards[counter].suit}`);
        counter += 1;
      }

      outputvalue = "it is now the dealer's turn 🤝 to choose 'hit' or 'stay'" + `<br><br>the dealer's cards are ${dealerFaceUp}`;
    }
    //
  } else if (gamestage == "dealer hit stay") {
    if (input == "hit") {
      giveDealerCard();
      var dealerscore = calcDealerScore();
      console.log(`dealer score = ` + dealerscore);
      if (dealerscore > 21) {
        //dealer loses here and player wins
        playerPoints += dealerWager;
        dealerPoints -= dealerWager;
        playerWinCount += 1;
        outputvalue = "OH NO! you the dealer 🤝 have busted the score of 21" + makeScoreBoard();
      } else if (dealerscore == 21) {
        //dealer wins here
        DealerWinCount += 1;
        playerPoints -= playerWager;
        dealerPoints += playerWager;
        outputvalue = "YAY! you the dealer 🤝 have won because you scored 21" + makeScoreBoard();
      } else if (dealerscore < 21) {
        outputvalue = `you the dealer 🤝 have not hit 21.<br> <br>player's cards ▶ are ${PlayerFaceUp} <br>your cards 🤝 are ${dealerFaceUp}!<br><br>you can continue to choose "hit" or "stay"`;
      }
    } else if (input == "stay") {
      gamestage = "comparison";
      outputvalue = "click 'submit' to compare the total score of the cards";
    }
    // comparison to find the winner if no one has busts yet
  } else if (gamestage == "comparison") {
    var playerscore = calcPlayerScore();
    var dealerscore = calcDealerScore();

    if (playerscore > dealerscore) {
      // player wins here
      playerPoints += dealerWager;
      dealerPoints -= dealerWager;
      playerWinCount += 1;
      winner = "the player ▶ win!";
    } else if (playerscore < dealerscore) {
      //dealer wins here
      DealerWinCount += 1;
      playerPoints -= playerWager;
      dealerPoints += playerWager;
      winner = "The dealer 🤝 wins !";
    } else if (playerscore == dealerscore) {
      winner = "There is a draw!";
    }
    outputvalue = winner + `<br>player's cards ▶ are ${PlayerFaceUp} <br>the dealer cards 🤝 are ${dealerFaceUp}!` + makeScoreBoard();
  }
  return outputvalue;
};
