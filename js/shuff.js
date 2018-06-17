exports.shuff = function (arr) {
  a = arr;
  b = [];
  for (i=a.length;i>0;i--) {
    r = Math.floor(Math.random() * a.length);    
    b.push(a[r]);
    a.splice(r,1);
  };
  return b
};
