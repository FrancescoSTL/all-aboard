(function() {
    // retrieve our buttons from the page
    var pbButton = document.querySelector('#pbButton');

    // add event listeners for a button click on the button
    pbButton.addEventListener('click', function() {
        // alert the back-end that we've clicked the button
        addon.port.emit('highLightPB');
    });
})();
