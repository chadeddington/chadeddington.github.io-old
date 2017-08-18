(function() {
	var app = document.getElementById('nav');
	var page = document.getElementById('page');

  // Initial load
  document.addEventListener('WebComponentsReady', function() {
    checkHash();
  });

  // Render the view
  var renderPage = function(view) {
    page.innerHTML = '';
    fetch(view)
      .then(function(response) {
        return response.text();
      }).then(function(body) {
        page.innerHTML = body;
      });
  };

  // Router
  router = function(val) {
    return 'views/' + val + '.html';
  }

  // Route change handler
  var checkHash = function(hash) {
    app.selected = location.hash.replace(/#\/(.*)/,'$1');
    console.log(app.selected)
    if (app.selected == undefined || app.selected == '') app.selected = 'home';
    renderPage(router(app.selected));
  }

  // Listen for your URL change
  window.addEventListener('hashchange', checkHash);

})()

function toggleBlock(e) {
  e.target.classList.contains('show') ? e.target.classList.remove('show') : e.target.classList.add('show');
}

function debugCode() {
	var message = "Testing";
	document.querySelector('#testMessage').innerText = message;

}
