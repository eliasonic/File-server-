/* Validate email */
let email = document.getElementById('email');
let signUpForm = document.querySelector('.sign-up form');
let regex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/; 

signUpForm.onsubmit = (event) => {
    if (!email.value.match(regex)) {       
        event.preventDefault();
        alert('Please enter a valid email address');
    }
}

/* Show password */
let showPassword = document.querySelector('#show-password');
let password = document.querySelector('#password');
showPassword.onclick = () => {
    if (password.type === 'text') {
        password.type = 'password';
    } else {
        password.type = 'text';
    }
};