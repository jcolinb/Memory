// get DOM elements
const Board = document.getElementById('container');
const Start = document.getElementById('start');
const Moves = document.getElementById('moves');
const Clock = document.getElementById('timer');
const Rate  = document.getElementById('rate');

// collections for populating game board
const Icons = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H'];
const Areas = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

// initialize data structures for game-space
const Deck  = {};
var   Cards = undefined;

// define "Game Master"; contains all gameplay functions
const GM    = {

  // properties for game state; initialized each deal
  stack: [],

  matches: 0,

  moves: 0,

  secs: 0,

  // simple compare function, called in .judge
  are_equal: function (a,b) {

    return (a == b)
  },

  // function to reset gameboard between turns; checks for game completion and resolves end of game
  reset: function () {

    if (GM.matches < 8) { // if all cards aren't matched
      for (a in Deck) { // reset all unresolved cards
        if (window.matchMedia("(orientation: landscape)").matches) {
          Cards[Deck[a].index].classList.remove('animated-mobile');
        }
        else {
          Cards[Deck[a].index].classList.remove('animated');
        }

        if (Deck[a].resolved !== 'yes') {
          Cards[Deck[a].index].textContent = "";
          Cards[Deck[a].index].classList.remove('revealed');
        }
        else {Cards[Deck[a].index].style.color = '#44e532';} // or change match green
      }
      // update game-state
      GM.stack=[];
      GM.moves++;
      moves.textContent = `${GM.moves}`;
      if(GM.moves > 12) {
        if (GM.moves < 16) {
          Rate.textContent = "☆☆";
        }
        else {
          Rate.textContent = "☆";
        }
      } 
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip); // create Promise for new turn
    }
    else { // endgame
      Board.innerHTML = "";
      document.getElementById('control').style.display = 'none';
      let modal = document.createElement('div'); // create congrats modal
      modal.classList.add('modal');
      let congrats = document.createElement('h4');
      congrats.textContent = "Congratulations!";
      modal.appendChild(congrats);
      let rate = document.createElement('h4');
      rate.textContent = Rate.textContent;
      modal.appendChild(rate);
      let moves = document.createElement('p');
      moves.textContent = `MOVES: ${GM.moves}`;
      moves.style.border = '1px solid #ed6ae4';
      moves.style.borderRadius = '3px';
      moves.style.padding = '2px';
      modal.appendChild(moves);
      let time = document.createElement('p');
      time.textContent = `TIME: ${GM.secs}`;
      time.style.border = '1px solid #ed6ae4';
      time.style.borderRadius = '3px';
      time.style.padding = '2px';
      modal.appendChild(time);
      Start.classList.remove('hidden');
      Start.textContent = 'Play Again?';
      modal.appendChild(Start);
      Board.appendChild(modal);
      new Promise((res,rej) => Start.addEventListener('click',res)).then(GM.deal); // create Promise to start new game
    }
  },

  // function to create data structures for game-space per game
  deal: function () {

    // initialize game-space and game data
    Board.innerHTML = "";
    document.getElementById('control').style.display = 'flex';
    GM.stack = [];
    GM.moves = 0;
    GM.matches = 0;
    GM.secs = 0;
    Rate.textContent = "☆☆☆";

    Start.classList.add('hidden');

    let Hand = document.createDocumentFragment();
    let mixedIcons = GM.shuffle(Icons);
    let areaAssign = Clone(Areas);
    
    for (a in areaAssign) { // create cards and add them to DOM
      card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('style',`grid-area: ${areaAssign[a]}`);
      Hand.appendChild(card);
      Deck[areaAssign[a]] = {val:mixedIcons[a], resolved: "no", index:a}; // add created card to object, indexed by it's placement
    }

    Board.appendChild(Hand);
    Cards = document.getElementsByClassName('card');
    GM.moves = 0;
    moves.textContent = `${GM.moves}`;
    Tick();
    new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip); // create Promise to begin turn
  },
  // function resolving first card of a turn
  flip: function (e) {

    if ((e.target.classList.contains( 'card')) && !(e.target.classList.contains( 'revealed')) ) { // check cards eligibility
      e.target.classList.add('revealed');
      e.target.textContent = Deck[e.target.style.gridColumnEnd].val; // retrieve it's text value from object
      GM.stack.push(e.target); // store card for comparison in .judge
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.judge); // create Promise for second card of turn
    }
    else{
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip); // if card is ineligible, renew Promise
    }
  },
  // function resolving second card of a turn
  judge: function (e) {

    // check card for eligibility
    if ((e.target.classList.contains( 'card')) && (e.target !== GM.stack[0]) && !(e.target.classList.contains( 'revealed'))) {

      // bring in both cards as 'a' and 'b'
      let a = e.target;
      let b = GM.stack[0];

      // reveal second card
      a.classList.add('revealed');
      a.textContent = Deck[e.target.style.gridColumnEnd].val;

      // animate both cards
      if (window.matchMedia("(orientation: landscape)").matches) {
        a.classList.add('animated-mobile');
        b.classList.add('animated-mobile');
      }
      else {
        a.classList.add('animated');
        b.classList.add('animated');
      }

      if (GM.are_equal(a.textContent,b.textContent)) { // check for a match
        // if they match, update the cards in the object
        Deck[a.style.gridColumnEnd].resolved = 'yes'; 
        Deck[b.style.gridColumnEnd].resolved = 'yes';
        GM.matches++;
      }
      setTimeout(GM.reset,1000); // pause for 1 sec and reset board for next turn
    }      
    else {
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.judge); // or, renew Promise for second card
    }
  },
  
  shuffle: function (arr) { // function to shuffle array; used in .deal

    let a = Clone(arr);
    let b = [];

    for (i=a.length;i>0;i--) {
      r = Math.floor(Math.random() * a.length);
      b.push(a[r]);
      a.splice(r,1);
    }
    return b;
  }
};

// helper functions
const Clone = function (arr) { // clone an array to preserve data that should stay immutable

  let a = arr;
  let b = [];
  
  for (i in a) {
    b[i] = a[i];
  }
  return b;
};

const Tick = function () { // increment the game clock and update the DOM

  GM.secs++;
  Clock.textContent = `${GM.secs}`;
  if (GM.matches < 8) {
    setTimeout(Tick,1000);
  }
};

new Promise((res,rej) => Start.addEventListener('click',res)).then(GM.deal); // create Promise to start game
