function initFarmScreen() {
  const board = document.getElementById("farmBoard");
  const backBtn = document.getElementById("farmBackBtn");

  let hits = 0;
  let mistakes = 0;

  function renderBoard() {
    board.innerHTML = "";

    for (let i = 0; i < 16; i++) {
      const btn = document.createElement("button");
      btn.className = "farm-cell";

      const roll = Math.random();

      if (roll < 0.45) {
        btn.textContent = "🌾";
        btn.onclick = () => {
          hits++;
          alert("Урожай собран");
          renderBoard();
        };
      } else if (roll < 0.65) {
        btn.textContent = "🐛";
        btn.onclick = () => {
          mistakes++;
          alert("Это вредитель!");
          renderBoard();
        };
      } else {
        btn.textContent = "";
        btn.onclick = () => renderBoard();
      }

      board.appendChild(btn);
    }
  }

  renderBoard();

  if (backBtn) {
    backBtn.onclick = () => {
      loadScreen("GL_Displays/work.html", initWorkScreen);
    };
  }
                 }
