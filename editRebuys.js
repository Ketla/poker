// Call updateLogText to initially populate the log when the page loads


const players = JSON.parse(localStorage.getItem('players')) || [];
const playersListDiv = document.getElementById('players-list');

// Loop through the players and add them to the players-list*/




players.forEach(player => {
  const playerDiv = document.createElement('div');
  playerDiv.className = 'player-row';

  const saveNewRebuyButton = document.createElement('button');

  saveNewRebuyButton.innerHTML = 'Save';
  saveNewRebuyButton.addEventListener('click', () => {
    const rebuyInput = document.querySelector(`#rebuy-input-${player.name}`);
    saveNewRebuyValue(player, playerDiv, rebuyInput);
  });

  playerDiv.innerHTML = `
    <span>${player.name} <strong>[ ${player.rebuyCount} ]</strong></span>
    <input type="number" value="${player.rebuyCount}" id="rebuy-input-${player.name}">
  `;

  playerDiv.appendChild(saveNewRebuyButton);
  playersListDiv.appendChild(playerDiv);
});


function saveNewRebuyValue(player, playerDiv, rebuyInput) {
  // Get the new rebuyCount value from the input field
  
  const inputValue = parseInt(rebuyInput.value, 10);

  if (!isNaN(inputValue)) {

  const oldRebuyCount = player.rebuyCount;
  const newRebuyCount = parseInt(rebuyInput.value, 10);

  // Calculate the amount to increase the buyin by oringalbuyin
  
  const buyinIncrease = player.originalBuyin * (newRebuyCount - oldRebuyCount);

  player.rebuyCount = newRebuyCount;

  player.buyin = String(Number(player.buyin) + buyinIncrease);

  console.log(players);

  playerDiv.querySelector('strong').textContent = `[ ${newRebuyCount} ]`;

  // Update the localStorage with the modified players array
  localStorage.setItem('players', JSON.stringify(players));

  rebuyLogger(oldRebuyCount, newRebuyCount, player);
  } else {
    alert("Please enter a valid amount.");
  }

}

function rebuyLogger(oldRebuyCount, newRebuyCount, player) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();
  const logEntry = `(${formattedDate}) ${player.name} ${oldRebuyCount} --> ${newRebuyCount}`;

  // Load existing log entries from localStorage
  let logEntries = JSON.parse(localStorage.getItem('rebuyLog')) || [];

  // Add the new log entry to the array
  logEntries.push(logEntry);

  // Save the updated log entries back to localStorage
  localStorage.setItem('rebuyLog', JSON.stringify(logEntries));

  // Update the display with all log entries
  displayLogEntries(logEntries);
}

function displayLogEntries(logEntries) {
  const rebuyLogText = document.getElementById('rebuy-logg');
  rebuyLogText.innerHTML = logEntries.join('<br>');
}

// Load and display log entries when the page loads
window.addEventListener('load', () => {
  const logEntries = JSON.parse(localStorage.getItem('rebuyLog')) || [];
  displayLogEntries(logEntries);
});





// Select the button element by its ID
const backButton = document.getElementById('back-to-game');

// Add a click event listener to the button
backButton.addEventListener('click', () => {
  // Navigate back to the gameLive.html page
  window.location.href = 'gameLive.html'; // Adjust the URL as needed
  console.log('lol');
});



