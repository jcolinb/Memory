exports.shuff = function () {
  a = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];
  b = [];
  for (i=16;i>0;i--) {
    r = Math.floor(Math.random() * a.length);    
    b.push(a[r]);
    a.splice(r,1);
  };
  return b
};
