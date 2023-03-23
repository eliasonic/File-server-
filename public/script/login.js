/* Validate email */
let email = document.getElementById('email');
let loginForm = document.querySelector('.login form');
let regex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/; 

loginForm.onsubmit = (event) => {
    if (!email.value.match(regex)) {      //or if(!regex.text(email.value)) 
        event.preventDefault();
        alert('Please enter a valid email address');
    }
}

/* Autofill Admin email address*/
let admin = document.querySelector('.form-title span');
admin.onclick = () => {
    if (admin.style.color === 'rgba(255, 0, 0, 0.8)') {
        admin.style.color = 'blue';
        email.value = '';
    } else {
        admin.style.color = 'rgba(255, 0, 0, 0.8)';
        email.value = 'ea.main.app@gmail.com';
    }
};