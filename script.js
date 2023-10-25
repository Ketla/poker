document.addEventListener('DOMContentLoaded', updateBuyInDisplay);

document.addEventListener('DOMContentLoaded', () => {
  loadPlayerData(); // Call the function to load player data and Buy-In Amount
  console.log(buyInAmount);
});


const buyInAmountInput = document.getElementById('buy-in-amount');
const setBuyInButton = document.getElementById('set-buy-in');
const buyInAmountDisplay = document.getElementById('buy-in-amount-display');

let buyInAmount = 0; // Default value

setBuyInButton.addEventListener('click', () => {
    // Get the current value from the input
    let inputValue = buyInAmountInput.value.trim();

    // Validate the inputValue, e.g., check if it's a number, not negative, etc.
    // Here, we're just checking if it's not empty
    if (inputValue) {
        buyInAmount = inputValue;
        localStorage.setItem('buyInAmount', buyInAmount);
        console.log(`Buy-In Amount stored in localStorage: ${buyInAmount}`);

        setBuyInButton.disabled = true;
        buyInAmountInput.disabled = true;
    
        updateBuyInDisplay();
    } else {
      alert("Please enter a valid amount.");
    }

});

function updateBuyInDisplay() {
  // Retrieve the stored value from localStorage
  let storedValue = localStorage.getItem('buyInAmount');

  // If there's a stored value, update the display and style
  if (storedValue) {
      buyInAmountDisplay.innerHTML = `Buy-In Amount Per Player: ${storedValue}`;
      buyInAmountDisplay.classList.add('set');

      setBuyInButton.disabled = true;
      buyInAmountInput.disabled = true;
  }
}

let players = [];

const addPlayerInput = document.getElementById('player-name');
const addPlayerButton = document.getElementById('add-player');
const playersListDiv = document.getElementById('players-list');

addPlayerButton.addEventListener('click', () => {
  const playerName = addPlayerInput.value.trim();

  if (buyInAmount === 0) {
    alert("Buy-In Amount must be set before adding players.");
    return; // Exit the function
}
  // Check if player name is at least 5 characters long
  if (playerName.length < 5) {
      alert("Player name must be at least 5 characters long.");
      return; // Exit the function
  }

  // Check if player name already exists
  const nameExists = players.some(player => 
    player.name && player.name.toLowerCase() === playerName.toLowerCase()
);
  
  if (nameExists) {
      alert("Player name already exists. Please enter a different name.");
      return; // Exit the function
  }

  players.push({
      name: playerName,
      buyin: buyInAmount,
      rebuyCount: 0,
      finalPlacement: 0,
      winnings: 0,
      originalBuyin: buyInAmount
  });

  updateTotalBuyIn();
  addPlayerToDisplay(playerName, buyInAmount);

  addPlayerInput.value = '';

});

const playersDataDiv = document.getElementById('players-data');

function addPlayerToDisplay(name, buyin) {
  const playerDiv = document.createElement('div');
  playerDiv.className = 'player-row';

  const removeButton = document.createElement('button');
  removeButton.innerHTML = 'Remove';
  removeButton.addEventListener('click', () => {
      removePlayer(name);
      playerDiv.remove();
  });

  playerDiv.innerHTML = `
      <span>${name}</span>
      <span>${buyin}</span>
  `;

  playerDiv.appendChild(removeButton);
  playersListDiv.appendChild(playerDiv);

  console.log(players);

}

function removePlayer(name) {
  players = players.filter(player => player.name !== name);

  updateTotalBuyIn();

  console.log(players);

}

function updateTotalBuyIn() {
  const total = players.reduce((sum, player) => sum + Number(player.buyin), 0);
  const totalDisplay = document.getElementById('total-buyin-display');
  totalDisplay.innerHTML = `${players.length} Players & Total Buy-In Amount <span class="bold-number">${total}</span>`;
}

function handleRebuy(playerName) {
  // Find the player in the players array
  const player = players.find(p => p.name === playerName);
  
  if (!player) return;

  // Increment the player's rebuy count
  player.rebuyCount++;

  // Update the player's total buy-in
  player.buyin += buyInAmount;

  // Update the total buy-in for all players
  updateTotalBuyIn();

  // Optional: Update the UI to reflect the new rebuy count for the player
}

document.getElementById('start-game').addEventListener('click', function() {
  
  const paymentData = paymentStructure(); // Get payment data
  if (paymentData) {
    // Save paymentData in localStorage
    localStorage.setItem('paymentData', JSON.stringify(paymentData));

  localStorage.setItem('players', JSON.stringify(players));
  window.location.href = 'gameLive.html';
  }
});

const clearLocalDataButton = document.getElementById('clear-local-data');
clearLocalDataButton.addEventListener('click', () => {
  
  let userResponse = confirm("Are you sure you want to do this?");

  if (userResponse) {
  // Clear the local storage data
  localStorage.removeItem('players');
  localStorage.removeItem('buyInAmount');
  localStorage.removeItem('rebuyLog');
  buyInAmountDisplay.innerHTML = "";
  // Optionally, you can also clear the displayed player list on the page
  playersListDiv.innerHTML = '';
  console.log(players);
  console.log(buyInAmount);
  location.reload();
  }
});

// ...

function loadPlayerData() {
  const storedPlayers = JSON.parse(localStorage.getItem('players'));
  if (storedPlayers && Array.isArray(storedPlayers)) {
    players = storedPlayers;
    // Populate the player list when the page loads
    players.forEach(player => {
      addPlayerToDisplay(player.name, player.buyin);
    });
    updateTotalBuyIn();
  }
  // Load Buy-In Amount Per Player if it exists in local storage
  const storedBuyInAmount = localStorage.getItem('buyInAmount');
  if (storedBuyInAmount !== null) {
    buyInAmount = storedBuyInAmount;
    buyInAmountDisplay.innerHTML = `Buy-In Amount Per Player: ${buyInAmount}`;
  }
}

function paymentStructure() {
  const firstPlacePercentage = document.getElementById('1-payment-structure-data').value;
  const secondPlacePercentage = document.getElementById('2-payment-structure-data').value;
  const thirdPlacePercentage = document.getElementById('3-payment-structure-data').value;
  const fourthPlacePercentage = document.getElementById('4-payment-structure-data').value;

  // Parse the input values as integers
  const firstPlaceValue = parseInt(firstPlacePercentage, 10) || 0;
  const secondPlaceValue = parseInt(secondPlacePercentage, 10) || 0;
  const thirdPlaceValue = parseInt(thirdPlacePercentage, 10) || 0;
  const fourthPlaceValue = parseInt(fourthPlacePercentage, 10) || 0;

  // Calculate the total
  const calcIfCorrect = firstPlaceValue + secondPlaceValue + thirdPlaceValue + fourthPlaceValue;

  if (calcIfCorrect !== 100) {
    alert('Payment Structure wrong, total % of winnings must be 100%');
    return null; // Indicate that there's an error
  }

  // Return true if everything is correct
  const paymentData = {
    firstPlace: firstPlaceValue,
    secondPlace: secondPlaceValue,
    thirdPlace: thirdPlaceValue,
    fourthPlace: fourthPlaceValue
  };

  return paymentData;

}


