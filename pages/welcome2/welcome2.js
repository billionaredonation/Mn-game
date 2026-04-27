import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

register('welcome2', (root) => {
  root.className = 'page welcome2';

  root.innerHTML = `
    <div class="welcome2-card">
      <h2>Придумайте ник</h2>

      <p class="welcome2-subtitle">
        От 3 до 8 букв. Например: Yana або Богдан
      </p>

      <input
        id="nicknameInput"
        type="text"
        maxlength="8"
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

  function setInvalid(message) {
    error.textContent = message;
    nextBtn.disabled = true;
    nextBtn.classList.remove('active');
    return false;
  }

  function setValid() {
    error.textContent = '';
    nextBtn.disabled = false;
    nextBtn.classList.add('active');
    return true;
  }

  function validateNickname() {
    const value = input.value.trim();

    if (!value) return setInvalid('');
    if (value.length < 3) return setInvalid('Ник должен быть минимум 3 буквы');
    if (value.length > 8) return setInvalid('Ник должен быть максимум 8 букв');

    if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(value)) {
      return setInvalid('Ник должен содержать только буквы');
    }

    return setValid();
  }

  input.addEventListener('input', validateNickname);

  nextBtn.addEventListener('click', () => {
    if (!validateNickname()) return;

    state.nickname = input.value.trim();
    save();

    show('welcome3');
  });

  validateNickname();
});

  validateNickname();
});
