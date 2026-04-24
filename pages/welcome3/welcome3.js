import { register, show } from '../../src/router.js';
import { state, save }    from '../../src/state.js';

const MAP_IMG = 'assets/maps/zaporizhzhia.png';   // заглушка

register('welcome3', (root) => {
  root.className = 'page welcome3';
  root.innerHTML = `
    <h2>Выбери стартовый город</h2>
    <div class="map-wrapper">
      <img id="cityMap" src="${MAP_IMG}" alt="map" />
    </div>
    <button class="btn">Далее</button>
  `;

  const img = root.querySelector('#cityMap');
  img.onclick = () => {
    state.city = 'zaporizhzhia';      // пока жёстко, позже заменим логикой
    save();
    alert('Город выбран: Запорожье');
  };

  root.querySelector('.btn').onclick = () => {
    if (!state.city) {
      alert('Сначала кликни по карте, чтобы выбрать город!');
      return;
    }
    show('home');
  };
});
