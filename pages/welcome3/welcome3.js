import { register, show } from '../../src/router.js';
import { state, save }    from '../../src/state.js';

const MAP_IMG = 'assets/maps/zaporizhzhia.png';      // временный фон

register('welcome3', (root) => {
  root.className = 'page welcome3';
  root.innerHTML = `
    <h2>Выбери стартовый город</h2>
    <div class="map-wrapper">
      <img id="cityMap" src="${MAP_IMG}" alt="map" />
    </div>
    <button class="btn">Далее</button>`;

  const img = root.querySelector('#cityMap');
  img.onclick = (e) => {
    const rect = img.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width)  * 100);
    const y = Math.floor(((e.clientY - rect.top)  / rect.height) * 100);
    alert(`Координаты клика: ${x}%, ${y}%`);          // временная «интерактивность»
    // TODO: позже — определить город/точку
    state.city = 'zaporizhzhia';
    save();
  };

  root.querySelector('.btn').onclick = () => {
    if (!state.city) return alert('Кликни на карту, чтобы выбрать город!');
    show('home');
  };
});
