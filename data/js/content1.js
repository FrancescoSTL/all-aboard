(function() {
    // retrieve our buttons from the page
    var searchButton = document.querySelector('#searchButton');
    
    // listen for a click on the search button
    searchButton.addEventListener('click', function() {
        // notify addon that we've clicked the button
        addon.port.emit('searchClick');
    });
})();
