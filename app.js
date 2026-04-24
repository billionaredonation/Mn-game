// helpers ----------------------------------------------------
const $  = s => document.querySelector(s);
const show = id => {
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  $(id).classList.remove('hidden');
};

// Telegram Web App API (не критично, но красиво раскрывает окно)
window.Telegram?.WebApp?.expand();

// state ------------------------------------------------------
let state = JSON.parse(localStorage.getItem('player')) || { nickname: null };

// экран 0: старт --------------------------------------------
$('#btnStart').onclick = () => show('#nickname');

// экран 1: выбираем ник -------------------------------------
$('#btnNick').onclick = () => {
  const nick = $('#nickInput').value.trim();
  if (!/^[A-Za-zА-Яа-я0-9_]{3,16}$/.test(nick)) {
    alert('Ник 3–16 символов, буквы/цифры.');
    return;
  }
  state.nickname = nick;
  localStorage.setItem('player', JSON.stringify(state));
  enterMap();
};

// экран 2: карта-заглушка ------------------------------------
function enterMap() {
  $('#map').innerHTML = `<h2>Добро пожаловать, ${state.nickname}!</h2>
                         <p>Карта появится на следующем шаге 🗺️</p>`;
  show('#map');
}

// запуск -----------------------------------------------------
state.nickname ? enterMap() : show('#start');
