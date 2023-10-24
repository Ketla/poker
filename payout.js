

const players = JSON.parse(localStorage.getItem('players')) || [];

const paymentData = JSON.parse(localStorage.getItem('paymentData'));

console.log(players);

console.log(paymentData);

const totalPot = JSON.parse(localStorage.getItem('totalPot'));

console.log(totalPot);

//BIG PLAYER LIST
const playersListDiv = document.getElementById('player-list');

players.forEach((player, index) => {
    const select = document.createElement('select');
    select.id = `rank${index + 1}`;

        // Create the placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.innerText = "Select Player";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
    
        // Append the placeholder option to the select
        select.appendChild(placeholderOption);

    players.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.innerText = p.name;
        select.appendChild(option);
    });

    const label = document.createElement('label');
    label.innerHTML = `Rank ${index + 1}: `;
    label.appendChild(select);

    playersListDiv.appendChild(label);
    playersListDiv.appendChild(document.createElement('br'));
});

document.getElementById("saveRanks").addEventListener("click", function() {
    const selectedPlayers = [];
    players.forEach((player, index) => {
        const selectedPlayerName = document.getElementById(`rank${index + 1}`).value;
        selectedPlayers.push(selectedPlayerName);
        players.find(p => p.name === selectedPlayerName).finalPlacement = index + 1;
    });
    
    const uniqueSelectedPlayers = [...new Set(selectedPlayers)];
    if (uniqueSelectedPlayers.length !== players.length) {
        alert('Please make sure each player has a unique rank.');
        return;
    }

    // Store updated data to localStorage
    localStorage.setItem('players', JSON.stringify(players));

    document.getElementById('estimate-payouts-button').style.display = 'inline-block';

});

// Listen for changes in one dropdown and adjust the options in other dropdowns
const rankDropdowns = document.querySelectorAll("select");
rankDropdowns.forEach(dropdown => {
    dropdown.addEventListener("change", function() {
        const selectedPlayer = this.value;

        // Disable the selected player in other dropdowns
        rankDropdowns.forEach(otherDropdown => {
            if (otherDropdown !== this) {
                const optionToDisable = otherDropdown.querySelector(`option[value="${selectedPlayer}"]`);
                if (optionToDisable) optionToDisable.disabled = true;
            }
        });

        // Enable previously disabled options if they are not selected in any dropdown
        rankDropdowns.forEach(d => {
            if (d !== this) {
                d.querySelectorAll("option").forEach(opt => {
                    if (!Array.from(rankDropdowns).some(dd => dd.value === opt.value)) {
                        opt.disabled = false;
                    }
                });
            }
        });
    });
});



//Total Buyin Display:
const total = players.reduce((sum, player) => sum + Number(player.buyin), 0);
const totalDisplay = document.getElementById('total-buyin-display');

let totalRebuyCount = players.reduce((total, player) => total + player.rebuyCount, 0);

totalDisplay.innerHTML = `${players.length} Players & Total Pot Amount <span class="bold-number">${total}</span> [ ${totalRebuyCount} Total Rebuys ]`;

// Select the button element by its ID
const payoutsButton = document.getElementById('estimate-payouts-button');

// Select the list container
const finalPlacementListContainer = document.getElementById('final-placement-list-container');

// Add a click event listener to the button
payoutsButton.addEventListener('click', () => {
  // Clear the previous content of the list container
  finalPlacementListContainer.innerHTML = '';

  // Sort the players array by finalPlacement
  players.sort((a, b) => a.finalPlacement - b.finalPlacement);

  console.log(players);

  // Loop through sorted players and add them to the list container
  players.forEach(player => {
    const playerDiv = document.createElement('div');
    
    playerDiv.className = 'final-placement-list';

    let winnings = 0;

    
      if (player.finalPlacement === 1) {
        winnings = totalPot * (paymentData.firstPlace / 100);
        player.winnings = winnings;
        playerDiv.innerHTML = 
        `
        <span>
        <strong>${player.finalPlacement}. </strong>
        ${player.name}  - Winnings: ${winnings} (${paymentData.firstPlace}% of ${totalPot})</span>
      `;
      } else if (player.finalPlacement === 2) {
        winnings = totalPot * (paymentData.secondPlace / 100);
        player.winnings = winnings;
        playerDiv.innerHTML = 
        `
        <span>
        <strong>${player.finalPlacement}. </strong>
        ${player.name}  - Winnings: ${winnings} (${paymentData.secondPlace}% of ${totalPot})</span>
      `;
      } else if (player.finalPlacement === 3) {
        winnings = totalPot * (paymentData.thirdPlace / 100);
        player.winnings = winnings;
        playerDiv.innerHTML = 
        `
        <span>
        <strong>${player.finalPlacement}. </strong>
        ${player.name}  - Winnings: ${winnings} (${paymentData.thirdPlace}% of ${totalPot})</span>
      `;
      } else if (player.finalPlacement === 4) {
        winnings = totalPot * (paymentData.fourthPlace / 100);
        player.winnings = winnings;
              playerDiv.innerHTML = 
      `
      <span>
      <strong>${player.finalPlacement}. </strong>
      ${player.name}  - Winnings: ${winnings} (${paymentData.fourthPlace}% of ${totalPot}</span>
    `;
      }
      player.winnings = winnings;
    


    
    finalPlacementListContainer.appendChild(playerDiv);
  });
  document.getElementById('calculate-transfers-button').style.display = 'inline-block';
});



// Attach an event listener to the button
const calculateTransfersButton = document.getElementById(
  "calculate-transfers-button"
);
calculateTransfersButton.addEventListener("click", function () {
  calculateMoneyTransfers(players);

});

function calculateMoneyTransfers(players) {
  // Convert string values to numbers for accurate calculations
  players.forEach((player) => {
    player.buyin = Number(player.buyin);
    player.winnings = Number(player.winnings);
    player.oweAmount = player.buyin - player.winnings;
  });

  const creditors = players.filter(p => p.oweAmount < 0).sort((a, b) => b.oweAmount - a.oweAmount);
  const debtors = players.filter(p => p.oweAmount > 0).sort((a, b) => a.oweAmount - b.oweAmount);

  const transfers = [];

  while(debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const transferAmount = Math.min(debtor.oweAmount, Math.abs(creditor.oweAmount));

    transfers.push({
      from: debtor.name,
      to: creditor.name,
      amount: transferAmount
    });

    debtor.oweAmount -= transferAmount;
    creditor.oweAmount += transferAmount;

    if(debtor.oweAmount === 0) {
      debtors.shift();
    }

    if(creditor.oweAmount === 0) {
      creditors.shift();
    }
  }
  displayTransfers(transfers);
  
}

function displayTransfers(transfers) {
  // Get the container
  const container = document.getElementById("debt-transfer-container");
  container.innerHTML = "";
  
  // Create the table and headers
  const table = document.createElement("table");
  table.id = "transfersTable";
  
  const headerRow = document.createElement("tr");
  const fromHeader = document.createElement("th");
  fromHeader.textContent = "From";
  const toHeader = document.createElement("th");
  toHeader.textContent = "To";
  const amountHeader = document.createElement("th");
  amountHeader.textContent = "Amount";
  
  headerRow.appendChild(fromHeader);
  headerRow.appendChild(toHeader);
  headerRow.appendChild(amountHeader);
  table.appendChild(headerRow);
  
  // Populate the table with transfer data
  transfers.forEach(transfer => {
      const row = document.createElement("tr");
  
      const fromCell = document.createElement("td");
      fromCell.textContent = transfer.from;
      row.appendChild(fromCell);
  
      const toCell = document.createElement("td");
      toCell.textContent = transfer.to;
      row.appendChild(toCell);
  
      const amountCell = document.createElement("td");
      amountCell.textContent = transfer.amount;
      row.appendChild(amountCell);
  
      table.appendChild(row);
  });
  
  // Append the table to the container
  container.appendChild(table);
  
}

document.getElementById("randomizeRanks").addEventListener("click", function() {
  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());

  shuffledPlayers.forEach((player, index) => {
      const dropdown = document.getElementById(`rank${index + 1}`);
      if (dropdown) {
          dropdown.value = player.name;
      }
  });
});




