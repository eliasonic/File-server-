let fileDescription = document.querySelector('.description');
let downloadButton = document.querySelector('.links a');
let sendFileName = document.querySelector('#filename');

// get files data from database
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
            filename.innerHTML = elem.filename;
            filename.className = i % 2 === 0 ? 'display-item display-item-blue' : 'display-item';

            // add click event
            filename.onclick = () => {
                filename.style.color = '#339AF0';
                fileDescription.innerHTML = elem.description;
                downloadButton.href = `/download/${elem.filename}`;
                sendFileName.value = elem.filename;
            };

            filenameBox.appendChild(filename);
        }
    })
    .catch(err => console.log(err));


/* toggle send-file form */
let emailButton = document.querySelector('.email-btn');
let submitButton = document.querySelector('#submit');
let sendfileBox = document.querySelector('.send-file');

emailButton.onclick = () => {
    if (sendfileBox.style.display === 'block') {
        sendfileBox.style.display = 'none';
    } else {
        sendfileBox.style.display = 'block';
    }
};
// close form 
submitButton.onclick = () => sendfileBox.style.display = 'none';


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
                noResult.innerHTML = 'No results found';
                noResult.style.paddingLeft = '5px';
                searchOutcome.appendChild(noResult);
            }
            else {
                for (let i = 0; i < jsonResponse.length; i++) {
                    let filename = document.createElement('p');
                    filename.innerHTML = jsonResponse[i].filename;
                    filename.className = i % 2 === 0 ? 'display-item display-item-blue' : 'display-item';

                    // add click event
                    filename.onclick = () => {
                        filename.style.color = '#339AF0';
                        fileDescription.innerHTML = jsonResponse[i].description;
                        downloadButton.href = `/download/${jsonResponse[i].filename}`;
                        sendFileName.value = jsonResponse[i].filename;
                    };

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


/* send file via email */
const sendFileForm = document.querySelector('.send-file form');
sendFileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // send get request with AJAX instead
    const filename = document.querySelector('#filename').value;
    const email = document.querySelector('#email').value;

    fetch(`/email?filename=${encodeURIComponent(filename)}&email=${encodeURIComponent(email)}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((jsonResponse) => {
            alert(jsonResponse.message);
        })
        .catch((err) => {
            console.log(err);
            alert('Error occured while sending email');
        });
});
