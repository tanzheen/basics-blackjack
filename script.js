var gamestage = "ask for number of players";
var numberOfPlayers = 0;
var numOfPlayersCheckedIn = 0;
var numOfPlayersCheckedTheirCards = 0;
var numOfPlayersChoseHitStay = 0;
var numOfplayersKnowOutcome = 0;
var deck = [];
var shuffledDeck = [];
var playerName = "";
var dealerName = "";

//players data would consists of their cards(both face up and hidden), their face up cards, their current points , their win count.
var playersData = [];
var dealerData = [];
var holdingroom = [];
//everyone is dealt face up card
// everyone except dealer is given another face up card except computer gets it face
//number = score, aces = 1 (currently), jack king queen =10
//if score = 21 , it is an automatic win
// if want another card, say hit, no limit to card u can ask for
// if u dont want anymore cards, say stay
// once the round has ended, delaer shall flip the facedown card
//if its 16 and below, they need to take another card

// make a scoreboard
// var makeScoreBoard = function () {
//   var scoreBoard = `<br><br>${dealerName} points : ${dealerPoints}<br>
//   ${playerName} points : ${playerPoints}<br>
//   ${dealerName} win count : ${DealerWinCount}<br>
//   ${playerName} win count : ${playerWinCount}   `;
//   return scoreBoard;
// };
var makeScoreBoard = function () {
  var scoreBoard = `The round has come to an end!🎇🎆<br> <br>Current scores: <br>`;
  for (i = 0; i < playersData.length; i += 1) {
    scoreBoard += `<br>Player : ${playersData[i].name}:<br>Cards in hand : ${playersData[i].cardsFaceUp}<br>Current points : ${playersData[i].points}<br>Current win count : ${playersData[i].wincount}<br>`;
  }
  scoreBoard += `<br> Dealer : ${dealerData[0].name}<br>Cards in Hand : ${dealerData[0].cardsFaceUp}<br>Current points : ${dealerData[0].points}<br>Current win count : ${dealerData[0].wincount}<br><br>Please click "submit" to reset the round!`;
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
var calcPlayerScore = function (numOfPlayersCheckedTheirCards) {
  var playerScore = 0;
  var playerNumberOfAces = 0;

  for (i = 0; i < playersData[numOfPlayersCheckedTheirCards].cardsInHand.length; i += 1) {
    //check for number of aces in the hand of the player
    if (playersData[numOfPlayersCheckedTheirCards].cardsInHand[i].name == "ace") {
      playerNumberOfAces += 1;
    }
    //count the value of each card 1 by 1
    playerScore += playersData[numOfPlayersCheckedTheirCards].cardsInHand[i].score;
  }
  //ace variable of 1 or 11 dependent on whether the score is more or less than 21
  if (playerScore > 21) {
    for (i = 0; i < playerNumberOfAces; i += 1) {
      playerScore -= 10;
      if (playerScore < 21) {
        break;
      }
    }
  }
  return playerScore;
};

//function that calculate the score of the dealer cards after his hidden cards are revealed

var calcDealerScore = function () {
  var dealerScore = 0;
  var dealerNumberOfAces = 0;

  for (i = 0; i < dealerData[0].cardsInHand.length; i += 1) {
    //check for the number of aces in the hand of the dealer
    if (dealerData[0].cardsInHand[i].name == "ace") {
      dealerNumberOfAces += 1;
    }
    //count the value of each card 1 by 1
    dealerScore += dealerData[0].cardsInHand[i].score;
  }
  //ace variable of 1 or 11 dependent on whether the score is more or less than 21
  if (dealerScore > 21) {
    for (i = 0; i < dealerNumberOfAces; i += 1) {
      dealerScore -= 10;
      if (dealerScore < 21) {
        break;
      }
    }
  }
  return dealerScore;
};
//function that deals the the current player one card
var givePlayerCard = function (numOfPlayersGivenCards) {
  var playerDraws = shuffledDeck.pop();
  playersData[numOfPlayersGivenCards].cardsInHand.push(playerDraws);
  playersData[numOfPlayersGivenCards].cardsFaceUp.push(`${playerDraws.name} of ${playerDraws.suit}`);
};
//function that deals the dealer one card
var giveDealerCard = function () {
  var dealerDraws = shuffledDeck.pop();
  dealerData[0].cardsInHand.push(dealerDraws);
  if (dealerData[0].cardsInHand.length == 2) {
    dealerData[0].cardsFaceUp.push("hidden card");
  } else {
    dealerData[0].cardsFaceUp.push(`${dealerDraws.name} of ${dealerDraws.suit}`);
  }
};
var main = function (input) {
  deck = makeDeck();
  shuffledDeck = shuffleTheDeck(deck);
  //ask for no of players
  if (gamestage == "ask for number of players") {
    gamestage = "ask for player name";
    numberOfPlayers = Number(input);
    outputvalue = "May the first player now enter his/her name!😊";
    //ask for player names
  } else if (gamestage == "ask for player name") {
    currentPlayerName = input;
    var player = {
      name: currentPlayerName,
      wincount: 0,
      points: 100,
      cardsInHand: [],
      cardsFaceUp: [],
      handValue: 0,
    };
    playersData.push(player);
    //move to ask for player wager
    gamestage = "ask for player wager";
    outputvalue = `Hi ${input}! you are now a player ▶! <br> <br> ${playersData[numOfPlayersCheckedIn].name}, please enter the amount of points you want to wager`;
    //ask for player wager here
  } else if (gamestage == "ask for player wager") {
    var currentPlayerWager = Number(input);
    playersData[numOfPlayersCheckedIn].wager = currentPlayerWager;
    numOfPlayersCheckedIn += 1;
    //if not all the players have entered thier name and wager, move the gamestage back to repeat for the rest of the players
    if (numOfPlayersCheckedIn < numberOfPlayers) {
      gamestage = "ask for player name";
      outputvalue = `${playersData[numOfPlayersCheckedIn - 1].name}, you have decided to wager ${currentPlayerWager} points! <br><br>May player ${numOfPlayersCheckedIn + 1} now enter his/her name!😊`;
      // when all the players have entered the name and wager, they shall move to ask for the dealer's name and wager
    } else if (numOfPlayersCheckedIn == numberOfPlayers) {
      gamestage = "ask for dealer name";
      outputvalue = `${playersData[numOfPlayersCheckedIn - 1].name}, you have decided to wager ${currentPlayerWager} points! <br><br> It is now the dealer's turn 🤝to enter his/her name!`;
    }
    //ask for dealer name
  } else if (gamestage == "ask for dealer name") {
    currentDealerName = input;
    var dealer = {
      name: currentDealerName,
      wincount: 0,
      points: 100,
      cardsInHand: [],
      cardsFaceUp: [],
    };
    dealerData.push(dealer);
    gamestage = "ask for dealer wager";
    outputvalue = `Hi ${input}! you are now the dealer 🤝 of the game <br> <br> ${currentDealerName}, please enter the amount of points you want to wager`;
    // ask for dealer wager
  } else if (gamestage == "ask for dealer wager") {
    gamestage = "dealing them cards";
    var currentDealerWager = Number(input);
    dealerData[0].wager = currentDealerWager;
    outputvalue = `${dealerData[0].name}, you have decided to wager ${currentDealerWager} points! <br><br> Click "submit" to start the game and let the players start their turn!🃏🎰`;
    // start giving out cards
  } else if (gamestage == "dealing them cards") {
    var numOfPlayersGivenCards = 0;
    // loop to go thru  every player to give them cards
    while (numOfPlayersGivenCards < numberOfPlayers) {
      // loop to give them 2 cards
      for (i = 0; i < 2; i += 1) {
        givePlayerCard(numOfPlayersGivenCards);
      }
      numOfPlayersGivenCards += 1;
    }
    //loop to give dealer 2 cards
    for (i = 0; i < 2; i += 1) {
      giveDealerCard();
    }
    outputvalue = `OH YES ALL THE CARDS HAVE BEEN DEALT!!!🔫🧨😍<br><br> Players, please check your cards for any possible blackjacks!🤑`;
    gamestage = "player check their cards";

    // all the players shall go thru their cards first to see for 21s
  } else if (gamestage == "player check their cards") {
    playersData[numOfPlayersCheckedTheirCards].handValue = calcPlayerScore(numOfPlayersCheckedTheirCards);
    //for all but the last player to check thier cards
    if (numOfPlayersCheckedTheirCards + 1 < numberOfPlayers) {
      //if the player gets blackjack, he ends his game and win the wager
      if (playersData[numOfPlayersCheckedTheirCards].handValue == 21) {
        outputvalue = `${playersData[numOfPlayersCheckedTheirCards].name}, your hand consist of ${playersData[numOfPlayersCheckedTheirCards].cardsFaceUp}! <br><br> NICE you have a blackjack!<br> You wull win 1.5x of your wager from ${dealerData[0].name}<br><br>Please click "submit for ${playersData[numOfPlayersCheckedTheirCards + 1].name} to check his/her hand`;
        // wager transfer
        playersData[numOfPlayersCheckedTheirCards].wincount += 1;
        playersData[numOfPlayersCheckedTheirCards].points += playersData[numOfPlayersCheckedTheirCards].wager * 1.5;
        dealerData[0].points -= playersData[numOfPlayersCheckedTheirCards].wager * 1.5;
        //player leaves table and wait for next round
        holdingroom[holdingroom.length] = playersData[numOfPlayersCheckedTheirCards];
        playersData.splice(numOfPlayersCheckedTheirCards, 1);
        numOfPlayersCheckedTheirCards -= 1;
        numberOfPlayers -= 1;
      } else {
        //player continues cos no 21
        outputvalue = `${playersData[numOfPlayersCheckedTheirCards].name}, your hand consist of ${playersData[numOfPlayersCheckedTheirCards].cardsFaceUp}! <br><br>You do not have a blackjack now! <br>Please click "submit for ${playersData[numOfPlayersCheckedTheirCards + 1].name} to check his/her hand`;
      }
      // for when the last player is checking
    } else if (numOfPlayersCheckedTheirCards + 1 == numberOfPlayers) {
      // that last player got 21!
      if (playersData[numOfPlayersCheckedTheirCards].handValue == 21) {
        outputvalue = `${playersData[numOfPlayersCheckedTheirCards].name}, your hand consist of ${playersData[numOfPlayersCheckedTheirCards].cardsFaceUp}! <br><br> NICE you have a blackjack!<br> You wull win 1.5x of your wager from ${dealerData[0].name} <br><br> Now lets continue with the game to choose whether to hit or stay!br> Let's start with ${playersData[0].name}'s turn!😜`;
        //wager transfer
        playersData[numOfPlayersCheckedTheirCards].wincount += 1;
        playersData[numOfPlayersCheckedTheirCards].points += playersData[numOfPlayersCheckedTheirCards].wager * 1.5;
        dealerData[0].points -= playersData[numOfPlayersCheckedTheirCards].wager * 1.5;
        // player leaves table and wiat for next round
        holdingroom[holdingroom.length] = playersData[numOfPlayersCheckedTheirCards];
        playersData.splice(numOfPlayersCheckedTheirCards, 1);
        numOfPlayersCheckedTheirCards -= 1;
        numberOfPlayers -= 1;
        gamestage = "player check cards again";
        //if the last player is oso the only player in the game
        if (playersData.length == 0) {
          outputvalue = "The round has ended because they are no players left!👋👋<br><br>click submit to see the scoreboard!";
          gamestage = "reset and show score";
        }
        // player continues
      } else {
        outputvalue = `${playersData[numOfPlayersCheckedTheirCards].name}, your hand consist of ${playersData[numOfPlayersCheckedTheirCards].cardsFaceUp}! <br><br> You do not have a blackjack now!<br> Now lets continue with the game to choose whether to hit or stay!<br> Lets start with ${playersData[0].name}'s turn!😜`;
        gamestage = "player check cards again";
      }
    }
    numOfPlayersCheckedTheirCards += 1;

    //one by one player check their cards to hit or stay
  } else if (gamestage == "player check cards again") {
    var currentPlayer = playersData[numOfPlayersChoseHitStay];
    outputvalue = `HI! ${currentPlayer.name}'s cards are ${currentPlayer.cardsFaceUp}🃏<br><br> Please choose to "hit" or "stay" `;
    gamestage = "player hit stay";
    //player chose hit or stay
  } else if (gamestage == "player hit stay") {
    //player opts to hit so deal that guy a card!
    var currentPlayer = playersData[numOfPlayersChoseHitStay];

    // player choose to hit stay here
    if (input == "hit") {
      givePlayerCard(numOfPlayersChoseHitStay);
      var playerscore = calcPlayerScore(numOfPlayersChoseHitStay);
      currentPlayer.handValue = playerscore;
      console.log(`player score = ` + playerscore);
      if (playerscore > 21) {
        // dealer wins here cos the player has busted 21
        dealerData[0].wincount += 1;
        currentPlayer.points -= currentPlayer.wager;
        dealerData[0].points += currentPlayer.wager;
        //+ makeScoreBoard();

        if (numOfPlayersChoseHitStay + 1 == numberOfPlayers) {
          outputvalue = `OH NO! you the player ▶ have busted the score of 21<br><br>it is now the dealer's turn 🤝 to 'hit' or 'stay'`;
          gamestage = "dealer reveal cards";
        } else {
          outputvalue = `OH NO! ${playersData[numOfPlayersChoseHitStay].name} the player ▶ have busted the score of 21<br>Your hand is ${playersData[numOfPlayersChoseHitStay].cardsFaceUp}<br>It is now ${playersData[numOfPlayersChoseHitStay + 1].name}'s turn to choose whether to hit or stay!😜`;
          // return to prev gamestage for next player
          gamestage = "player check cards again";
        }
        //player leaves after busting and wat for next roun
        holdingroom[holdingroom.length] = playersData[numOfPlayersChoseHitStay];
        playersData.splice(numOfPlayersChoseHitStay, 1);
        if (playersData.length == 0) {
          outputvalue += "<br><br>The round has ended because they are no players left!👋👋<br><br>click submit to see the scoreboard!";
          gamestage = "reset and show score";
        }
        numberOfPlayers -= 1;
      } else if (playerscore == 21) {
        //player wins here
        currentPlayer.points += currentPlayer.wager * 1.5;
        dealerData[0].points -= currentPlayer.wager * 1.5;
        currentPlayer.wager += 1;
        currentPlayer.wincount += 1;
        // return to prev gamestage for next player

        //  if the guy is the last player
        if (numOfPlayersChoseHitStay + 1 == numberOfPlayers) {
          outputvalue = `YAY! you the player ▶ have won because you scored 21💰🤑💲<br><br>it is now the dealer's turn 🤝 to 'hit' or 'stay'`;
          gamestage = "dealer reveal cards";
        } else {
          outputvalue = `YAY! you the player ▶ have won because you scored 21💰💲🤑<br><br>It is now ${playersData[numOfPlayersChoseHitStay + 1].name}'s turn to choose whether to hit or stay!😜`;
          gamestage = "player check cards again";
        }
        //player leaves after winning and wait for next round
        holdingroom[holdingroom.length] = playersData[numOfPlayersChoseHitStay];
        playersData.splice(numOfPlayersChoseHitStay, 1);
        numberOfPlayers -= 1;
        if (playersData.length == 0) {
          outputvalue += "<br><br>The round has ended because they are no players left!👋👋<br><br>click submit to see the scoreboard!";
          gamestage = "reset and show score";
        }
      } else if (playerscore < 21) {
        gamestage = "player hit stay";
        outputvalue = `you the player ▶ have not hit 21.<br> <br>Your cards are ${playersData[numOfPlayersChoseHitStay].cardsFaceUp} <br>the dealer 🤝 cards are ${dealerData[0].cardsFaceUp}!<br><br>you can continue to choose "hit" or "stay"`;
      }
    } else if (input == "stay") {
      //for all players except last player
      if (numOfPlayersChoseHitStay + 1 < numberOfPlayers) {
        outputvalue = `${playersData[numOfPlayersChoseHitStay].name} have chosen to stay! <br><br> It is now ${playersData[numOfPlayersChoseHitStay + 1].name}'s turn to choose whether to hit or stay!😜`;

        gamestage = "player check cards again";
        //for last palyer then we can move on to check on the dealer
      } else if (numOfPlayersChoseHitStay + 1 == numberOfPlayers) {
        outputvalue = `${playersData[numOfPlayersChoseHitStay].name} have chosen to stay! <br><br>it is now the dealer's turn 🤝 to choose 'hit' or 'stay'`;
        gamestage = "dealer reveal cards";
      }
      numOfPlayersChoseHitStay += 1;
    }

    //dealer reveals his cards here
  } else if (gamestage == "dealer reveal cards") {
    var dealerscore = calcDealerScore();
    dealerData[0].handValue = calcDealerScore();
    //remove all the 'hidden cards' from the face up array
    while (dealerData[0].cardsFaceUp.length > 1) {
      dealerData[0].cardsFaceUp.pop();
    }
    var counter = 1;
    //replace the hidden cards with legit cards
    while (dealerData[0].cardsFaceUp.length < dealerData[0].cardsInHand.length) {
      dealerData[0].cardsFaceUp.push(`${dealerData[0].cardsInHand[counter].name} of ${dealerData[0].cardsInHand[counter].suit}`);
      counter += 1;
    }
    // now everyone can see dealer cards
    // if dealer card is less than 17, move on to draw cards
    if (dealerData[0].handValue < 17) {
      outputvalue = `${dealerData[0].name} the dealer has a score of only ${dealerData[0].handValue}<br> ${dealerData[0].name} has ${dealerData[0].cardsFaceUp} in his/her hand!<br><br> Click "submit" for ${dealerData[0].name} has to draw cards until his/her score is at least 17!👋`;
      gamestage = "dealer draw cards";
      //if dealer card is more than 17 , then they shall move on to comparison
    } else if (dealerData[0].handValue >= 17 && dealerData[0].handValue < 21) {
      outputvalue = `${dealerData[0].name} the dealer has a score of ${dealerData[0].handValue}<br> ${dealerData[0].name} has ${dealerData[0].cardsFaceUp} in his/her hand!<br><br> Now we can move on to compare the cards of the remaining players and dealers!🤣😁`;
      gamestage = "comparison";
    } else if (dealerData[0].handValue == 21) {
      outputvalue = `Dealer ${dealerData[0].name} has won by getting a hand value of 21!!🤑💲`;
      for (i = 0; i < playersData.length; i += 1) {
        playersData[i].points -= playersData[i].wager * 1.5;
        dealerData[0].points += playersData[i].wager * 1.5;
        dealerData[0].wincount += 1;
      }
      gamestage = "reset and show score";
    }
    //dealer draw cards here cos he has less than 17
  } else if (gamestage == "dealer draw cards") {
    //loop for him to draw until at least 17
    while (dealerData[0].handValue < 17) {
      giveDealerCard();
      dealerData[0].handValue = calcDealerScore();
    }

    //if the dealer busts, he loses and everyone remaining will get 1.5x of his bet
    if (dealerData[0].handValue > 21) {
      for (i = 0; i < playersData.length; i += 1) {
        playersData[i].wincount += 1;
        playersData[i].points += playersData[i].wager * 1.5;
        dealerData[0].points -= playersData[i].wager * 1.5;
      }
      outputvalue = "OH NO LOL! THE DEALER HAS BUSTED!!! EVERYONE REMAINING WINS 1.5X OF THEIR WAGER 💲💰🤑💹💸";
      gamestage = "reset and show score";
      // if the dealer doesnt busts after drawing then we can move on to comparison
    } else if (dealerData[0].handValue < 21) {
      outputvalue = `Okay, ${dealerData[0].name} has drawn ${dealerData[0].cardsFaceUp}!<br><br> Now we can move on to compare the cards of the remaining players and dealers!🤣😁`;
      gamestage = "comparison";
    } else if (dealerData[0].handValue == 21) {
      outputvalue = `Dealer ${dealerData[0].name} has won by getting a hand value of 21!!🤑💲`;
      for (i = 0; i < playersData.length; i += 1) {
        playersData[i].points -= playersData[i].wager * 1.5;
        dealerData[0].points += playersData[i].wager * 1.5;
        dealerData[0].wincount += 1;
      }
      gamestage = "reset and show score";
    }

    // comparison to find the winner if no one has busts yet
  } else if (gamestage == "comparison") {
    //dealer score is constant because there is only one dealer
    var dealerscore = calcDealerScore();

    // i need a loop here to calculate all the players different numbers
    //probably need to change the calcutaion function itself oso to force it to look for values in the array of objects itself
    // one by one reveal to the players whether they have won or lost!

    var currentPlayer = playersData[numOfplayersKnowOutcome];
    // for all the players except the last guy
    if (numOfplayersKnowOutcome + 1 < numberOfPlayers) {
      //player lost
      if (currentPlayer.handValue < dealerscore) {
        dealerData[0].wincount += 1;
        currentPlayer.points -= currentPlayer.wager;
        dealerData[0].points += currentPlayer.wager;
        outputvalue = `${currentPlayer.name} has lost!😢😭😥 <br><br>Your cards are ${currentPlayer.cardsFaceUp} VS the dealer's ${dealerData[0].cardsFaceUp}`;
        //player win
      } else if (currentPlayer.handValue > dealerscore) {
        currentPlayer.wincount += 1;
        currentPlayer.points += currentPlayer.wager;
        dealerData[0].points -= currentPlayer.wager;
        outputvalue = `${currentPlayer.name} has won!🤣😂😁 <br><br>Your cards are ${currentPlayer.cardsFaceUp} VS the dealer's ${dealerData[0].cardsFaceUp}`;
      }
      //player draw
      else if (currentPlayer.handValue == dealerscore) {
        outputvalue = `${currentPlayer.name} has drawn with the dealer ${dealerData[0].name}! 😐😑😕 <br><br>Your cards are ${currentPlayer.cardsFaceUp} VS the dealer's ${dealerData[0].cardsFaceUp}v`;
      }
      numOfplayersKnowOutcome += 1;
      //for the last guy
    } else if (numOfplayersKnowOutcome + 1 == numberOfPlayers) {
      //player lost
      if (currentPlayer.handValue < dealerscore) {
        dealerData[0].wincount += 1;
        currentPlayer.points -= currentPlayer.wager;
        dealerData[0].points += currentPlayer.wager;
        outputvalue = `${currentPlayer.name} has lost!😢😭😥 <br><br>Your cards are ${currentPlayer.cardsFaceUp} VS the dealer's ${dealerData[0].cardsFaceUp}`;
        //player win
      } else if (currentPlayer.handValue > dealerscore) {
        currentPlayer.wincount += 1;
        currentPlayer.points += currentPlayer.wager;
        dealerData[0].points -= currentPlayer.wager;
        outputvalue = `${currentPlayer.name} has won!🤣😂😁 <br><br>Your cards are ${currentPlayer.cardsFaceUp} VS the dealer's ${dealerData[0].cardsFaceUp}`;
      }
      //player draw
      else if (currentPlayer.handValue == dealerscore) {
        outputvalue = `${currentPlayer.name} has drawn with the dealer ${dealerData[0].name}! 😐😑😕 <br><br>Your cards are ${currentPlayer.cardsFaceUp} VS the dealer's ${dealerData[0].cardsFaceUp}v`;
      }
      gamestage = "reset and show score";
    }
  } else if (gamestage == "reset and show score") {
    while (holdingroom.length > 0) {
      playersData[playersData.length] = holdingroom[0];
      holdingroom.shift();
      // var transferback = holdingroom.pop();
      // playersData.push(transferback);
    }
    outputvalue = makeScoreBoard();
    for (i = 0; i < playersData.length; i += 1) {
      playersData[i].cardsInHand = [];
      playersData[i].cardsFaceUp = [];
      playersData[i].handValue = 0;
    }
    dealerData[0].cardsInHand = [];
    dealerData[0].cardsFaceUp = [];
    dealerData[0].handValue = 0;
    numberOfPlayers = playersData.length;
    numOfPlayersCheckedIn = 0;
    numOfPlayersCheckedTheirCards = 0;
    numOfPlayersChoseHitStay = 0;
    numOfplayersKnowOutcome = 0;
    gamestage = "start new round";
  } else if (gamestage == "start new round") {
    outputvalue = `Time to start a new round!<br><br>${playersData[numOfPlayersCheckedIn].name}, please enter the amount of points you want to wager`;
    gamestage = "ask for player wager again";
  } else if (gamestage == "ask for player wager again") {
    var currentPlayerWager = Number(input);
    playersData[numOfPlayersCheckedIn].wager = currentPlayerWager;
    numOfPlayersCheckedIn += 1;
    //if not all the players have entered thier name and wager, move the gamestage back to repeat for the rest of the players
    if (numOfPlayersCheckedIn < numberOfPlayers) {
      outputvalue = `${playersData[numOfPlayersCheckedIn - 1].name}, you have decided to wager ${currentPlayerWager} points! <br><br>May ${playersData[numOfPlayersCheckedIn].name} now enter his/her wager!😊`;
      // when all the players have entered the name and wager, they shall move to ask for the dealer's name and wager
    } else if (numOfPlayersCheckedIn == numberOfPlayers) {
      gamestage = "ask for dealer wager";
      outputvalue = `${playersData[numOfPlayersCheckedIn - 1].name}, you have decided to wager ${currentPlayerWager} points! <br><br> May the dealer ${dealerData[0].name}🤝 nowenter his/her wager!`;
    }
  }
  return outputvalue;
};
//i shud make a new variable for the next round of players and maybe might need new gamestages
