const SUPABASE_URL = "https://nvwpdslwltayriyibwis.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ea3dZcU5jl6wK2-qiB3NaQ_m4td004I";

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.loadCitiesFromDB = async function () {
  const { data, error } = await window.sb
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Ошибка загрузки городов:", error);
    return [];
  }

  window.MN_CITIES_DB = data || [];
  return window.MN_CITIES_DB;
};

window.getCityFromDB = async function (cityId) {
  const { data, error } = await window.sb
    .from("cities")
    .select("*")
    .eq("id", cityId)
    .single();

  if (error) {
    console.error("Ошибка получения города:", error);
    return null;
  }

  return data;
};

window.getPlayerByUuid = async function (playerUuid) {
  if (!playerUuid) return null;

  const { data, error } = await window.sb
    .from("players")
    .select("*")
    .eq("id", playerUuid)
    .single();

  if (error) {
    console.log("Игрок по UUID не найден:", error.message);
    return null;
  }

  return data;
};

window.createPlayerInDB = async function ({ nickname, gender, cityId }) {
  const city = await getCityFromDB(cityId);

  if (!city) {
    throw new Error("Город не найден");
  }

  const { data, error } = await window.sb
    .from("players")
    .insert({
      nickname,
      gender,
      city_id: cityId,
      balance: city.start_balance,
      level: 1,
      xp: 0,
      energy: 100,
      reputation: 0,
      diamonds: 0
    })
    .select()
    .single();

  if (error) {
    console.error("Ошибка создания игрока:", error);
    throw error;
  }

  return { player: data, city };
};

window.testSupabaseConnection = async function () {
  const { data, error } = await window.sb
    .from("cities")
    .select("*")
    .limit(3);

  if (error) {
    console.error("Supabase test error:", error);
    alert("Ошибка подключения к БД");
    return false;
  }

  console.log("Supabase OK:", data);
  return true;
};
