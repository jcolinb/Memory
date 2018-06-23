const Board = document.getElementById('container');
const Start = document.getElementById('start');
const Moves = document.getElementById('moves');
const Clock = document.getElementById('timer');
const Rate  = document.getElementById('rate');
const Icons = ['ᨖ','ᨖ','B','B','C','C','D','D','E','E','F','F','H','H','I','I'];
const Areas = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

const Deck  = {};
var   Cards = undefined;

Start.addEventListener('click',function() {location.reload();});

const GM    = {

  stack: [],

  matches: 0,

  moves: 0,

  secs: 0,

  are_equal: function (a,b) {

    return (a == b)
  },

  reset: function () {

    if (GM.matches < 8) {
      for (a in Deck) {
        Cards[Deck[a].index].classList.remove('animated');
        if (Deck[a].resolved !== 'yes') {
          Cards[Deck[a].index].textContent = "";
          Cards[Deck[a].index].classList.remove('revealed');
        }
        else {Cards[Deck[a].index].style.color = 'green';}
      }

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
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip);
    }
    else {
      Board.innerHTML = "";
      document.getElementById('control').style.display = 'none';
      let modal = document.createElement('div');
      modal.classList.add('modal');
      let congrats = document.createElement('p');
      congrats.textContent = "Congratulations!";
      modal.appendChild(congrats);
      modal.appendChild(Rate);
      let moves = document.createElement('p');
      moves.textContent = `MOVES: ${GM.moves}`;
      moves.style.border = '1px solid black';
      moves.style.borderRadius = '3px';
      moves.style.padding = '2px';
      modal.appendChild(moves);
      let time = document.createElement('p');
      time.textContent = `TIME: ${GM.secs}`;
      time.style.border = '1px solid black';
      time.style.borderRadius = '3px';
      time.style.padding = '2px';
      modal.appendChild(time);
      modal.appendChild(Start);
      Board.appendChild(modal);
    }
  },

  deal: function () {

    Board.innerHTML = "";
    
    let Hand = document.createDocumentFragment();
    let mixedIcons = GM.shuffle(Icons);
    let areaAssign = Clone(Areas);
    
    for (a in areaAssign) {
      card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('style',`grid-area: ${areaAssign[a]}`);
      Hand.appendChild(card);
      Deck[areaAssign[a]] = {val:mixedIcons[a], resolved: "no", index:a};
    }

    Board.appendChild(Hand);
    Cards = document.getElementsByClassName('card');
    GM.moves = 0;
    moves.textContent = `${GM.moves}`;
    Tick();
    new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip);
  },
  
  flip: function (e) {

    if ((e.target.classList.contains( 'card')) && !(e.target.classList.contains( 'revealed')) ) {
      e.target.classList.add('revealed');
      e.target.textContent = Deck[e.target.style.gridColumnEnd].val;
      GM.stack.push(e.target);
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.judge);
    }
    else{
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip);
    }
  },
  
  judge: function (e) {

    if ((e.target.classList.contains( 'card')) && (e.target !== GM.stack[0]) && !(e.target.classList.contains( 'revealed'))) {

      let a = e.target;
      let b = GM.stack[0];
      
      a.classList.add('revealed');
      a.textContent = Deck[e.target.style.gridColumnEnd].val;

      a.classList.add('animated');
      b.classList.add('animated');
      
      if (GM.are_equal(a.textContent,b.textContent)) {
        Deck[a.style.gridColumnEnd].resolved = 'yes';
        Deck[b.style.gridColumnEnd].resolved = 'yes';
        GM.matches++;
      }
      setTimeout(GM.reset,1000);
    }      
    else {
      new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.judge);
    }
  },
  
  shuffle: function (arr) {

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

const Clone = function (arr) {

  let a = arr;
  let b = [];
  
  for (i in a) {
    b[i] = a[i];
  }
  return b;
};

const Tick = function () {

  GM.secs++;
  Clock.textContent = `${GM.secs}`;
  if (GM.matches < 8) {
    setTimeout(Tick,1000);
  }
};

GM.deal();
