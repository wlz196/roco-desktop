const API_BASE = 'http://159.65.135.84:8081/api/v1/data';
const IMAGE_BASE = 'http://159.65.135.84:8081';
const PVP_STAR_LEVEL = 5;
const PRESET_STORAGE_KEY = 'myAtkPetPresetsV1';
const { ipcRenderer } = require('electron');

let simPet = null;
let battleAtkPet = null;
let battleDefPet = null;
let duelMyPet = null;
let duelEnemyPet = null;

const D = {
    tabSimBtn: document.getElementById('tabSimBtn'),
    tabBattleBtn: document.getElementById('tabBattleBtn'),
    tabDuelBtn: document.getElementById('tabDuelBtn'),

    simSearch: document.getElementById('simSearch'),
    simSearchResults: document.getElementById('simSearchResults'),
    simPetInfo: document.getElementById('simPetInfo'),
    simPetImg: document.getElementById('simPetImg'),
    simPetName: document.getElementById('simPetName'),
    simBaseHp: document.getElementById('simBaseHp'),
    simBaseAtk: document.getElementById('simBaseAtk'),
    simBaseDef: document.getElementById('simBaseDef'),
    simBaseMatk: document.getElementById('simBaseMatk'),
    simBaseMdef: document.getElementById('simBaseMdef'),
    simBaseSpd: document.getElementById('simBaseSpd'),
    simNaturePlus: document.getElementById('simNaturePlus'),
    simNatureMinus: document.getElementById('simNatureMinus'),
    simPresetSelect: document.getElementById('simPresetSelect'),
    simPresetLoadBtn: document.getElementById('simPresetLoadBtn'),
    simPresetSaveBtn: document.getElementById('simPresetSaveBtn'),
    simPresetDeleteBtn: document.getElementById('simPresetDeleteBtn'),
    simIvs: {
        hp: document.getElementById('simIvHp'),
        atk: document.getElementById('simIvAtk'),
        def: document.getElementById('simIvDef'),
        matk: document.getElementById('simIvMatk'),
        mdef: document.getElementById('simIvMdef'),
        spd: document.getElementById('simIvSpd')
    },
    simFinalHp: document.getElementById('simFinalHp'),
    simFinalAtk: document.getElementById('simFinalAtk'),
    simFinalDef: document.getElementById('simFinalDef'),
    simFinalMatk: document.getElementById('simFinalMatk'),
    simFinalMdef: document.getElementById('simFinalMdef'),
    simFinalSpd: document.getElementById('simFinalSpd'),
    simRangeHp: document.getElementById('simRangeHp'),
    simRangeAtk: document.getElementById('simRangeAtk'),
    simRangeDef: document.getElementById('simRangeDef'),
    simRangeMatk: document.getElementById('simRangeMatk'),
    simRangeMdef: document.getElementById('simRangeMdef'),
    simRangeSpd: document.getElementById('simRangeSpd'),
    simGapHp: document.getElementById('simGapHp'),
    simGapAtk: document.getElementById('simGapAtk'),
    simGapDef: document.getElementById('simGapDef'),
    simGapMatk: document.getElementById('simGapMatk'),
    simGapMdef: document.getElementById('simGapMdef'),
    simGapSpd: document.getElementById('simGapSpd'),

    battleAtkSearch: document.getElementById('battleAtkSearch'),
    battleAtkSearchResults: document.getElementById('battleAtkSearchResults'),
    battleNaturePlus: document.getElementById('battleNaturePlus'),
    battleNatureMinus: document.getElementById('battleNatureMinus'),
    battlePresetSelect: document.getElementById('battlePresetSelect'),
    battlePresetLoadBtn: document.getElementById('battlePresetLoadBtn'),
    battleIvs: {
        hp: document.getElementById('battleIvHp'),
        atk: document.getElementById('battleIvAtk'),
        def: document.getElementById('battleIvDef'),
        matk: document.getElementById('battleIvMatk'),
        mdef: document.getElementById('battleIvMdef'),
        spd: document.getElementById('battleIvSpd')
    },

    battleDefSearch: document.getElementById('battleDefSearch'),
    battleDefSearchResults: document.getElementById('battleDefSearchResults'),
    battleDefHpRange: document.getElementById('battleDefHpRange'),
    battleDefHpNeutral0: document.getElementById('battleDefHpNeutral0'),
    battleDefHpPlus0: document.getElementById('battleDefHpPlus0'),
    battleDefHpNeutral10: document.getElementById('battleDefHpNeutral10'),
    battleDefHpPlus10: document.getElementById('battleDefHpPlus10'),
    battleDefHpMinus0: document.getElementById('battleDefHpMinus0'),
    battleDefHpMinus10: document.getElementById('battleDefHpMinus10'),

    simplePowerGroup: document.getElementById('simplePowerGroup'),
    complexInputs: document.getElementById('complexInputs'),
    dmgPower: document.getElementById('dmgPower'),
    dmgHits: document.getElementById('dmgHits'),

    cplFinalPower: document.getElementById('cplFinalPower'),
    cplSkillPower: document.getElementById('cplSkillPower'),
    cplResponseMult: document.getElementById('cplResponseMult'),
    cplPowerBonus: document.getElementById('cplPowerBonus'),
    cplAtkUp: document.getElementById('cplAtkUp'),
    cplDefDown: document.getElementById('cplDefDown'),
    cplAtkDown: document.getElementById('cplAtkDown'),
    cplDefUp: document.getElementById('cplDefUp'),
    cplStab: document.getElementById('cplStab'),
    cplTypeEff: document.getElementById('cplTypeEff'),
    cplWeather: document.getElementById('cplWeather'),
    cplMitigation: document.getElementById('cplMitigation'),

    resDmgAll: document.getElementById('resDmgAll'),
    resDmgMinus0: document.getElementById('resDmgMinus0'),
    resDmgMinus10: document.getElementById('resDmgMinus10'),
    resDmgNeutral0: document.getElementById('resDmgNeutral0'),
    resDmgNeutral10: document.getElementById('resDmgNeutral10'),
    resDmgPlus0: document.getElementById('resDmgPlus0'),
    resDmgPlus10: document.getElementById('resDmgPlus10'),

    duelMySearch: document.getElementById('duelMySearch'),
    duelMySearchResults: document.getElementById('duelMySearchResults'),
    duelMyPetInfo: document.getElementById('duelMyPetInfo'),
    duelMyImg: document.getElementById('duelMyImg'),
    duelMyName: document.getElementById('duelMyName'),
    duelMyBaseHp: document.getElementById('duelMyBaseHp'),
    duelMyBaseAtk: document.getElementById('duelMyBaseAtk'),
    duelMyBaseDef: document.getElementById('duelMyBaseDef'),
    duelMyBaseMatk: document.getElementById('duelMyBaseMatk'),
    duelMyBaseMdef: document.getElementById('duelMyBaseMdef'),
    duelMyBaseSpd: document.getElementById('duelMyBaseSpd'),
    duelMyNaturePlus: document.getElementById('duelMyNaturePlus'),
    duelMyNatureMinus: document.getElementById('duelMyNatureMinus'),
    duelMyPresetSelect: document.getElementById('duelMyPresetSelect'),
    duelMyPresetLoadBtn: document.getElementById('duelMyPresetLoadBtn'),
    duelMyIvs: {
        hp: document.getElementById('duelMyIvHp'),
        atk: document.getElementById('duelMyIvAtk'),
        def: document.getElementById('duelMyIvDef'),
        matk: document.getElementById('duelMyIvMatk'),
        mdef: document.getElementById('duelMyIvMdef'),
        spd: document.getElementById('duelMyIvSpd')
    },
    duelMyFinalHp: document.getElementById('duelMyFinalHp'),
    duelMyFinalAtk: document.getElementById('duelMyFinalAtk'),
    duelMyFinalDef: document.getElementById('duelMyFinalDef'),
    duelMyFinalMatk: document.getElementById('duelMyFinalMatk'),
    duelMyFinalMdef: document.getElementById('duelMyFinalMdef'),
    duelMyFinalSpd: document.getElementById('duelMyFinalSpd'),

    duelEnemySearch: document.getElementById('duelEnemySearch'),
    duelEnemySearchResults: document.getElementById('duelEnemySearchResults'),
    duelEnemyPetInfo: document.getElementById('duelEnemyPetInfo'),
    duelEnemyImg: document.getElementById('duelEnemyImg'),
    duelEnemyName: document.getElementById('duelEnemyName'),
    duelEnemyBaseHp: document.getElementById('duelEnemyBaseHp'),
    duelEnemyBaseAtk: document.getElementById('duelEnemyBaseAtk'),
    duelEnemyBaseDef: document.getElementById('duelEnemyBaseDef'),
    duelEnemyBaseMatk: document.getElementById('duelEnemyBaseMatk'),
    duelEnemyBaseMdef: document.getElementById('duelEnemyBaseMdef'),
    duelEnemyBaseSpd: document.getElementById('duelEnemyBaseSpd'),
    duelEnemyNaturePlus: document.getElementById('duelEnemyNaturePlus'),
    duelEnemyNatureMinus: document.getElementById('duelEnemyNatureMinus'),
    duelEnemyPresetSelect: document.getElementById('duelEnemyPresetSelect'),
    duelEnemyPresetLoadBtn: document.getElementById('duelEnemyPresetLoadBtn'),
    duelEnemyIvs: {
        hp: document.getElementById('duelEnemyIvHp'),
        atk: document.getElementById('duelEnemyIvAtk'),
        def: document.getElementById('duelEnemyIvDef'),
        matk: document.getElementById('duelEnemyIvMatk'),
        mdef: document.getElementById('duelEnemyIvMdef'),
        spd: document.getElementById('duelEnemyIvSpd')
    },
    duelEnemyFinalHp: document.getElementById('duelEnemyFinalHp'),
    duelEnemyFinalAtk: document.getElementById('duelEnemyFinalAtk'),
    duelEnemyFinalDef: document.getElementById('duelEnemyFinalDef'),
    duelEnemyFinalMatk: document.getElementById('duelEnemyFinalMatk'),
    duelEnemyFinalMdef: document.getElementById('duelEnemyFinalMdef'),
    duelEnemyFinalSpd: document.getElementById('duelEnemyFinalSpd'),

    duelMyToEnemyPower: document.getElementById('duelMyToEnemyPower'),
    duelMyToEnemyHits: document.getElementById('duelMyToEnemyHits'),
    duelMySimplePowerGroup: document.getElementById('duelMySimplePowerGroup'),
    duelMyComplexInputs: document.getElementById('duelMyComplexInputs'),
    duelMyCplFinalPower: document.getElementById('duelMyCplFinalPower'),
    duelMyCplSkillPower: document.getElementById('duelMyCplSkillPower'),
    duelMyCplResponseMult: document.getElementById('duelMyCplResponseMult'),
    duelMyCplPowerBonus: document.getElementById('duelMyCplPowerBonus'),
    duelMyCplAtkUp: document.getElementById('duelMyCplAtkUp'),
    duelMyCplDefDown: document.getElementById('duelMyCplDefDown'),
    duelMyCplAtkDown: document.getElementById('duelMyCplAtkDown'),
    duelMyCplDefUp: document.getElementById('duelMyCplDefUp'),
    duelMyCplStab: document.getElementById('duelMyCplStab'),
    duelMyCplTypeEff: document.getElementById('duelMyCplTypeEff'),
    duelMyCplWeather: document.getElementById('duelMyCplWeather'),
    duelMyCplMitigation: document.getElementById('duelMyCplMitigation'),
    duelEnemyToMyPower: document.getElementById('duelEnemyToMyPower'),
    duelEnemyToMyHits: document.getElementById('duelEnemyToMyHits'),
    duelEnemySimplePowerGroup: document.getElementById('duelEnemySimplePowerGroup'),
    duelEnemyComplexInputs: document.getElementById('duelEnemyComplexInputs'),
    duelEnemyCplFinalPower: document.getElementById('duelEnemyCplFinalPower'),
    duelEnemyCplSkillPower: document.getElementById('duelEnemyCplSkillPower'),
    duelEnemyCplResponseMult: document.getElementById('duelEnemyCplResponseMult'),
    duelEnemyCplPowerBonus: document.getElementById('duelEnemyCplPowerBonus'),
    duelEnemyCplAtkUp: document.getElementById('duelEnemyCplAtkUp'),
    duelEnemyCplDefDown: document.getElementById('duelEnemyCplDefDown'),
    duelEnemyCplAtkDown: document.getElementById('duelEnemyCplAtkDown'),
    duelEnemyCplDefUp: document.getElementById('duelEnemyCplDefUp'),
    duelEnemyCplStab: document.getElementById('duelEnemyCplStab'),
    duelEnemyCplTypeEff: document.getElementById('duelEnemyCplTypeEff'),
    duelEnemyCplWeather: document.getElementById('duelEnemyCplWeather'),
    duelEnemyCplMitigation: document.getElementById('duelEnemyCplMitigation'),
    duelMyToEnemySingle: document.getElementById('duelMyToEnemySingle'),
    duelMyToEnemyTotal: document.getElementById('duelMyToEnemyTotal'),
    duelMyToEnemyPct: document.getElementById('duelMyToEnemyPct'),
    duelMyToEnemyTurns: document.getElementById('duelMyToEnemyTurns'),
    duelEnemyToMySingle: document.getElementById('duelEnemyToMySingle'),
    duelEnemyToMyTotal: document.getElementById('duelEnemyToMyTotal'),
    duelEnemyToMyPct: document.getElementById('duelEnemyToMyPct'),
    duelEnemyToMyTurns: document.getElementById('duelEnemyToMyTurns')
};

const ATTR_MAP = { hp: 79, atk: 80, matk: 81, def: 82, mdef: 83, spd: 84 };
const ATTR_LABELS = {
    '': '无', hp: '精力', atk: '物攻', def: '物防', matk: '魔攻', mdef: '魔抗', spd: '速度'
};

function pickNumber(obj, keys, fallback = 0) {
    for (const key of keys) {
        const v = obj?.[key];
        if (v !== undefined && v !== null && v !== '') {
            const n = Number(v);
            if (!Number.isNaN(n)) return n;
        }
    }
    return fallback;
}

function normalizePetStats(pet) {
    return {
        ...pet,
        hp: pickNumber(pet, ['hp']),
        attack: pickNumber(pet, ['attack', 'atk']),
        defense: pickNumber(pet, ['defense', 'def']),
        magic_attack: pickNumber(pet, ['magic_attack', 'magicAttack', 'sp_atk', 'spAttack']),
        magic_defense: pickNumber(pet, ['magic_defense', 'magicDefense', 'sp_def', 'spDefense']),
        speed: pickNumber(pet, ['speed', 'spd'])
    };
}

function fmt1(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(1) : '0.0';
}

function resolvePetImageUrl(imageUrl) {
    if (!imageUrl) return '';
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const clean = String(imageUrl).replace(/^\/+/, '');
    if (clean.startsWith('media/')) return `${IMAGE_BASE}/${clean}`;
    return `${IMAGE_BASE}/media/${clean}`;
}

function debounce(func, wait) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => func.apply(this, args), wait);
    };
}

function getSelectedDamageMode() {
    return document.querySelector('input[name="dmgMode"]:checked')?.value || 'simple';
}

function getSelectedDamageType() {
    return document.querySelector('input[name="dmgType"]:checked')?.value || 'physical';
}

function getSelectedDuelDamageMode(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || 'simple';
}

function setupNatureSelectors(elPlus, elMinus) {
    const options = [
        { value: '', label: '无' },
        { value: 'hp', label: '精力' },
        { value: 'atk', label: '物攻' },
        { value: 'def', label: '物防' },
        { value: 'matk', label: '魔攻' },
        { value: 'mdef', label: '魔抗' },
        { value: 'spd', label: '速度' }
    ];
    const html = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    elPlus.innerHTML = html;
    elMinus.innerHTML = html;
    elPlus.value = '';
    elMinus.value = '';
}

function normalizeNaturePair(elPlus, elMinus, changed) {
    if (elPlus.value && elPlus.value === elMinus.value) {
        if (changed === 'plus') elMinus.value = '';
        else elPlus.value = '';
    }
}

function getIvs(ivsEls) {
    return {
        hp: Number(ivsEls.hp.value) || 0,
        atk: Number(ivsEls.atk.value) || 0,
        def: Number(ivsEls.def.value) || 0,
        matk: Number(ivsEls.matk.value) || 0,
        mdef: Number(ivsEls.mdef.value) || 0,
        spd: Number(ivsEls.spd.value) || 0
    };
}

function setIvs(ivsEls, ivs) {
    for (const key of Object.keys(ivsEls)) {
        const n = Number(ivs?.[key]);
        ivsEls[key].value = Number.isFinite(n) ? String(Math.max(0, Math.min(10, Math.trunc(n)))) : '0';
    }
}

function calcFinalStats(pet, ivs, plusAttr, minusAttr) {
    const star = PVP_STAR_LEVEL;
    const plusId = plusAttr ? ATTR_MAP[plusAttr] : undefined;
    const minusId = minusAttr ? ATTR_MAP[minusAttr] : undefined;

    const getMod = (attrId) => {
        if (plusId === attrId) return 1.1 + star * 0.02;
        if (minusId === attrId) return 0.9;
        return 1.0;
    };

    const talentHP = (1 + star) * 0.85;
    const talentOther = (1 + star) * 0.55;

    const calc = (base, iv, mod, isHp = false) => {
        if (isHp) return (base * 1.7 + iv * talentHP + 70) * mod + 100;
        return (base * 1.1 + iv * talentOther + 10) * mod + 50;
    };

    return {
        hp: calc(pet.hp, ivs.hp, getMod(ATTR_MAP.hp), true),
        atk: calc(pet.attack, ivs.atk, getMod(ATTR_MAP.atk)),
        def: calc(pet.defense, ivs.def, getMod(ATTR_MAP.def)),
        matk: calc(pet.magic_attack, ivs.matk, getMod(ATTR_MAP.matk)),
        mdef: calc(pet.magic_defense, ivs.mdef, getMod(ATTR_MAP.mdef)),
        spd: calc(pet.speed, ivs.spd, getMod(ATTR_MAP.spd))
    };
}

function buildDefRanges(pet) {
    const star = PVP_STAR_LEVEL;
    const talentHP = (1 + star) * 0.85;
    const talentOther = (1 + star) * 0.55;
    const plusMod = 1.1 + star * 0.02;
    const minusMod = 0.9;

    const calcHp = (base, iv, mod) => (base * 1.7 + iv * talentHP + 70) * mod + 100;
    const calcDef = (base, iv, mod) => (base * 1.1 + iv * talentOther + 10) * mod + 50;

    const buildRange = (base, mod, isHp = false) => ({
        min: isHp ? calcHp(base, 0, mod) : calcDef(base, 0, mod),
        max: isHp ? calcHp(base, 10, mod) : calcDef(base, 10, mod)
    });

    return {
        hp: {
            minus: buildRange(pet.hp, minusMod, true),
            neutral: buildRange(pet.hp, 1.0, true),
            plus: buildRange(pet.hp, plusMod, true)
        },
        def: {
            minus: buildRange(pet.defense, minusMod),
            neutral: buildRange(pet.defense, 1.0),
            plus: buildRange(pet.defense, plusMod)
        },
        mdef: {
            minus: buildRange(pet.magic_defense, minusMod),
            neutral: buildRange(pet.magic_defense, 1.0),
            plus: buildRange(pet.magic_defense, plusMod)
        }
    };
}

function calcTurnsRange(hpRange, dmgRange) {
    if (!hpRange || !dmgRange || dmgRange.min <= 0 || dmgRange.max <= 0) return '-';
    const fast = Math.max(1, Math.ceil(hpRange.min / dmgRange.max));
    const slow = Math.max(1, Math.ceil(hpRange.max / dmgRange.min));
    return fast === slow ? `${fast}击` : `${fast}~${slow}击`;
}

function getPresets() {
    try {
        const raw = localStorage.getItem(PRESET_STORAGE_KEY);
        const data = raw ? JSON.parse(raw) : [];
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('读取模板失败:', e);
        return [];
    }
}

function savePresets(list) {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(list));
}

function presetLabel(p) {
    return `${p.petName} [加:${ATTR_LABELS[p.naturePlus || '']} 减:${ATTR_LABELS[p.natureMinus || '']}]`;
}

function renderPresetSelects(selectedId = '') {
    const list = getPresets().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const html = list.length
        ? list.map(p => `<option value="${p.id}">${presetLabel(p)}</option>`).join('')
        : '<option value="">未保存任何配置</option>';
    D.simPresetSelect.innerHTML = html;
    D.battlePresetSelect.innerHTML = html;
    D.duelMyPresetSelect.innerHTML = html;
    D.duelEnemyPresetSelect.innerHTML = html;
    if (selectedId) {
        D.simPresetSelect.value = selectedId;
        D.battlePresetSelect.value = selectedId;
        D.duelMyPresetSelect.value = selectedId;
        D.duelEnemyPresetSelect.value = selectedId;
    }
}

function collectSimConfig() {
    return {
        naturePlus: D.simNaturePlus.value || '',
        natureMinus: D.simNatureMinus.value || '',
        ivs: getIvs(D.simIvs)
    };
}

function applyConfigToSim(cfg) {
    D.simNaturePlus.value = cfg?.naturePlus || '';
    D.simNatureMinus.value = cfg?.natureMinus || '';
    normalizeNaturePair(D.simNaturePlus, D.simNatureMinus, 'minus');
    setIvs(D.simIvs, cfg?.ivs || {});
}

function applyConfigToBattle(cfg) {
    D.battleNaturePlus.value = cfg?.naturePlus || '';
    D.battleNatureMinus.value = cfg?.natureMinus || '';
    normalizeNaturePair(D.battleNaturePlus, D.battleNatureMinus, 'minus');
    setIvs(D.battleIvs, cfg?.ivs || {});
}

function applyConfigToDuelMy(cfg) {
    D.duelMyNaturePlus.value = cfg?.naturePlus || '';
    D.duelMyNatureMinus.value = cfg?.natureMinus || '';
    normalizeNaturePair(D.duelMyNaturePlus, D.duelMyNatureMinus, 'minus');
    setIvs(D.duelMyIvs, cfg?.ivs || {});
}

function applyConfigToDuelEnemy(cfg) {
    D.duelEnemyNaturePlus.value = cfg?.naturePlus || '';
    D.duelEnemyNatureMinus.value = cfg?.natureMinus || '';
    normalizeNaturePair(D.duelEnemyNaturePlus, D.duelEnemyNatureMinus, 'minus');
    setIvs(D.duelEnemyIvs, cfg?.ivs || {});
}

function fillPetCard(pet, refs) {
    if (!pet) return;
    refs.box.classList.remove('hidden');
    refs.img.src = resolvePetImageUrl(pet.imageUrl);
    refs.name.innerText = pet.name;
    refs.baseHp.innerText = pet.hp;
    refs.baseAtk.innerText = pet.attack;
    refs.baseDef.innerText = pet.defense;
    refs.baseMatk.innerText = pet.magic_attack;
    refs.baseMdef.innerText = pet.magic_defense;
    refs.baseSpd.innerText = pet.speed;
}

function setTopTab(mode) {
    document.body.classList.toggle('mode-sim', mode === 'sim');
    document.body.classList.toggle('mode-battle', mode === 'battle');
    document.body.classList.toggle('mode-duel', mode === 'duel');
    D.tabSimBtn.classList.toggle('active', mode === 'sim');
    D.tabBattleBtn.classList.toggle('active', mode === 'battle');
    D.tabDuelBtn.classList.toggle('active', mode === 'duel');
    requestWindowFit();
}

let fitTimer = null;

function requestWindowFit() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => {
        const isBattle = document.body.classList.contains('mode-battle');
        const isDuel = document.body.classList.contains('mode-duel');
        const isComplex = getSelectedDamageMode() === 'complex';
        const isDuelComplex =
            getSelectedDuelDamageMode('duelMyToEnemyMode') === 'complex' ||
            getSelectedDuelDamageMode('duelEnemyToMyMode') === 'complex';

        let desiredWidth = 1180;
        let desiredHeight = 860;
        if (isDuel) {
            desiredWidth = 1560;
            desiredHeight = isDuelComplex ? 980 : 900;
        } else if (isBattle) {
            desiredWidth = isComplex ? 1360 : 1240;
            desiredHeight = isComplex ? 920 : 820;
        }

        ipcRenderer.send('fit-window-to-content', {
            width: desiredWidth,
            height: desiredHeight
        });
    }, 80);
}

function updateDamageModeUI() {
    const mode = getSelectedDamageMode();
    D.simplePowerGroup.classList.toggle('hidden', mode === 'complex');
    D.complexInputs.classList.toggle('hidden', mode !== 'complex');
    requestWindowFit();
}

function updateDuelDamageModeUI() {
    const myMode = getSelectedDuelDamageMode('duelMyToEnemyMode');
    D.duelMySimplePowerGroup.classList.toggle('hidden', myMode === 'complex');
    D.duelMyComplexInputs.classList.toggle('hidden', myMode !== 'complex');

    const enemyMode = getSelectedDuelDamageMode('duelEnemyToMyMode');
    D.duelEnemySimplePowerGroup.classList.toggle('hidden', enemyMode === 'complex');
    D.duelEnemyComplexInputs.classList.toggle('hidden', enemyMode !== 'complex');

    requestWindowFit();
}

function calcComplexPower(raw) {
    const skillPower = Math.max(0, Number(raw.skillPower) || 0);
    const responseMult = Math.max(0, Number(raw.responseMult) || 0);
    const powerBonus = Number(raw.powerBonus) || 0;
    const atkUp = (Number(raw.atkUp) || 0) / 100;
    const defDown = (Number(raw.defDown) || 0) / 100;
    const atkDown = (Number(raw.atkDown) || 0) / 100;
    const defUp = (Number(raw.defUp) || 0) / 100;
    const stab = Math.max(0, Number(raw.stab) || 0);
    const typeEff = Math.max(0, Number(raw.typeEff) || 0);
    const weather = Math.max(0, Number(raw.weather) || 0);
    const mitigation = Math.min(100, Math.max(0, Number(raw.mitigation) || 0)) / 100;

    const effectivePower = skillPower * responseMult + powerBonus;
    const ratio = (1 + atkUp + defDown) / Math.max(0.01, (1 + atkDown + defUp));
    const power = Math.max(0, effectivePower * ratio * stab * typeEff * weather);
    return {
        power,
        mitigationFactor: 1 - mitigation
    };
}

async function searchPets(keyword) {
    const res = await fetch(`${API_BASE}/pets?keyword=${encodeURIComponent(keyword)}&size=10`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.content || []);
}

async function fetchPetDetails(id) {
    const res = await fetch(`${API_BASE}/pets/${id}/details`);
    return normalizePetStats(await res.json());
}

function bindSearch(inputEl, resultEl, onSelect) {
    inputEl.addEventListener('input', debounce(async (e) => {
        const keyword = e.target.value.trim();
        if (!keyword) {
            resultEl.style.display = 'none';
            return;
        }
        try {
            const pets = await searchPets(keyword);
            if (!pets.length) {
                resultEl.innerHTML = '<div style="padding:8px;color:#888;">未找到精灵</div>';
                resultEl.style.display = 'block';
                return;
            }
            resultEl.innerHTML = pets.map(p => `
                <div class="search-item" data-id="${p.id}">
                    <img src="${resolvePetImageUrl(p.imageUrl)}" style="width:20px;height:20px;vertical-align:middle;margin-right:5px;">
                    ${p.name}
                </div>
            `).join('');
            resultEl.style.display = 'block';
            resultEl.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', () => {
                    resultEl.style.display = 'none';
                    inputEl.value = item.innerText.trim();
                    onSelect(item.dataset.id);
                });
            });
        } catch (err) {
            console.error('搜索失败:', err);
        }
    }, 300));
}

function updateSimUI() {
    if (!simPet) return;
    const ivs = getIvs(D.simIvs);
    const stats = calcFinalStats(simPet, ivs, D.simNaturePlus.value, D.simNatureMinus.value);
    D.simFinalHp.innerText = fmt1(stats.hp);
    D.simFinalAtk.innerText = fmt1(stats.atk);
    D.simFinalDef.innerText = fmt1(stats.def);
    D.simFinalMatk.innerText = fmt1(stats.matk);
    D.simFinalMdef.innerText = fmt1(stats.mdef);
    D.simFinalSpd.innerText = fmt1(stats.spd);

    const setRange = (key, rangeEl, gapEl) => {
        const ivMin = { ...ivs, [key]: 0 };
        const ivMax = { ...ivs, [key]: 10 };
        const minStats = calcFinalStats(simPet, ivMin, D.simNaturePlus.value, D.simNatureMinus.value);
        const maxStats = calcFinalStats(simPet, ivMax, D.simNaturePlus.value, D.simNatureMinus.value);

        const map = {
            hp: 'hp',
            atk: 'atk',
            def: 'def',
            matk: 'matk',
            mdef: 'mdef',
            spd: 'spd'
        };
        const attr = map[key];
        rangeEl.innerText = `${fmt1(minStats[attr])}~${fmt1(maxStats[attr])}`;
        gapEl.innerText = `+${fmt1(maxStats[attr] - minStats[attr])}`;
    };

    setRange('hp', D.simRangeHp, D.simGapHp);
    setRange('atk', D.simRangeAtk, D.simGapAtk);
    setRange('def', D.simRangeDef, D.simGapDef);
    setRange('matk', D.simRangeMatk, D.simGapMatk);
    setRange('mdef', D.simRangeMdef, D.simGapMdef);
    setRange('spd', D.simRangeSpd, D.simGapSpd);
}

function updateBattleUI() {
    const resetDamageRows = () => {
        D.resDmgAll.innerText = '0~0';
        D.resDmgMinus0.innerText = '0 (0%)';
        D.resDmgMinus10.innerText = '0 (0%)';
        D.resDmgNeutral0.innerText = '0 (0%)';
        D.resDmgNeutral10.innerText = '0 (0%)';
        D.resDmgPlus0.innerText = '0 (0%)';
        D.resDmgPlus10.innerText = '0 (0%)';
    };

    if (!battleDefPet) {
        D.battleDefHpRange.innerText = '0~0';
        D.battleDefHpNeutral0.innerText = '0';
        D.battleDefHpPlus0.innerText = '0';
        D.battleDefHpNeutral10.innerText = '0';
        D.battleDefHpPlus10.innerText = '0';
        D.battleDefHpMinus0.innerText = '0';
        D.battleDefHpMinus10.innerText = '0';
        resetDamageRows();
        return;
    }

    const ranges = buildDefRanges(battleDefPet);
    D.battleDefHpRange.innerText = `${fmt1(ranges.hp.minus.min)}~${fmt1(ranges.hp.plus.max)}`;
    D.battleDefHpNeutral0.innerText = fmt1(ranges.hp.neutral.min);
    D.battleDefHpPlus0.innerText = fmt1(ranges.hp.plus.min);
    D.battleDefHpNeutral10.innerText = fmt1(ranges.hp.neutral.max);
    D.battleDefHpPlus10.innerText = fmt1(ranges.hp.plus.max);
    D.battleDefHpMinus0.innerText = fmt1(ranges.hp.minus.min);
    D.battleDefHpMinus10.innerText = fmt1(ranges.hp.minus.max);

    if (!battleAtkPet) {
        resetDamageRows();
        return;
    }

    const mode = getSelectedDamageMode();
    const dmgType = getSelectedDamageType();
    const hits = Math.max(1, Math.trunc(Number(D.dmgHits.value) || 1));

    let power = Number(D.dmgPower.value) || 0;
    let mitigationFactor = 1;
    if (mode === 'complex') {
        const cpl = calcComplexPower({
            skillPower: D.cplSkillPower.value,
            responseMult: D.cplResponseMult.value,
            powerBonus: D.cplPowerBonus.value,
            atkUp: D.cplAtkUp.value,
            defDown: D.cplDefDown.value,
            atkDown: D.cplAtkDown.value,
            defUp: D.cplDefUp.value,
            stab: D.cplStab.value,
            typeEff: D.cplTypeEff.value,
            weather: D.cplWeather.value,
            mitigation: D.cplMitigation.value
        });
        power = cpl.power;
        mitigationFactor = cpl.mitigationFactor;
    }
    D.cplFinalPower.innerText = fmt1(power);

    const atkStats = calcFinalStats(battleAtkPet, getIvs(D.battleIvs), D.battleNaturePlus.value, D.battleNatureMinus.value);
    const atkValue = dmgType === 'physical' ? atkStats.atk : atkStats.matk;
    const defByNature = dmgType === 'physical' ? ranges.def : ranges.mdef;

    const calc = (atk, def, pwr) => (atk / def) * 0.9 * pwr * mitigationFactor * hits;

    const toDmgRange = (range) => ({
        min: calc(atkValue, range.max, power),
        max: calc(atkValue, range.min, power)
    });

    const minusDmg = toDmgRange(defByNature.minus);
    const neutralDmg = toDmgRange(defByNature.neutral);
    const plusDmg = toDmgRange(defByNature.plus);

    const dmgMin = Math.min(minusDmg.min, neutralDmg.min, plusDmg.min);
    const dmgMax = Math.max(minusDmg.max, neutralDmg.max, plusDmg.max);

    const toPointText = (hp, dmg) => {
        const pct = hp > 0 ? (dmg / hp) * 100 : 0;
        return `${fmt1(dmg)} (${fmt1(pct)}%)`;
    };

    D.resDmgMinus0.innerText = toPointText(ranges.hp.minus.min, minusDmg.max);
    D.resDmgMinus10.innerText = toPointText(ranges.hp.minus.max, minusDmg.min);
    D.resDmgNeutral0.innerText = toPointText(ranges.hp.neutral.min, neutralDmg.max);
    D.resDmgNeutral10.innerText = toPointText(ranges.hp.neutral.max, neutralDmg.min);
    D.resDmgPlus0.innerText = toPointText(ranges.hp.plus.min, plusDmg.max);
    D.resDmgPlus10.innerText = toPointText(ranges.hp.plus.max, plusDmg.min);

    D.resDmgAll.innerText = `${fmt1(dmgMin)}~${fmt1(dmgMax)}`;
}

function getCheckedRadio(name, fallback = 'physical') {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || fallback;
}

function calcDuelDirection(attackerPet, attackerIvsEls, attackerPlusEl, attackerMinusEl, defenderPet, defenderIvsEls, defenderPlusEl, defenderMinusEl, dmgType, power, hits, mitigationFactor = 1) {
    if (!attackerPet || !defenderPet) return null;

    const atkStats = calcFinalStats(
        attackerPet,
        getIvs(attackerIvsEls),
        attackerPlusEl.value,
        attackerMinusEl.value
    );
    const defStats = calcFinalStats(
        defenderPet,
        getIvs(defenderIvsEls),
        defenderPlusEl.value,
        defenderMinusEl.value
    );

    const atkVal = dmgType === 'physical' ? atkStats.atk : atkStats.matk;
    const defVal = Math.max(1, dmgType === 'physical' ? defStats.def : defStats.mdef);
    const p = Math.max(0, Number(power) || 0);
    const h = Math.max(1, Math.trunc(Number(hits) || 1));

    const single = (atkVal / defVal) * 0.9 * p * mitigationFactor;
    const total = single * h;
    const pct = defStats.hp > 0 ? (total / defStats.hp) * 100 : 0;
    const turns = total > 0 ? Math.max(1, Math.ceil(defStats.hp / total)) : 0;

    return {
        single,
        total,
        pct,
        turns: turns > 0 ? `${turns}击` : '-'
    };
}

function updateDuelUI() {
    const renderFinalStats = (pet, ivEls, plusEl, minusEl, refs) => {
        if (!pet) {
            refs.hp.innerText = '0.0';
            refs.atk.innerText = '0.0';
            refs.def.innerText = '0.0';
            refs.matk.innerText = '0.0';
            refs.mdef.innerText = '0.0';
            refs.spd.innerText = '0.0';
            return;
        }
        const stats = calcFinalStats(pet, getIvs(ivEls), plusEl.value, minusEl.value);
        refs.hp.innerText = fmt1(stats.hp);
        refs.atk.innerText = fmt1(stats.atk);
        refs.def.innerText = fmt1(stats.def);
        refs.matk.innerText = fmt1(stats.matk);
        refs.mdef.innerText = fmt1(stats.mdef);
        refs.spd.innerText = fmt1(stats.spd);
    };

    renderFinalStats(duelMyPet, D.duelMyIvs, D.duelMyNaturePlus, D.duelMyNatureMinus, {
        hp: D.duelMyFinalHp,
        atk: D.duelMyFinalAtk,
        def: D.duelMyFinalDef,
        matk: D.duelMyFinalMatk,
        mdef: D.duelMyFinalMdef,
        spd: D.duelMyFinalSpd
    });

    renderFinalStats(duelEnemyPet, D.duelEnemyIvs, D.duelEnemyNaturePlus, D.duelEnemyNatureMinus, {
        hp: D.duelEnemyFinalHp,
        atk: D.duelEnemyFinalAtk,
        def: D.duelEnemyFinalDef,
        matk: D.duelEnemyFinalMatk,
        mdef: D.duelEnemyFinalMdef,
        spd: D.duelEnemyFinalSpd
    });

    const reset = () => {
        D.duelMyToEnemySingle.innerText = '0.0';
        D.duelMyToEnemyTotal.innerText = '0.0';
        D.duelMyToEnemyPct.innerText = '0.0%';
        D.duelMyToEnemyTurns.innerText = '-';
        D.duelEnemyToMySingle.innerText = '0.0';
        D.duelEnemyToMyTotal.innerText = '0.0';
        D.duelEnemyToMyPct.innerText = '0.0%';
        D.duelEnemyToMyTurns.innerText = '-';
    };

    if (!duelMyPet || !duelEnemyPet) {
        D.duelMyCplFinalPower.innerText = '0.0';
        D.duelEnemyCplFinalPower.innerText = '0.0';
        reset();
        return;
    }

    const myMode = getSelectedDuelDamageMode('duelMyToEnemyMode');
    const enemyMode = getSelectedDuelDamageMode('duelEnemyToMyMode');

    let myPower = Number(D.duelMyToEnemyPower.value) || 0;
    let myMitigationFactor = 1;
    if (myMode === 'complex') {
        const cpl = calcComplexPower({
            skillPower: D.duelMyCplSkillPower.value,
            responseMult: D.duelMyCplResponseMult.value,
            powerBonus: D.duelMyCplPowerBonus.value,
            atkUp: D.duelMyCplAtkUp.value,
            defDown: D.duelMyCplDefDown.value,
            atkDown: D.duelMyCplAtkDown.value,
            defUp: D.duelMyCplDefUp.value,
            stab: D.duelMyCplStab.value,
            typeEff: D.duelMyCplTypeEff.value,
            weather: D.duelMyCplWeather.value,
            mitigation: D.duelMyCplMitigation.value
        });
        myPower = cpl.power;
        myMitigationFactor = cpl.mitigationFactor;
    }
    D.duelMyCplFinalPower.innerText = fmt1(myPower);

    let enemyPower = Number(D.duelEnemyToMyPower.value) || 0;
    let enemyMitigationFactor = 1;
    if (enemyMode === 'complex') {
        const cpl = calcComplexPower({
            skillPower: D.duelEnemyCplSkillPower.value,
            responseMult: D.duelEnemyCplResponseMult.value,
            powerBonus: D.duelEnemyCplPowerBonus.value,
            atkUp: D.duelEnemyCplAtkUp.value,
            defDown: D.duelEnemyCplDefDown.value,
            atkDown: D.duelEnemyCplAtkDown.value,
            defUp: D.duelEnemyCplDefUp.value,
            stab: D.duelEnemyCplStab.value,
            typeEff: D.duelEnemyCplTypeEff.value,
            weather: D.duelEnemyCplWeather.value,
            mitigation: D.duelEnemyCplMitigation.value
        });
        enemyPower = cpl.power;
        enemyMitigationFactor = cpl.mitigationFactor;
    }
    D.duelEnemyCplFinalPower.innerText = fmt1(enemyPower);

    const myToEnemy = calcDuelDirection(
        duelMyPet,
        D.duelMyIvs,
        D.duelMyNaturePlus,
        D.duelMyNatureMinus,
        duelEnemyPet,
        D.duelEnemyIvs,
        D.duelEnemyNaturePlus,
        D.duelEnemyNatureMinus,
        getCheckedRadio('duelMyToEnemyType', 'physical'),
        myPower,
        D.duelMyToEnemyHits.value,
        myMitigationFactor
    );

    const enemyToMy = calcDuelDirection(
        duelEnemyPet,
        D.duelEnemyIvs,
        D.duelEnemyNaturePlus,
        D.duelEnemyNatureMinus,
        duelMyPet,
        D.duelMyIvs,
        D.duelMyNaturePlus,
        D.duelMyNatureMinus,
        getCheckedRadio('duelEnemyToMyType', 'physical'),
        enemyPower,
        D.duelEnemyToMyHits.value,
        enemyMitigationFactor
    );

    if (!myToEnemy || !enemyToMy) {
        reset();
        return;
    }

    D.duelMyToEnemySingle.innerText = fmt1(myToEnemy.single);
    D.duelMyToEnemyTotal.innerText = fmt1(myToEnemy.total);
    D.duelMyToEnemyPct.innerText = `${fmt1(myToEnemy.pct)}%`;
    D.duelMyToEnemyTurns.innerText = myToEnemy.turns;

    D.duelEnemyToMySingle.innerText = fmt1(enemyToMy.single);
    D.duelEnemyToMyTotal.innerText = fmt1(enemyToMy.total);
    D.duelEnemyToMyPct.innerText = `${fmt1(enemyToMy.pct)}%`;
    D.duelEnemyToMyTurns.innerText = enemyToMy.turns;
}

function updateAll() {
    updateSimUI();
    updateBattleUI();
    updateDuelUI();
}

function setupEventListeners() {
    D.tabSimBtn.addEventListener('click', () => setTopTab('sim'));
    D.tabBattleBtn.addEventListener('click', () => setTopTab('battle'));
    D.tabDuelBtn.addEventListener('click', () => setTopTab('duel'));

    bindSearch(D.simSearch, D.simSearchResults, async (id) => {
        simPet = await fetchPetDetails(id);
        fillPetCard(simPet, {
            box: D.simPetInfo,
            img: D.simPetImg,
            name: D.simPetName,
            baseHp: D.simBaseHp,
            baseAtk: D.simBaseAtk,
            baseDef: D.simBaseDef,
            baseMatk: D.simBaseMatk,
            baseMdef: D.simBaseMdef,
            baseSpd: D.simBaseSpd
        });
        updateAll();
    });

    bindSearch(D.battleAtkSearch, D.battleAtkSearchResults, async (id) => {
        battleAtkPet = await fetchPetDetails(id);
        D.battleNaturePlus.value = '';
        D.battleNatureMinus.value = '';
        setIvs(D.battleIvs, { hp: 0, atk: 0, def: 0, matk: 0, mdef: 0, spd: 0 });
        updateAll();
    });

    bindSearch(D.battleDefSearch, D.battleDefSearchResults, async (id) => {
        battleDefPet = await fetchPetDetails(id);
        updateAll();
    });

    bindSearch(D.duelMySearch, D.duelMySearchResults, async (id) => {
        duelMyPet = await fetchPetDetails(id);
        fillPetCard(duelMyPet, {
            box: D.duelMyPetInfo,
            img: D.duelMyImg,
            name: D.duelMyName,
            baseHp: D.duelMyBaseHp,
            baseAtk: D.duelMyBaseAtk,
            baseDef: D.duelMyBaseDef,
            baseMatk: D.duelMyBaseMatk,
            baseMdef: D.duelMyBaseMdef,
            baseSpd: D.duelMyBaseSpd
        });
        updateAll();
    });

    bindSearch(D.duelEnemySearch, D.duelEnemySearchResults, async (id) => {
        duelEnemyPet = await fetchPetDetails(id);
        fillPetCard(duelEnemyPet, {
            box: D.duelEnemyPetInfo,
            img: D.duelEnemyImg,
            name: D.duelEnemyName,
            baseHp: D.duelEnemyBaseHp,
            baseAtk: D.duelEnemyBaseAtk,
            baseDef: D.duelEnemyBaseDef,
            baseMatk: D.duelEnemyBaseMatk,
            baseMdef: D.duelEnemyBaseMdef,
            baseSpd: D.duelEnemyBaseSpd
        });
        updateAll();
    });

    document.addEventListener('click', (e) => {
        [
            [D.simSearch, D.simSearchResults],
            [D.battleAtkSearch, D.battleAtkSearchResults],
            [D.battleDefSearch, D.battleDefSearchResults],
            [D.duelMySearch, D.duelMySearchResults],
            [D.duelEnemySearch, D.duelEnemySearchResults]
        ].forEach(([input, box]) => {
            if (!input.contains(e.target) && !box.contains(e.target)) box.style.display = 'none';
        });
    });

    D.simNaturePlus.addEventListener('change', () => { normalizeNaturePair(D.simNaturePlus, D.simNatureMinus, 'plus'); updateAll(); });
    D.simNatureMinus.addEventListener('change', () => { normalizeNaturePair(D.simNaturePlus, D.simNatureMinus, 'minus'); updateAll(); });
    D.battleNaturePlus.addEventListener('change', () => { normalizeNaturePair(D.battleNaturePlus, D.battleNatureMinus, 'plus'); updateAll(); });
    D.battleNatureMinus.addEventListener('change', () => { normalizeNaturePair(D.battleNaturePlus, D.battleNatureMinus, 'minus'); updateAll(); });
    D.duelMyNaturePlus.addEventListener('change', () => { normalizeNaturePair(D.duelMyNaturePlus, D.duelMyNatureMinus, 'plus'); updateAll(); });
    D.duelMyNatureMinus.addEventListener('change', () => { normalizeNaturePair(D.duelMyNaturePlus, D.duelMyNatureMinus, 'minus'); updateAll(); });
    D.duelEnemyNaturePlus.addEventListener('change', () => { normalizeNaturePair(D.duelEnemyNaturePlus, D.duelEnemyNatureMinus, 'plus'); updateAll(); });
    D.duelEnemyNatureMinus.addEventListener('change', () => { normalizeNaturePair(D.duelEnemyNaturePlus, D.duelEnemyNatureMinus, 'minus'); updateAll(); });

    Object.values(D.simIvs).forEach(el => el.addEventListener('input', updateAll));
    Object.values(D.battleIvs).forEach(el => el.addEventListener('input', updateAll));
    Object.values(D.duelMyIvs).forEach(el => el.addEventListener('input', updateAll));
    Object.values(D.duelEnemyIvs).forEach(el => el.addEventListener('input', updateAll));

    ['dmgMode', 'dmgType'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(el => el.addEventListener('change', () => {
            updateDamageModeUI();
            updateAll();
        }));
    });

    [
        D.dmgPower, D.dmgHits,
        D.cplSkillPower, D.cplResponseMult, D.cplPowerBonus,
        D.cplAtkUp, D.cplDefDown, D.cplAtkDown, D.cplDefUp,
        D.cplStab, D.cplTypeEff, D.cplWeather, D.cplMitigation
    ].forEach(el => el.addEventListener('input', updateAll));

    [
        D.duelMyToEnemyPower,
        D.duelMyToEnemyHits,
        D.duelEnemyToMyPower,
        D.duelEnemyToMyHits
    ].forEach(el => el.addEventListener('input', updateAll));

    ['duelMyToEnemyType', 'duelEnemyToMyType'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
            el.addEventListener('change', updateAll);
        });
    });

    ['duelMyToEnemyMode', 'duelEnemyToMyMode'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
            el.addEventListener('change', () => {
                updateDuelDamageModeUI();
                updateAll();
            });
        });
    });

    D.simPresetSaveBtn.addEventListener('click', () => {
        if (!simPet) {
            alert('请先在 Tab1 选择精灵后再保存模板。');
            return;
        }
        const list = getPresets();
        const existing = list.find(p => p.petId === simPet.id);
        const payload = {
            id: existing?.id || `pet-${simPet.id}`,
            petId: simPet.id,
            petName: simPet.name,
            naturePlus: D.simNaturePlus.value || '',
            natureMinus: D.simNatureMinus.value || '',
            ivs: getIvs(D.simIvs),
            updatedAt: Date.now()
        };
        const next = existing ? list.map(p => p.id === existing.id ? payload : p) : [...list, payload];
        savePresets(next);
        renderPresetSelects(payload.id);
    });


        [
            D.duelMyCplSkillPower, D.duelMyCplResponseMult, D.duelMyCplPowerBonus,
            D.duelMyCplAtkUp, D.duelMyCplDefDown, D.duelMyCplAtkDown, D.duelMyCplDefUp,
            D.duelMyCplStab, D.duelMyCplTypeEff, D.duelMyCplWeather, D.duelMyCplMitigation,
            D.duelEnemyCplSkillPower, D.duelEnemyCplResponseMult, D.duelEnemyCplPowerBonus,
            D.duelEnemyCplAtkUp, D.duelEnemyCplDefDown, D.duelEnemyCplAtkDown, D.duelEnemyCplDefUp,
            D.duelEnemyCplStab, D.duelEnemyCplTypeEff, D.duelEnemyCplWeather, D.duelEnemyCplMitigation
        ].forEach(el => el.addEventListener('input', updateAll));
    D.simPresetLoadBtn.addEventListener('click', async () => {
        const preset = getPresets().find(p => p.id === D.simPresetSelect.value);
        if (!preset) return;
        if (!simPet || simPet.id !== preset.petId) {
            simPet = await fetchPetDetails(preset.petId);
            fillPetCard(simPet, {
                box: D.simPetInfo,
                img: D.simPetImg,
                name: D.simPetName,
                baseHp: D.simBaseHp,
                baseAtk: D.simBaseAtk,
                baseDef: D.simBaseDef,
                baseMatk: D.simBaseMatk,
                baseMdef: D.simBaseMdef,
                baseSpd: D.simBaseSpd
            });
        }
        applyConfigToSim(preset);
        updateAll();
    });

    D.simPresetDeleteBtn.addEventListener('click', () => {
        const id = D.simPresetSelect.value;
        if (!id) return;
        const next = getPresets().filter(p => p.id !== id);
        savePresets(next);
        renderPresetSelects();
    });

    D.battlePresetLoadBtn.addEventListener('click', async () => {
        const preset = getPresets().find(p => p.id === D.battlePresetSelect.value);
        if (!preset) return;
        if (!battleAtkPet || battleAtkPet.id !== preset.petId) {
            battleAtkPet = await fetchPetDetails(preset.petId);
            D.battleAtkSearch.value = preset.petName;
        }
        applyConfigToBattle(preset);
        updateAll();
    });

    D.duelMyPresetLoadBtn.addEventListener('click', async () => {
        const preset = getPresets().find(p => p.id === D.duelMyPresetSelect.value);
        if (!preset) return;
        if (!duelMyPet || duelMyPet.id !== preset.petId) {
            duelMyPet = await fetchPetDetails(preset.petId);
            D.duelMySearch.value = preset.petName;
            fillPetCard(duelMyPet, {
                box: D.duelMyPetInfo,
                img: D.duelMyImg,
                name: D.duelMyName,
                baseHp: D.duelMyBaseHp,
                baseAtk: D.duelMyBaseAtk,
                baseDef: D.duelMyBaseDef,
                baseMatk: D.duelMyBaseMatk,
                baseMdef: D.duelMyBaseMdef,
                baseSpd: D.duelMyBaseSpd
            });
        }
        applyConfigToDuelMy(preset);
        updateAll();
    });

    D.duelEnemyPresetLoadBtn.addEventListener('click', async () => {
        const preset = getPresets().find(p => p.id === D.duelEnemyPresetSelect.value);
        if (!preset) return;
        if (!duelEnemyPet || duelEnemyPet.id !== preset.petId) {
            duelEnemyPet = await fetchPetDetails(preset.petId);
            D.duelEnemySearch.value = preset.petName;
            fillPetCard(duelEnemyPet, {
                box: D.duelEnemyPetInfo,
                img: D.duelEnemyImg,
                name: D.duelEnemyName,
                baseHp: D.duelEnemyBaseHp,
                baseAtk: D.duelEnemyBaseAtk,
                baseDef: D.duelEnemyBaseDef,
                baseMatk: D.duelEnemyBaseMatk,
                baseMdef: D.duelEnemyBaseMdef,
                baseSpd: D.duelEnemyBaseSpd
            });
        }
        applyConfigToDuelEnemy(preset);
        updateAll();
    });
}

function init() {
    setupNatureSelectors(D.simNaturePlus, D.simNatureMinus);
    setupNatureSelectors(D.battleNaturePlus, D.battleNatureMinus);
    setupNatureSelectors(D.duelMyNaturePlus, D.duelMyNatureMinus);
    setupNatureSelectors(D.duelEnemyNaturePlus, D.duelEnemyNatureMinus);
    renderPresetSelects();
    setTopTab('sim');
    updateDamageModeUI();
    updateDuelDamageModeUI();
    setupEventListeners();
    updateAll();
    requestWindowFit();
}

init();
