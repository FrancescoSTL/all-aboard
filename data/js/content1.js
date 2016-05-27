(function() {
    // retrieve button from the page
    var searchButton = document.querySelector('#search_button');
    
    // listen for a click on the search button
    searchButton.addEventListener('click', function() {
        // notify addon that we've clicked the button
        addon.port.emit('searchClick');
    });
})();
