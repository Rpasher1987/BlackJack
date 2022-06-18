
var textArea = document.getElementById('text-area'),
  newGame = document.getElementById('new-game'),
  hitButton = document.getElementById('hit'),
  stayButton = document.getElementById('stay');


var suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
var values = [
  'Ace',
  'King',
  'Queen',
  'Jack',
  'Nine',
  'Eight',
  'Seven',
  'Six',
  'Five',
  'Four',
  'Three',
  'Two',
];

var gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards =[],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];


hitButton.style.display = "none";
stayButton.style.display = "none";

var getCardNumberValue = function(card) {
  switch(card.value){
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
};

// Get the score
var getScore = function(cards) {
  var score = 0;
  var hasAce = false;
  for (var i = 0; i < cards.length; i++){
    var card = cards[i]
    score += getCardNumberValue(card);
    if(card.value === 'Ace'){
      hasAce = true;
    }
  }
  if(hasAce && score + 10 <= 21){
    return score + 10;
  }

  return score;
}
// Shuffle the cards
var shuffleDeck = function(deck) {
  for(var i = 0; i < deck.length; i++){
    var swapIndex = Math.trunc(Math.random() * deck.length);
    var deckExchange = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = deckExchange;
  }
  
}

// Get the Cards suits & values
var getCards = function(card) {
  return card.value + ' of ' + card.suit;
}

// Update the Scores
var updateScores = function(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

// Display the status of the scores
var showStatus = function(){
  if(!gameStarted){
    textArea.innerText = 'Welcome to the BlackJack Table!';
    return
  }

  var dealerCardString = '';
  for(var i  = 0; i < dealerCards.length; i++){
    dealerCardString += getCards(dealerCards[i]) + '\n';
  }

  var playerCardString = '';
  for(var i  = 0; i < playerCards.length; i++){
    playerCardString += getCards(playerCards[i]) + '\n';
  }

  // For updating the scores with cards being drawn
  updateScores();

  textArea.innerText = 
    'Dealer has: \n' +
    dealerCardString + 
    '(Score: ' + dealerScore + ')\n\n' +

    'Player has: \n' +
    playerCardString + 
    '(Score: ' + playerScore + ')\n\n'

  if(gameOver){
    if(playerWon){
      textArea.innerText += 'You Beat the Dealer!';
    }
    else{
      textArea.innerText += 'House Wins! )-:';
    }

    hitButton.style.display = "none";
    stayButton.style.display = "none";
    newGame.style.display = 'inline';
  }

}

// Display status
showStatus();


// Create Deck
var createDeck = function() {
  var deck = [];
  for (var suitIndex = 0; suitIndex < suits.length; suitIndex++) {
    for (var valueIndex = 0; valueIndex < values.length; valueIndex++) {
      var card = {
        value: values[valueIndex],
        suit: suits[suitIndex],
      };
      deck.push(card);
    }
  }
  return deck;
}

// Pull the next card from the deck
var getNextCard = function() {
  return deck.shift();
}


var checkForEndGame = function(){ 
  updateScores();

  if(gameOver){
    while(dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21){
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if(playerScore > 21){
    playerWon = false;
    gameOver = true;
  }
  else if(dealerScore > 21){
    playerWon = true;
    gameOver = true;
  }
  else if(gameOver){
    if(playerScore > dealerScore){
      playerWon = true;
    }
    else{
      playerWon = false;
    }
  }
}

// Click functionality
newGame.addEventListener('click', function(){
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);

    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    hitButton.style.display = "inline";
    stayButton.style.display = "inline";
    newGame.style.display = 'none';

    showStatus();
});


hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndGame();
  showStatus();
});

stayButton.addEventListener('click', function(){
  gameOver = true;
  checkForEndGame();
  showStatus();
});
