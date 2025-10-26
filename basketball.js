function setupTableFiltering() {
    const filter = document.getElementById('levelFilter');
    const tableBody = document.querySelector('.achievements-table tbody');
    const rows = tableBody.querySelectorAll('tr');

    filter.addEventListener('change', (event) => {
        const selectedLevel = event.target.value;

        rows.forEach(row => {
            const levelCell = row.cells[1];

            if (selectedLevel === 'all' || levelCell.textContent.trim() === selectedLevel) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', setupTableFiltering);

//submit button
document.addEventListener('DOMContentLoaded', setupTableFiltering);
function setupSubmitConfirmation() {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const isConfirmed = confirm('Are you sure you want to submit your registration for the team?');
        if (isConfirmed) {            
            console.log('Form submission confirmed and ready to be sent!');
            alert('Registration successful! (Demo mode)');
        } else {
            console.log('Form submission cancelled.');
        }
    });
}
document.addEventListener('DOMContentLoaded', setupSubmitConfirmation);