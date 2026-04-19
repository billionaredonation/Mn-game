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

window.checkNicknameExists = async function (nickname) {
  const { data, error } = await window.sb
    .from("players")
    .select("id,nickname")
    .ilike("nickname", nickname.trim())
    .limit(1);

  if (error) {
    console.error("Ошибка проверки ника:", error);
    return false;
  }

  return Array.isArray(data) && data.length > 0;
};

window.createPlayerInDB = async function ({ nickname, gender, cityId }) {
  const cleanNickname = (nickname || "").trim();

  if (cleanNickname.length < 3) {
    throw new Error("Ник слишком короткий");
  }

  if (!cityId) {
    throw new Error("Город не выбран");
  }

  if (gender !== "male" && gender !== "female") {
    throw new Error("Пол выбран некорректно");
  }

  const city = await getCityFromDB(cityId);

  if (!city) {
    throw new Error("Город не найден");
  }

  const nicknameExists = await checkNicknameExists(cleanNickname);

  if (nicknameExists) {
    throw new Error("Этот ник уже занят");
  }

  const { data, error } = await window.sb
    .from("players")
    .insert({
      nickname: cleanNickname,
      gender,
      city_id: cityId,
      balance: city.start_balance,
      level: 1,
      xp: 0,
      energy: 100,
      reputation: 0
    })
    .select()
    .single();

  if (error) {
    console.error("Ошибка создания игрока:", error);
    throw new Error(error.message || "Не удалось создать игрока");
  }

  const { error: skillError } = await window.sb
    .from("player_skills")
    .insert({
      player_uuid: data.id,
      skill_code: "farmer",
      xp: 0,
      level: 1
    });

  if (skillError) {
    console.error("Ошибка создания стартового навыка:", skillError);
    throw new Error(skillError.message || "Не удалось создать стартовый навык");
  }

  return { player: data, city };
};

window.loadPlayerSkills = async function (playerUuid) {
  if (!playerUuid) return [];

  const { data, error } = await window.sb
    .from("player_skills")
    .select("*")
    .eq("player_uuid", playerUuid)
    .order("id", { ascending: true });

  if (error) {
    console.error("Ошибка загрузки навыков:", error);
    return [];
  }

  return data || [];
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
