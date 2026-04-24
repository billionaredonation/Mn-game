const $   = s => document.querySelector(s);
const show = id => { document.querySelectorAll('.screen')
  .forEach(el=>el.classList.add('hidden')); $(id).classList.remove('hidden'); };

window.Telegram?.WebApp?.expand();

let state = JSON.parse(localStorage.getItem('player')) || { nickname:null };

$('#btnStart').onclick = () => show('#nickname');

$('#btnNick').onclick = () => {
  const nick = $('#nickInput').value.trim();
  if (!/^[A-Za-zА-Яа-я0-9_]{3,16}$/.test(nick)) { alert('Ник 3-16 символов.'); return; }
  state.nickname = nick;
  localStorage.setItem('player', JSON.stringify(state));
  enterMap();
};

function enterMap() {
  $('#map').innerHTML = `<h2>Добро пожаловать, ${state.nickname}!</h2>`;
  show('#map');
}

state.nickname ? enterMap() : show('#start');

// запуск -----------------------------------------------------
state.nickname ? enterMap() : show('#start');
