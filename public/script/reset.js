/* Check for matching passwords */
let resetForm = document.querySelector('.reset-password form');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeat-password');

resetForm.onsubmit = (event) => {
    if (repeatPassword.value !== password.value) {
        event.preventDefault();
        alert('Passwords do not match!');
    }
}