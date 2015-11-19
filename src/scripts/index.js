function ready() {
  var top = document.getElementById('nav').offsetTop;

  window.onscroll = function () {
    var y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    if (y >= top) {
      nav.classList.add('nav-stick');
    } else {
      nav.classList.remove('nav-stick');
    }
  }
}

// if (document.readyState == 'complete' || document.readyState == 'loaded') {
//   ready();
// } else {
//   window.addEventListener('DOMContentLoaded', ready);
// }
