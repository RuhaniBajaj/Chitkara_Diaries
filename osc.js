function setupSubmitConfirmation() {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();   
        const isConfirmed = confirm('Confirm submission for Open Source Chandigarh membership?');
        if (isConfirmed) {
            console.log('OSC Registration confirmed and ready for server submission.');
            alert('Thank you for registering! Your application to join Open Source Chandigarh has been received.');   
        } else {
            console.log('OSC Registration submission cancelled by user.');
        }
    });
}
document.addEventListener('DOMContentLoaded', setupSubmitConfirmation);