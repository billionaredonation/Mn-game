import { register, show } from '../../src/router.js';

register('welcome1', (root) => {
  root.className = 'page welcome1';
  root.innerHTML = `
    <h1>Привет, новичок!</h1>
    <p>Здесь позже появится красивый текст-затравка.</p>
    <button class="btn">Далее</button>
  `;
  root.querySelector('.btn').onclick = () => show('welcome2');
});
