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
        return response.text()
      }).then(function(body) {
        page.innerHTML = body
      })
  }

  // Routes
  router = function(val) {
    switch (val) {
      case 'skills':
        return 'views/skills.html';
      case 'blog':
        return '<ce-blog></ce-blog>';
      case 'projects':
        return 'views/projects.html';
      case 'home':
        return 'views/home.html';
      case 'html5/apprentice':
        return 'views/html5/apprentice.html';
      case 'javascript/apprentice':
        return 'views/javascript/apprentice.html';
      case 'wc/apprentice':
        return 'views/webcomponents/apprentice.html';
    }
  }
  
  // Route handler
  var checkHash = function(hash) {
    app.selected = location.hash.replace(/#\/(.*)/,"$1");
    console.log(app.selected)
    if (app.selected == undefined || app.selected == '') app.selected = 'home';
    renderPage(router(app.selected));
  }
  
  // Listen for your URL change
  window.addEventListener('hashchange', checkHash);

})()
