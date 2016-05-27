(function() {
    // retrieve button from the page
    var searchButton = document.querySelector('#search_button');
    var token1 = document.querySelector('#token1');
    
    // listen for a click on the search button
    searchButton.addEventListener('click', function() {
		token1.style.backgroundImage = "url('/data/media/utility/content1-token.svg')";
		
        // notify addon that we've clicked the button
        addon.port.emit('searchClick');
    });
})();
