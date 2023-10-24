document.addEventListener('DOMContentLoaded', () => {
  // Call the updateTotalBuyIn() function when the page is fully loaded
  updateTotalBuyIn();
});

const players = JSON.parse(localStorage.getItem('players')) || [];

const playersListDiv = document.getElementById('players-list');

// Loop through the players and add them to the players-list

players.forEach(player => {
  const playerDiv = document.createElement('div');
  playerDiv.className = 'player-row';

  const rebuyButton = document.createElement('button');

  rebuyButton.addEventListener('click', () => {
    setTimeout(() => {
        rebuyButton.style.backgroundColor = "#007BFF";
    }, 10); // 10 seconds delay
  });

  rebuyButton.innerHTML = 'Rebuy';
  rebuyButton.addEventListener('click', () => {
    handleRebuy(player.name);
  });

  playerDiv.innerHTML = `
    <span>${player.name}</span>
    <span>${player.buyin} <strong>[ ${player.rebuyCount} ]</strong></span>
  `;

  updateTotalBuyIn();

  playerDiv.appendChild(rebuyButton);
  playersListDiv.appendChild(playerDiv);
});


function handleRebuy(playerName) {
  // Find the player in the players array
  const player = players.find(p => p.name === playerName);

  if (!player) return;

  // Increment the player's rebuy count
  player.rebuyCount++;

  // Update the player's total buy-in (adding 200)
  player.buyin = String(Number(player.buyin) + Number(player.originalBuyin));

  // Update the total buy-in for all players
  updateTotalBuyIn();

  // Optional: Update the UI to reflect the new rebuy count and buy-in amount for the player
  const playerDivs = document.querySelectorAll('.player-row');
  playerDivs.forEach(div => {
    const spanElements = div.getElementsByTagName('span');
    const playerNameSpan = spanElements[0];
    const playerBuyInSpan = spanElements[1];
    
    if (playerNameSpan.textContent === playerName) {
      // Update the displayed buy-in and add the rebuy count in parentheses
      playerBuyInSpan.innerHTML = `${player.buyin} <strong>[ ${player.rebuyCount} ]</strong>`;
    }
  });
  localStorage.setItem('players', JSON.stringify(players));

  console.log(players);
}

function updateTotalBuyIn() {
  const total = players.reduce((sum, player) => sum + Number(player.buyin), 0);
  const totalDisplay = document.getElementById('total-buyin-display');

  let totalRebuyCount = players.reduce((total, player) => total + player.rebuyCount, 0);

  totalDisplay.innerHTML = `${players.length} Players & Total Pot Amount <span class="bold-number">${total}</span> [ ${totalRebuyCount} ]`;

  localStorage.setItem('totalPot', JSON.stringify(total));
}

document.getElementById('go-to-payout').addEventListener('click', function() {
  window.location.href = 'payout.html';
});