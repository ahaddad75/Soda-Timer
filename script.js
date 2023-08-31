let sodaWindowStart;
let sodaWindowEnd;

function canActionToday(action) {
  const today = new Date().toDateString();
  const lastActionDay = localStorage.getItem(`last${action}Day`);
  return lastActionDay !== today;
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("clock").innerText = timeString;
}

setInterval(updateClock, 1000);
updateClock();

document.getElementById("start").addEventListener("click", function() {
  if (canActionToday("Start")) {
    sodaWindowStart = new Date();
    sodaWindowEnd = new Date(sodaWindowStart.getTime() + 60 * 60 * 1000);

    document.getElementById("timer").innerText = `Soda window ends at: ${sodaWindowEnd.toLocaleTimeString()}`;
    document.getElementById("status").innerText = "You can drink soda now!";

    const today = new Date().toDateString();
    localStorage.setItem("lastStartDay", today);

    updateHistory('Fenêtre ouverte');
    displayHistory();
  } else {
    document.getElementById("status").innerText = "Le timer a déjà été démarré aujourd'hui.";
  }
});

document.getElementById("stop").addEventListener("click", function() {
  if (canActionToday("Stop")) {
    const now = new Date();
    if (now > sodaWindowEnd) {
      document.getElementById("status").innerText = "Sorry, time's up! No more soda for today.";
      updateHistory('Fenêtre fermée (Trop tard)');
    } else {
      document.getElementById("status").innerText = "Timer stopped but still within the window. Hurry!";
      updateHistory('Fenêtre fermée (Dans les temps)');
    }

    const today = new Date().toDateString();
    localStorage.setItem("lastStopDay", today);

    displayHistory();
  } else {
    document.getElementById("status").innerText = "Le timer a déjà été arrêté aujourd'hui.";
  }
});

function updateHistory(action) {
  const now = new Date();
  const history = JSON.parse(localStorage.getItem('sodaHistory') || '[]');
  history.push({ action, time: now.toLocaleString() });
  localStorage.setItem('sodaHistory', JSON.stringify(history));
}

function displayHistory() {
  const historyList = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem('sodaHistory') || '[]');
  historyList.innerHTML = '';
  for (const entry of history) {
    const listItem = document.createElement('li');
    listItem.innerText = `${entry.action} à ${entry.time}`;
    historyList.appendChild(listItem);	
  }
}

document.getElementById("clearHistory").addEventListener("click", function() {
  localStorage.removeItem('sodaHistory');
  displayHistory();
});
document.getElementById("reset").addEventListener("click", function() {
    // Réinitialiser le localStorage
    localStorage.clear();
  
    // Réinitialiser les valeurs de sodaWindowStart et sodaWindowEnd
    sodaWindowStart = null;
    sodaWindowEnd = null;
  
    // Effacer l'historique affiché
    displayHistory();
  
    // Réinitialiser le texte d'état
    document.getElementById("status").innerText = "Prêt à démarrer le timer.";
  
    // Réinitialiser le timer
    document.getElementById("timer").innerText = "";
});