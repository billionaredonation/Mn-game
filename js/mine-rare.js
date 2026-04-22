/*  js/mine-rare.js  – логика редкой шахты  */
import { supabase } from './supabase.js';
import { toast }    from './common.js';

const TG_ID = Telegram.WebApp.initDataUnsafe.user.id;

/* ← шансы и награды редкой шахты */
const TABLE = [
  {kind:'coal',    chance:43, reward:4,  xp:0.6},
  {kind:'iron',    chance:22, reward:6,  xp:1.0},
  {kind:'gold',    chance:25, reward:10, xp:2.0},
  {kind:'diamond', chance:10, reward:20, xp:3.4}
];
const PENALTY_BY_LEVEL = {1:10, 2:15, 3:20, 4:30}; // ≥5 → 40

function penalty(lvl){ return PENALTY_BY_LEVEL[lvl] ?? 40; }

function roll(){
  const r=Math.random()*100; let s=0;
  for(const row of TABLE){ s+=row.chance; if(r<=s) return row; }
}

async function addReward(id,money,xp){
  await supabase.rpc('add_reward',{player_id:id,money,xp});
}

async function setCd(field,until,id){
  await supabase.from('players')
    .update({ [field]: new Date(until).toISOString() })
    .eq('id',id);
}

export async function initMineRare(){
  /* элементы UI */
  const btn   = document.getElementById('mine-btn');
  const grossEl   = document.getElementById('mineGrossMoneyValue');
  const penaltyEl = document.getElementById('minePenaltyValue');
  const netEl     = document.getElementById('mineNetMoneyValue');
  const xpEl      = document.getElementById('mineXpValue');
  const lvlChip   = document.getElementById('mineLevelChip');
  const hitsEl    = document.getElementById('mineHitsValue');
  const misEl     = document.getElementById('mineMistakesValue');

  /* загружаем игрока */
  let { data:p } = await supabase.from('players')
      .select('*').eq('tg_id',TG_ID).single();

  let { id,balance,miner_lvl,lung_cd_until,mine_cd_until,xp } = p;

  /* счётчик сессии */
  let hits=0, mistakes=0, gross=0, fines=0;

  function ui(){
    hitsEl.textContent = hits;
    misEl .textContent = mistakes;
    grossEl.textContent   = `${gross} ₴`;
    penaltyEl.textContent = `${fines} ₴`;
    netEl.textContent     = `${balance + gross - fines} ₴`;
    xpEl .textContent     = `${xp.toFixed(1)} XP`;
    lvlChip.textContent   = `Ур. ${miner_lvl}`;
  }

  btn.onclick = async ()=>{
    const now = Date.now();

    if(lung_cd_until && now < Date.parse(lung_cd_until))
      return toast('💨 Лёгкие ещё не очистились');
    if(mine_cd_until && now < Date.parse(mine_cd_until))
      return toast('🪨 Шахта завалена, подожди');

    const ore = roll();
    hits++; gross += ore.reward; xp += ore.xp;

    /* дебафы */
    if(ore.kind==='coal' && Math.random()<0.5){
      const cd = now + 60_000*(1+Math.random()*2);
      await setCd('lung_cd_until',cd,id);
      lung_cd_until = cd;
      mistakes++; toast('💨 Пыль угля блокирует золото на 1–3 мин');
    }
    if(ore.kind==='iron' && Math.random()<0.6){
      const cd = now + 60_000;
      await setCd('mine_cd_until',cd,id);
      mine_cd_until = cd;
      mistakes++; toast('🪨 Обвал! Шахта минуту недоступна');
    }
    if(ore.kind==='diamond' && Math.random()<0.30){
      const fine = penalty(miner_lvl);
      fines += fine;
      await addReward(id,-fine,0);
      toast(`🔧 Кирка повреждена: –${fine} ₴`);
    }

    /* каждые 3 удачных замолняем баланс и опыт */
    if(hits % 3 === 0){
      await addReward(id,gross-fines,xp);
      balance += gross - fines;
      gross = fines = 0;
      toast('💾 Автосейв!');
    }

    ui();
  };

  ui();
}

/* авто-инициализация при загрузке страницы */
initMineRare().catch(e=>alert('Mine rare err: '+e.message));
