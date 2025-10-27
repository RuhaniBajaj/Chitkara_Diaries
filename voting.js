// --- 1. GLOBAL VARIABLES ---
let allReviews = {}; // Will be filled from the server
let allPossibleOptions = []; // Will be filled with all unique radio button values

// --- 2. HELPER FUNCTION TO UPDATE REVIEW PANEL ---
function updateReviewPanel(optionName) {
    const reviewContent = document.getElementById('reviewContent');
    reviewContent.innerHTML = "";
    const reviews = allReviews[optionName];

    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
            const reviewHTML = `
                <div class="review-card">
                    <p class="review-text">"${review.text}"</p>
                    <span class="review-option">For: <strong>${optionName}</strong></span>
                    <span class="review-author">- ${review.author}</span>
                </div>
            `;
            reviewContent.insertAdjacentHTML("beforeend", reviewHTML);
        });
    } else {
        reviewContent.innerHTML = `<p class="no-reviews">No reviews for <strong>${optionName}</strong> yet.</p>`;
    }
}

// --- 3. MAIN VOTING SCRIPT ---
function initializeVoting() {
    document.querySelectorAll(".card").forEach((card) => {
        const options = card.querySelectorAll(".options label");
        const button = card.querySelector(".submit-btn");
        if (!card.querySelector("input[type='radio']")) return;

        const questionName = card.querySelector("input[type='radio']").name;
        let votes = {};
        options.forEach(label => {
            const radio = label.querySelector("input[type='radio']");
            if (radio) votes[radio.value] = 0;
        });

        button.addEventListener("click", () => {
            const selected = card.querySelector(`input[name='${questionName}']:checked`);
            if (!selected) {
                alert("Please select an option first!");
                return;
            }
            votes[selected.value]++;

            const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
            const optionDiv = card.querySelector(".options");
            optionDiv.innerHTML = "";
            const maxVotes = totalVotes > 0 ? Math.max(...Object.values(votes)) : 0; // Handle case with 0 votes
            let winningOption = null;

            Object.keys(votes).forEach(opt => {
                const currentVotes = votes[opt];
                // Prevent division by zero if totalVotes is 0
                const percentage = totalVotes > 0 ? ((currentVotes / totalVotes) * 100).toFixed(1) : 0;
                const isMostVoted = totalVotes > 0 && currentVotes === maxVotes;
                if (isMostVoted && !winningOption) winningOption = opt;

                optionDiv.insertAdjacentHTML("beforeend", `
                    <div class="percentage-option ${isMostVoted ? "most-voted" : ""}">
                        <div><strong>${opt}</strong> - ${percentage}% (${currentVotes} votes)</div>
                        <div class="percentage-bar">
                            <div class="fill" style="width: ${percentage}%;"></div>
                        </div>
                    </div>`);
            });

            optionDiv.insertAdjacentHTML("beforeend", `<div class="vote-info">Total Votes: ${totalVotes}</div>`);
            if (winningOption) updateReviewPanel(winningOption);
            button.disabled = true;
            button.innerText = "Voted ✔";
            button.style.background = "#9ca3af";
        });
    });
}

// --- 4. MODAL AND FORM LOGIC ---
function initializeModal() {
    const modalOverlay = document.getElementById('reviewModalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const reviewForm = document.getElementById('reviewForm');
    const reviewOptionSelect = document.getElementById('reviewOptionSelect');
    const showModalBtn = document.getElementById('showReviewModalBtn');

    function openModal() {
        reviewOptionSelect.innerHTML = ""; // Clear old options
        allPossibleOptions.forEach(optionValue => {
            const optionEl = document.createElement('option');
            optionEl.value = optionValue;
            optionEl.textContent = optionValue;
            reviewOptionSelect.appendChild(optionEl);
        });
        modalOverlay.classList.add('active');
    }

    function closeModal() { modalOverlay.classList.remove('active'); }

    showModalBtn.addEventListener('click', openModal);

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('reviewAuthor').value;
        const optionName = reviewOptionSelect.value;
        const text = document.getElementById('reviewText').value;
        const newReview = { author, text, optionName }; // Include optionName for the server

        // Send the review to the server
        fetch('/add-review', { // Target the server endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReview)
        })
        .then(response => {
            if (!response.ok) { // Check if response status is 2xx
                // Try to get error message from server response body
                return response.json().then(errData => {
                    throw new Error(errData.error || `Server responded with status: ${response.status}`);
                });
            }
            return response.json(); // Parse successful JSON response
        })
        .then(data => {
            // Server confirmed save. Update local list.
            if (!allReviews[optionName]) {
                allReviews[optionName] = [];
            }
            // Add only author and text to local list, as optionName is the key
            allReviews[optionName].push({ author: newReview.author, text: newReview.text });

            closeModal();
            reviewForm.reset();
            updateReviewPanel(optionName); // Show the updated reviews
            alert(data.message); // Show success message from server
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            alert(`Error: Could not save review. ${error.message}`); // Show detailed error
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// --- 5. INITIALIZATION SCRIPT ---
document.addEventListener("DOMContentLoaded", () => {
    // Scan the page for all possible review options
    const optionSet = new Set();
    document.querySelectorAll('.options input[type="radio"]').forEach(radio => {
        optionSet.add(radio.value);
    });
    allPossibleOptions = Array.from(optionSet).sort();

    // Fetch initial reviews from the server
    fetch('/reviews') // Target the server endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            allReviews = data; // Store fetched reviews globally
            initializeVoting(); // Setup voting logic
            initializeModal();  // Setup modal logic
            console.log("Reviews loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading initial reviews:", error);
            alert("Could not load initial reviews. Displaying page without them. Check if server is running.");
            // Initialize anyway so the site doesn't completely break
            initializeVoting();
            initializeModal();
        });
});