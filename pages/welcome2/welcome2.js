import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

register('welcome2', (root) => {
  root.className = 'page welcome2';

  root.innerHTML = `
    <div class="welcome2-card">
      <h2>Придумайте ник</h2>

      <p class="welcome2-subtitle">
        От 3 до 6 символов. Например: Yana або Богдан
      </p>

      <input
        id="nicknameInput"
        type="text"
        maxlength="6"
        placeholder="Ваш ник"
        autocomplete="off"
      />

      <p class="welcome2-error" id="nicknameError"></p>

      <button class="btn" id="nextBtn" disabled>
        Далі
      </button>
    </div>
  `;

  const input = root.querySelector('#nicknameInput');
  const error = root.querySelector('#nicknameError');
  const nextBtn = root.querySelector('#nextBtn');

  const nicknameRegex = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]{3,6}$/;

  function validateNickname() {
    const value = input.value.trim();

    if (!value) {
      error.textContent = '';
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
      return false;
    }

    if (!nicknameRegex.test(value)) {
      error.textContent = 'Ник должен быть от 3 до 6 букв без символов и цифр';
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
      return false;
    }

    error.textContent = '';
    nextBtn.disabled = false;
    nextBtn.classList.add('active');
    return true;
  }

  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ]/g, '');
    validateNickname();
  });

  nextBtn.addEventListener('click', () => {
    if (!validateNickname()) return;

    state.nickname = input.value.trim();
    save();

    show('welcome3');
  });
});
