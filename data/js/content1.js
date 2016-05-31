(function() {
    // retrieve button from the page
    var searchButton = document.querySelector('#answer_button');
    var mozillaRadio = document.getElementById('mozilla');
    var mozillaOption = document.getElementById('mozilla-Option');
    var kidRadio = document.getElementById('kid');
    var singersRadio = document.getElementById('singers');
    var token1 = document.querySelector('#token1');
    var answered = false;
    
    // listen for a click on the search button
    searchButton.addEventListener('click', function() {
        if(!answered)
        {
    		token1.style.backgroundImage = "url('/data/media/values/content1-token.svg')";
    		
            if(kidRadio.checked)
            {
                mozillaRadio.checked = true;
                kidRadio.checked = false;

                mozillaRadio.disabled = true;
                kidRadio.disabled = true;
                singersRadio.disabled = true;
                answered = true;

                mozillaOption.style.backgroundColor = "#87D37C";
                mozillaOption.style.color = "#F2F1EF";
            }
            else 
                if(singersRadio.checked)
                {
                    mozillaRadio.checked = true;
                    singersRadio.checked = false;

                    mozillaRadio.disabled = true;
                    kidRadio.disabled = true;
                    singersRadio.disabled = true;
                    answered = true;

                    mozillaOption.style.backgroundColor = "#87D37C";
                    mozillaOption.style.color = "#F2F1EF";
                }
                else
                {
                    mozillaRadio.disabled = true;
                    kidRadio.disabled = true;
                    singersRadio.disabled = true;
                    answered = true;

                    mozillaOption.style.backgroundColor = "#87D37C";
                    mozillaOption.style.color = "#F2F1EF";
                }
        }
    });
})();
