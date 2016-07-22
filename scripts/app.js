(function() {
	var app = document.getElementById('app');
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
        return response.text()
      }).then(function(body) {
        page.innerHTML = body
      })
  }

  // Routes
  app.route = function(val) {
    switch (val) {
      case 'sandbox':
        renderPage('views/sandbox.html')
        break;
      case 'blog':
        page.innerHTML = '<ce-blog></ce-blog>';
        break;
      case 'projects':
        renderPage('views/projects.html')
        break;
      case 'home':
        renderPage('views/home.html')
        break;
      case 'html5/apprentice':
        renderPage('views/html5/apprentice.html')
    }
  }
  
  // Route handler
  var checkHash = function(hash) {
    app.selected = location.hash.replace(/#\/(.*)/,"$1");
    console.log(app.selected)
    if (app.selected == undefined || app.selected == '') app.selected = 'home';
    app.route(app.selected);
  }
  
  // Listen for your URL change
  window.addEventListener('hashchange', checkHash);

})()
