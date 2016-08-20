(function(){

  var slideshow = document.getElementById('slideshow'),
      imgs = slideshow.getElementsByTagName('img'),
      count = 0,
      timer,
      previous;

  function next(){
    previous = count > 0 ? count - 1 : 0;
    imgs[ previous ].className = imgs[ previous ].className.replace(/\bis\-active\b/i, '' );
    
    if( count < imgs.length ){
      imgs[ count ].className += 'is-active';
      count++;
    }  
    else{
      count = 0;
      next();
    }
  }

  next();

  timer = setInterval(function(){
    next();
  }, 2000);

})();