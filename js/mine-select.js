import { supabase } from './supabase.js';
import { toast }    from './common.js';

const tgId = Telegram.WebApp.initDataUnsafe.user.id;

(async () => {
  /* узнаём уровень шахтёра */
  const { data:p } = await supabase
      .from('players')
      .select('miner_lvl')
      .eq('tg_id', tgId)
      .single();

  const normalBtn = document.getElementById('btn-normal');
  const rareBtn   = document.getElementById('btn-rare');

  /* открываем редкую, если lvl ≥ 4 */
  if (p.miner_lvl >= 4) rareBtn.classList.remove('locked');

  /* маршруты */
  normalBtn.onclick = () => location.href = 'mine.html';               // старая шахта
  rareBtn.onclick   = () => {
    if (p.miner_lvl < 4) { toast('Редкая откроется на 4-м уровне'); }
    else { location.href = 'GL_Displays/mine-rare.html'; }             // новая шахта
  };
})();
