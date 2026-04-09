const API_BASE = 'http://159.65.135.84:8081/api/v1/data';
const IMAGE_BASE = 'http://159.65.135.84:8081';

// 状态数据
let natures = [];
let atkPet = null;
let defPet = null;

// DOM元素缓存
const D = {
    atkSearch: document.getElementById('atkSearch'),
    atkSearchResults: document.getElementById('atkSearchResults'),
    atkPetInfo: document.getElementById('atkPetInfo'),
    atkPetImg: document.getElementById('atkPetImg'),
    atkPetName: document.getElementById('atkPetName'),
    atkBaseHp: document.getElementById('atkBaseHp'),
    atkBaseAtk: document.getElementById('atkBaseAtk'),
    atkBaseDef: document.getElementById('atkBaseDef'),
    atkBaseMatk: document.getElementById('atkBaseMatk'),
    atkBaseMdef: document.getElementById('atkBaseMdef'),
    atkBaseSpd: document.getElementById('atkBaseSpd'),
    atkNature: document.getElementById('atkNature'),
    atkStarLevel: document.getElementById('atkStarLevel'),

    defSearch: document.getElementById('defSearch'),
    defSearchResults: document.getElementById('defSearchResults'),
    defPetInfo: document.getElementById('defPetInfo'),
    defPetImg: document.getElementById('defPetImg'),
    defPetName: document.getElementById('defPetName'),
    defBaseDef: document.getElementById('defBaseDef'),
    defBaseMdef: document.getElementById('defBaseMdef'),
    defStarLevel: document.getElementById('defStarLevel'),

    // 各种输入框集合
    atkIvs: {
        hp: document.getElementById('atkIvHp'),
        atk: document.getElementById('atkIvAtk'),
        def: document.getElementById('atkIvDef'),
        matk: document.getElementById('atkIvMatk'),
        mdef: document.getElementById('atkIvMdef'),
        spd: document.getElementById('atkIvSpd')
    },
    defIvs: {
        def: document.getElementById('defIvDef'),
        mdef: document.getElementById('defIvMdef')
    }
};

// 属性ID映射
const ATTR_MAP = { hp: 79, atk: 80, matk: 81, def: 82, mdef: 83, spd: 84 };

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 初始化
async function init() {
    try {
        const res = await fetch(`${API_BASE}/natures`);
        natures = await res.json();
        
        // 填充性格下拉
        D.atkNature.innerHTML = natures.map(n => `<option value="${n.id}">${n.name}</option>`).join('');
        
        // 设置默认选固执或保守
        const defaultNature = natures.find(n => n.name === '固执' || n.name === '保守');
        if (defaultNature) {
            D.atkNature.value = defaultNature.id;
        }
    } catch (e) {
        console.error('加载性格失败，请确认后端已启动:', e);
        D.atkNature.innerHTML = '<option value="">无</option>';
    }

    setupEventListeners();
    updateCalculations();
}

function setupEventListeners() {
    // 搜索监听
    D.atkSearch.addEventListener('input', debounce(e => handleSearch(e.target.value, D.atkSearchResults, 'atk'), 300));
    D.defSearch.addEventListener('input', debounce(e => handleSearch(e.target.value, D.defSearchResults, 'def'), 300));

    // 点击外部隐藏搜索结果
    document.addEventListener('click', (e) => {
        if (!D.atkSearch.contains(e.target) && !D.atkSearchResults.contains(e.target)) {
            D.atkSearchResults.style.display = 'none';
        }
        if (!D.defSearch.contains(e.target) && !D.defSearchResults.contains(e.target)) {
            D.defSearchResults.style.display = 'none';
        }
    });

    // 重新计算触发器
    const recalcInputs = [
        D.atkNature, D.atkStarLevel, 
        ...Object.values(D.atkIvs),
        D.defStarLevel, ...Object.values(D.defIvs),
        document.getElementById('dmgPower')
    ];
    document.querySelectorAll('input[name="dmgType"]').forEach(r => recalcInputs.push(r));

    recalcInputs.forEach(el => {
        el.addEventListener('change', updateCalculations);
        if (el.tagName === 'INPUT' && el.type === 'number') {
            el.addEventListener('input', updateCalculations);
        }
    });
}

async function handleSearch(keyword, resultContainer, side) {
    if (!keyword.trim()) {
        resultContainer.style.display = 'none';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/pets?keyword=${encodeURIComponent(keyword)}&size=10`);
        const data = await res.json();
        const pets = Array.isArray(data) ? data : (data.content || []);

        if (pets.length > 0) {
            resultContainer.innerHTML = pets.map(p => `
                <div class="search-item" data-id="${p.id}">
                    <img src="${IMAGE_BASE}${p.imageUrl}" style="width:20px;height:20px;vertical-align:middle;margin-right:5px;">
                    ${p.name}
                </div>
            `).join('');
            resultContainer.style.display = 'block';

            resultContainer.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = item.dataset.id;
                    loadPetDetails(id, side);
                    resultContainer.style.display = 'none';
                    if (side === 'atk') D.atkSearch.value = item.innerText.trim();
                    if (side === 'def') D.defSearch.value = item.innerText.trim();
                });
            });
        } else {
            resultContainer.innerHTML = '<div style="padding:8px;color:#888;">未找到精灵</div>';
            resultContainer.style.display = 'block';
        }
    } catch (e) {
        console.error('搜索失败:', e);
    }
}

async function loadPetDetails(id, side) {
    try {
        const res = await fetch(`${API_BASE}/pets/${id}/details`);
        const pet = await res.json();
        
        if (side === 'atk') {
            atkPet = pet;
            D.atkPetInfo.classList.remove('hidden');
            D.atkPetImg.src = `${IMAGE_BASE}${pet.imageUrl}`;
            D.atkPetName.innerText = pet.name;
            D.atkBaseHp.innerText = pet.hp;
            D.atkBaseAtk.innerText = pet.attack;
            D.atkBaseDef.innerText = pet.defense;
            D.atkBaseMatk.innerText = pet.magic_attack;
            D.atkBaseMdef.innerText = pet.magic_defense;
            D.atkBaseSpd.innerText = pet.speed;
        } else {
            defPet = pet;
            D.defPetInfo.classList.remove('hidden');
            D.defPetImg.src = `${IMAGE_BASE}${pet.imageUrl}`;
            D.defPetName.innerText = pet.name;
            D.defBaseDef.innerText = pet.defense;
            D.defBaseMdef.innerText = pet.magic_defense;
        }
        updateCalculations();
    } catch (e) {
        console.error('获取详情失败:', e);
    }
}

function updateCalculations() {
    let atkResults = null;
    let defMatrix = null;

    // 1. 计算我方能力值
    if (atkPet) {
        const starLevel = parseInt(D.atkStarLevel.value);
        const natureId = parseInt(D.atkNature.value);
        const nature = natures.find(n => n.id === natureId) || {};
        
        const getMod = (attrId) => {
            if (nature.plus_attr_id === attrId) return 1.1 + starLevel * 0.02;
            if (nature.minus_attr_id === attrId) return 0.9;
            return 1.0;
        };

        const talentModHP = (1 + starLevel) * 0.85;
        const talentModOther = (1 + starLevel) * 0.55;

        const calc = (base, iv, mod, isHp = false) => {
            if (isHp) {
                return Math.floor((base * 1.7 + iv * talentModHP + 70) * mod + 100);
            }
            return Math.floor((base * 1.1 + iv * talentModOther + 10) * mod + 50);
        };

        atkResults = {
            hp: calc(atkPet.hp, parseInt(D.atkIvs.hp.value), getMod(ATTR_MAP.hp), true),
            atk: calc(atkPet.attack, parseInt(D.atkIvs.atk.value), getMod(ATTR_MAP.atk)),
            def: calc(atkPet.defense, parseInt(D.atkIvs.def.value), getMod(ATTR_MAP.def)),
            matk: calc(atkPet.magic_attack, parseInt(D.atkIvs.matk.value), getMod(ATTR_MAP.matk)),
            mdef: calc(atkPet.magic_defense, parseInt(D.atkIvs.mdef.value), getMod(ATTR_MAP.mdef)),
            spd: calc(atkPet.speed, parseInt(D.atkIvs.spd.value), getMod(ATTR_MAP.spd))
        };

        document.getElementById('atkFinalHp').innerText = atkResults.hp;
        document.getElementById('atkFinalAtk').innerText = atkResults.atk;
        document.getElementById('atkFinalDef').innerText = atkResults.def;
        document.getElementById('atkFinalMatk').innerText = atkResults.matk;
        document.getElementById('atkFinalMdef').innerText = atkResults.mdef;
        document.getElementById('atkFinalSpd').innerText = atkResults.spd;
    }

    // 2. 计算敌方防御矩阵
    if (defPet) {
        const starLevel = parseInt(D.defStarLevel.value);
        const talentModOther = (1 + starLevel) * 0.55;
        
        const calcDef = (base, iv, mod) => {
            return Math.floor((base * 1.1 + iv * talentModOther + 10) * mod + 50);
        };

        const defIv = parseInt(D.defIvs.def.value);
        const mdefIv = parseInt(D.defIvs.mdef.value);
        
        const plusMod = 1.1 + starLevel * 0.02;

        defMatrix = {
            plusDef: calcDef(defPet.defense, defIv, plusMod),
            neutralDef: calcDef(defPet.defense, defIv, 1.0),
            minusDef: calcDef(defPet.defense, defIv, 0.9),
            plusMdef: calcDef(defPet.magic_defense, mdefIv, plusMod),
            neutralMdef: calcDef(defPet.magic_defense, mdefIv, 1.0),
            minusMdef: calcDef(defPet.magic_defense, mdefIv, 0.9)
        };

        document.getElementById('defPlusDef').innerText = defMatrix.plusDef;
        document.getElementById('defNeutralDef').innerText = defMatrix.neutralDef;
        document.getElementById('defMinusDef').innerText = defMatrix.minusDef;
        
        document.getElementById('defPlusMdef').innerText = defMatrix.plusMdef;
        document.getElementById('defNeutralMdef').innerText = defMatrix.neutralMdef;
        document.getElementById('defMinusMdef').innerText = defMatrix.minusMdef;
    }

    // 3. 计算最终伤害
    if (atkResults && defMatrix) {
        const dmgType = document.querySelector('input[name="dmgType"]:checked').value;
        const power = parseFloat(document.getElementById('dmgPower').value) || 0;
        
        let a = dmgType === 'physical' ? atkResults.atk : atkResults.matk;
        let dPlus = dmgType === 'physical' ? defMatrix.plusDef : defMatrix.plusMdef;
        let dNeutral = dmgType === 'physical' ? defMatrix.neutralDef : defMatrix.neutralMdef;
        let dMinus = dmgType === 'physical' ? defMatrix.minusDef : defMatrix.minusMdef;

        const calcDmg = (atk, def, pwr) => Math.floor((atk / def) * 0.9 * pwr);

        document.getElementById('resDmgPlus').innerText = calcDmg(a, dPlus, power);
        document.getElementById('resDmgNeutral').innerText = calcDmg(a, dNeutral, power);
        document.getElementById('resDmgMinus').innerText = calcDmg(a, dMinus, power);
    }
}

// 启动
init();