const Board = document.getElementById('container');
const Start = document.getElementById('start');

const Areas = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

const Clone = function (arr) {
  let a = arr;
  let b = [];

  for (i in a) {
    b[i] = a[i];
  }
  return b;
};

const Shuff = function (arr) {
  let a = Clone(arr);
  let b = [];
  for (i=a.length;i>0;i--) {
    r = Math.floor(Math.random() * a.length);    
    b.push(a[r]);
    a.splice(r,1);
  };
  return b
};

propogate = function () {
  console.log("propogating...");
  Board.innerHTML = "";
  let Hand = document.createDocumentFragment();
  let mixedAreas = Shuff(Areas);
  console.log(mixedAreas);
    for (a in mixedAreas) {
    card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('grid-area',mixedAreas[a]);
    Hand.appendChild(card);
  }
  Board.appendChild(Hand);
};

Start.addEventListener('click',propogate);
