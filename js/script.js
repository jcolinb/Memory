const Board = document.getElementById('container');
const Start = document.getElementById('start');
const Moves = document.getElementById('moves');
const Icons = ['ᨖ','ᨖ','B','B','C','C','D','D','E','E','F','F','H','H','I','I'];
const Areas = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];
const Deck  = {};
var   Cards = undefined;
const GM    = {
  stack: [],
  moves: 0,
  are_equal: function (a,b) {return (a == b)},

  reset: function () {
    for (a in Deck) {
        if (Deck[a].resolved !== 'yes') {
          Cards[Deck[a].index].textContent = "";
          Cards[Deck[a].index].classList.remove('revealed');
          }      
    }
    GM.stack=[];
    new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip);
  },

  deal: function () {
  console.log("propogating...");
  Board.innerHTML = "";
  
  let Hand = document.createDocumentFragment();
  let mixedIcons = GM.shuffle(Icons);
  let areaAssign = Clone(Areas);

  console.log(mixedIcons);
    for (a in areaAssign) {
      card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('style',`grid-area: ${areaAssign[a]}`);
      Hand.appendChild(card);
      Deck[areaAssign[a]] = {val:mixedIcons[a], resolved: "no", index:a};
    }
  Board.appendChild(Hand);
  console.log(Deck);
  Cards = document.getElementsByClassName('card');
  },

  flip: function (e) {
  if (e.target.classList.contains( 'card')) {
    e.target.classList.add('revealed');
    e.target.textContent = Deck[e.target.style.gridColumnEnd].val;
    GM.stack.push(e.target);
    console.log(GM.stack);
    new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.judge);
  }
  else{
    new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip);
  }
  },

  judge: function (e) {
    GM.moves++;
    moves.textContent = `${GM.moves}`;
    if ((e.target.classList.contains( 'card')) && (e.target !== GM.stack[0])) {
      e.target.classList.add('revealed');
      e.target.textContent = Deck[e.target.style.gridColumnEnd].val;

    let a = e.target;
    let b = GM.stack[0];
    if (GM.are_equal(a.textContent,b.textContent)) {
      Deck[a.style.gridColumnEnd].resolved = 'yes';
      Deck[b.style.gridColumnEnd].resolved = 'yes';
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

new Promise((res,rej) => Start.addEventListener('click',res)).then(GM.deal);
new Promise((res,rej) => Board.addEventListener('click',res)).then(GM.flip);
