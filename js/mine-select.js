import { supabase } from './supabase.js';
import { toast }    from './common.js';

const tgId = Telegram.WebApp.initDataUnsafe.user.id;

(async () => {
  const { data: p } = await supabase
      .from('players')
      .select('miner_lvl')
      .eq('tg_id', tgId)
      .single();

  const r   = document.getElementById('btn-rare');
  const n   = document.getElementById('btn-normal');

  if (p.miner_lvl >= 4) r.classList.remove('locked');

  n.onclick = () => location.href = 'mine.html?type=normal';
  r.onclick = () => {
      if (p.miner_lvl < 4)
        toast('Редкая шахта открывается на 4-м уровне');
      else
        location.href = 'mine.html?type=rare';
  };
})();
