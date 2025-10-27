document.querySelectorAll(".card").forEach((card) => {
    const options = card.querySelectorAll(".options label");
    const button = card.querySelector(".submit-btn");
    const questionName = card.querySelector("input[type='radio']").name;

    // Track votes (simulate DB)
    let votes = {};
    options.forEach(label => {
        // Use the actual text of the label as the key for voting
        const optionText = label.textContent.trim();
        votes[optionText] = 0;
        // Make sure the radio button has the value set! (Crucial HTML fix from step 1)
        const radioInput = label.querySelector("input[type='radio']");
        if (radioInput.value === "") {
             radioInput.value = optionText; // Set the value dynamically if you can't edit HTML
        }
    });

    button.addEventListener("click", () => {
        const selected = card.querySelector(`input[name='${questionName}']:checked`);
        if (!selected) {
            alert("Please select an option first!");
            return;
        }

        // Increment selected vote using the radio button's value (which is the option text)
        const selectedOptionText = selected.value;
        if (votes.hasOwnProperty(selectedOptionText)) {
            votes[selectedOptionText]++;
        } else {
            // This case should ideally not happen if HTML fix is applied, but adds robustness
            votes[selectedOptionText] = 1;
        }

        // Total votes
        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

        // Clear options first and remove old elements
        const optionDiv = card.querySelector(".options");
        optionDiv.innerHTML = "";

        // Find highest-voted option
        const maxVotes = totalVotes > 0 ? Math.max(...Object.values(votes)) : 0;

        // Rebuild options with percentage bars
        Object.keys(votes).forEach(opt => {
            const currentVotes = votes[opt];
            const percentage = totalVotes > 0 ? ((currentVotes / totalVotes) * 100).toFixed(1) : (0).toFixed(1);
            const isMostVoted = totalVotes > 0 && currentVotes === maxVotes;

            const optionHTML = `
                <div class="percentage-option ${isMostVoted ? "most-voted" : ""}">
                    <div><strong>${opt}</strong> - ${percentage}% (${currentVotes} votes)</div>
                    <div class="percentage-bar">
                        <div class="fill" style="width: ${percentage}%;"></div>
                    </div>
                </div>
            `;
            optionDiv.insertAdjacentHTML("beforeend", optionHTML);
        });

        // Add a total vote count
        optionDiv.insertAdjacentHTML("beforeend", `<div class="vote-info">Total Votes: ${totalVotes}</div>`);

        button.disabled = true;
        button.innerText = "Voted ✔";
        button.style.background = "#9ca3af";
    });
});