let descriptionBox = document.querySelector('.display-description');
let descriptionText = document.querySelector('.display-description p');

/* get files data and display on dashboard*/
fetch('/files')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(jsonResponse => {
        console.log(jsonResponse);

        // display data 
        for (let i = 0; i < jsonResponse.length; i++) {
            let elem = jsonResponse[i];

            // filename
            let filenameBox = document.querySelector('.filename');
            let filename = document.createElement('p');
            filename.title = elem.description;
            filename.innerHTML = elem.filename;
            filename.className = i % 2 === 0 ? 'display-item display-item-blue' : 'display-item';
            filenameBox.appendChild(filename);

            // downloads
            let downloadBox = document.querySelector('.downloads');
            let download = document.createElement('p');
            download.innerHTML = elem.downloads;
            download.className = i % 2 === 0 ? 'display-item-2 display-item-blue' : 'display-item-2';
            downloadBox.appendChild(download);

            // sent via email
            let emailSentBox = document.querySelector('.emails-sent');
            let emailSent = document.createElement('p');
            emailSent.innerHTML = elem.emails_sent;
            emailSent.className = i % 2 === 0 ? 'display-item-2 display-item-blue' : 'display-item-2';
            emailSentBox.appendChild(emailSent);
        }
    })
    .catch(err => console.log(err));


/* display upload box */
let outerUploadButton = document.querySelector('.side button');
let uploadBox = document.querySelector('.upload-box');
let innerUploadButton = document.querySelector('#submit');
outerUploadButton.onclick = () => {
    if (uploadBox.style.display === 'block') {
        uploadBox.style.display = 'none';
    } else {
        uploadBox.style.display = 'block'
    }
};
innerUploadButton.onclick = () => uploadBox.style.display = 'none';


/* get and display search results */
let searchResultsBox = document.querySelector('.search-results-box');
let searchForm = document.querySelector('.search form');

// send get request with AJAX instead
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let search = document.querySelector('#search').value;
    fetch(`/search?search=${encodeURIComponent(search)}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);

            // display search results
            let searchOutcome = document.querySelector('.search-outcome');
            searchResultsBox.style.display = 'block';
            searchOutcome.innerHTML = '';

            if (jsonResponse.length === 0) {
                let noResult = document.createElement('p');
                noResult.className = 'display-item';
                noResult.innerHTML = 'No results found';
                searchOutcome.appendChild(noResult);
            }
            else {
                for (let i = 0; i < jsonResponse.length; i++) {
                    let filename = document.createElement('p');
                    filename.title = jsonResponse[i].description;
                    filename.innerHTML = jsonResponse[i].filename;
                    filename.className = i % 2 === 0 ? 'display-item display-item-blue' : 'display-item';
                    searchOutcome.appendChild(filename);
                }
            }
        })
        .catch(err => console.log(err));
});

// close search results
const closeSearch = document.querySelector('.search-heading img');
closeSearch.onclick = () => {
    searchResultsBox.style.display = 'none';
};
