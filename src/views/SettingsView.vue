<template>
  <section class="page">
    <div class="header">
      <div class="badge">⚙️</div>
      <h2>系統設定</h2>
    </div>

    <div class="content">
      <div class="card">
        <h3>系統資訊</h3>
        <p class="desc">目前專案的程式碼統計與最近更新時間。</p>

        <div class="stats-grid">
          <div class="stat-box">
            <span class="stat-label">程式碼行數</span>
            <strong class="stat-value">{{ codeLineCount.toLocaleString() }}</strong>
          </div>
          <div class="stat-box">
            <span class="stat-label">更新日期</span>
            <strong class="stat-value">{{ lastUpdated }}</strong>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>應用程式金鑰</h3>
        <p class="desc">請妥善保存您的金鑰資訊，切勿洩漏給未授權的人員。</p>
        
        <div class="form-group">
          <label>Back4app App ID</label>
          <div class="input-wrapper">
            <input type="text" v-model="appId" placeholder="未設定" />
            <button class="copy-btn" @click="copyToClipboard(appId)">複製</button>
          </div>
        </div>

        <div class="form-group">
          <label>JavaScript Keys</label>
          <div class="input-wrapper">
            <input type="text" v-model="jsKeys" placeholder="未設定" />
            <button class="copy-btn" @click="copyToClipboard(jsKeys)">複製</button>
          </div>
        </div>

        <div class="form-group">
          <label>Master Keys</label>
          <div class="input-wrapper">
            <input type="text" v-model="masterKeys" placeholder="未設定" />
            <button class="copy-btn" @click="copyToClipboard(masterKeys)">複製</button>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" @click="saveSettings">儲存設定</button>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3>資料結構管理</h3>
        <p class="desc">管理 Back4app 資料庫結構。</p>
        
        <div class="actions start">
          <button class="btn" @click="initFoodSchema">初始化 Food Class Schema</button>
          <button class="btn" @click="initSubscriptionSchema">初始化 Subscription Class Schema</button>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3>資料匯出</h3>
        <p class="desc">將資料匯出為 CSV 檔案以進行備份或分析。</p>
        
        <div class="actions start">
          <button class="btn" @click="exportFoodCSV">匯出 back4appfood.csv</button>
          <button class="btn" @click="exportSubscriptionCSV">匯出 back4appsubscription.csv</button>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h3>資料匯入</h3>
        <p class="desc">根據匯出的 CSV 格式匯入資料至 Back4app。</p>
        
        <div class="actions start">
          <input type="file" ref="foodFile" accept=".csv" style="display: none" @change="handleFoodImport">
          <button class="btn" @click="$refs.foodFile.click()">匯入 Food CSV</button>
          
          <input type="file" ref="subscriptionFile" accept=".csv" style="display: none" @change="handleSubscriptionImport">
          <button class="btn" @click="$refs.subscriptionFile.click()">匯入 Subscription CSV</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Parse from '../services/parse';

const appId = ref('');
const jsKeys = ref('');
const masterKeys = ref('');
const foodFile = ref(null);
const subscriptionFile = ref(null);
const codeLineCount = ref(0);
const lastUpdated = ref('未設定');

onMounted(() => {
  appId.value = localStorage.getItem('custom_app_id') || import.meta.env.VITE_APP_ID || 'D9ePfYNRGVu2JZaYbPeGW8ECfLKxIjt7ONXHjH5L';
  jsKeys.value = localStorage.getItem('custom_js_key') || import.meta.env.VITE_JS_KEYS || 'yT9NcJJY2YLIAR3mZ3Tx8R57Chf9kPZz1HX4uAlS';
  masterKeys.value = localStorage.getItem('custom_master_key') || import.meta.env.VITE_MASTER_KEYS || 'NAHLbqx2lTsOqJJxulcFNt66N4r7TZ5tZceE1WIc';
  fetchAppStats();
});

const fetchAppStats = async () => {
  try {
    const response = await fetch('/app-stats.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const stats = await response.json();
    codeLineCount.value = Number(stats.codeLineCount || 0);
    lastUpdated.value = stats.lastUpdated || '未設定';
  } catch (error) {
    console.warn('Failed to load app stats:', error);
  }
};

const saveSettings = () => {
  localStorage.setItem('custom_app_id', appId.value);
  localStorage.setItem('custom_js_key', jsKeys.value);
  localStorage.setItem('custom_master_key', masterKeys.value);
  alert('設定已儲存，頁面將重新載入以生效。');
  window.location.reload();
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text || '').then(() => {
    alert('已複製到剪貼簿')
  }).catch(() => {})
}

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  
  if (array.length === 0) return '';

  // Get headers
  const headers = Object.keys(array[0]).join(',');
  str += headers + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (const index in array[i]) {
      if (line !== '') line += ',';
      
      let item = array[i][index];
      
      // Handle null/undefined
      if (item === null || item === undefined) {
        item = '';
      }
      
      // Handle strings containing commas or newlines
      if (typeof item === 'string') {
        if (item.includes(',') || item.includes('\n') || item.includes('"')) {
          item = '"' + item.replace(/"/g, '""') + '"';
        }
      } else if (item instanceof Date) {
        item = item.toISOString();
      }
      
      line += item;
    }
    str += line + '\r\n';
  }
  return str;
};

const downloadCSV = (csvStr, fileName) => {
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const exportFoodCSV = async () => {
  try {
    const Food = Parse.Object.extend('food');
    const query = new Parse.Query(Food);
    query.limit(1000);
    const results = await query.find();
    
    const data = results.map(item => ({
      objectId: item.id,
      name: item.get('name'),
      amount: item.get('amount'),
      price: item.get('price'),
      shop: item.get('shop'),
      todate: item.get('todate') ? item.get('todate').toISOString() : '',
      photo: item.get('photo'),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'back4appfood.csv');
  } catch (error) {
    console.error('Error exporting food CSV:', error);
    alert('匯出失敗：' + error.message);
  }
};

const exportSubscriptionCSV = async () => {
  try {
    const Subscription = Parse.Object.extend('subscription');
    const query = new Parse.Query(Subscription);
    query.limit(1000);
    const results = await query.find();
    
    const data = results.map(item => ({
      objectId: item.id,
      name: item.get('name'),
      price: item.get('price'),
      nextdate: item.get('nextdate') ? item.get('nextdate').toISOString() : '',
      site: item.get('site'),
      note: item.get('note'),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    const csv = convertToCSV(data);
    downloadCSV(csv, 'back4appsubscription.csv');
  } catch (error) {
    console.error('Error exporting subscription CSV:', error);
    alert('匯出失敗：' + error.message);
  }
};

const parseCSV = (text) => {
  const lines = text.split(/\r\n|\n/);
  const result = [];
  
  // Basic CSV parser
  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = [];
    let current = '';
    let inQuote = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        if (inQuote && line[j+1] === '"') {
          // Double quote inside quote
          current += '"';
          j++;
        } else {
          inQuote = !inQuote;
        }
      } else if (char === ',' && !inQuote) {
        row.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current);
    result.push(row);
  }
  return result;
};

const handleFoodImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target.result;
    await importFoodData(text);
  };
  reader.readAsText(file);
  event.target.value = '';
};

const importFoodData = async (csvText) => {
  try {
    const rows = parseCSV(csvText);
    const Food = Parse.Object.extend('food');
    let count = 0;

    for (const row of rows) {
      // Expected: objectId, name, amount, price, shop, todate, photo, createdAt, updatedAt
      // Indices: 0, 1, 2, 3, 4, 5, 6, 7, 8
      if (row.length < 2) continue; 

      const food = new Food();
      food.set('name', row[1]);
      food.set('amount', Number(row[2]) || 0);
      food.set('price', Number(row[3]) || 0);
      food.set('shop', row[4]);
      if (row[5]) food.set('todate', new Date(row[5]));
      food.set('photo', row[6]);
      
      await food.save();
      count++;
    }
    alert(`成功匯入 ${count} 筆食品資料！`);
  } catch (error) {
    console.error('Import error:', error);
    alert('匯入失敗：' + error.message);
  }
};

const handleSubscriptionImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target.result;
    await importSubscriptionData(text);
  };
  reader.readAsText(file);
  event.target.value = '';
};

const importSubscriptionData = async (csvText) => {
  try {
    const rows = parseCSV(csvText);
    const Subscription = Parse.Object.extend('subscription');
    let count = 0;

    for (const row of rows) {
      // Expected: objectId, name, price, nextdate, site, note, createdAt, updatedAt
      // Indices: 0, 1, 2, 3, 4, 5, 6, 7
      if (row.length < 2) continue;

      const sub = new Subscription();
      sub.set('name', row[1]);
      sub.set('price', Number(row[2]) || 0);
      if (row[3]) sub.set('nextdate', new Date(row[3]));
      sub.set('site', row[4]);
      sub.set('note', row[5]);
      
      await sub.save();
      count++;
    }
    alert(`成功匯入 ${count} 筆訂閱資料！`);
  } catch (error) {
    console.error('Import error:', error);
    alert('匯入失敗：' + error.message);
  }
};

const initFoodSchema = async () => {
  if (!appId.value || !masterKeys.value) {
    alert('請先設定 App ID 和 Master Key');
    return;
  }

  const schema = {
    className: "food",
    fields: {
      name: { type: "String", required: false },
      amount: { type: "Number", required: false },
      price: { type: "Number", required: false },
      shop: { type: "String", required: false },
      photo: { type: "String", required: false },
      photohash: { type: "String", required: false },
      todate: { type: "Date", required: false }
    },
    classLevelPermissions: {
      find: { "*": true },
      count: { "*": true },
      get: { "*": true },
      create: { "*": true },
      update: { "*": true },
      delete: { "*": true },
      addField: { "*": true },
      protectedFields: { "*": [] }
    }
  };

  try {
    // 1. Check if schema exists
    const checkResponse = await fetch('https://parseapi.back4app.com/schemas/food', {
      method: 'GET',
      headers: {
        'X-Parse-Application-Id': appId.value,
        'X-Parse-Master-Key': masterKeys.value,
        'Content-Type': 'application/json'
      }
    });

    if (checkResponse.ok) {
      alert('Food Class 已存在，無需新增。');
      return;
    } else if (checkResponse.status !== 404 && checkResponse.status !== 400) {
        // 400 or 404 usually means not found or bad request (if class name invalid), but 404 is typical for schema not found.
        // However, Parse Server might return 200 with empty list if listing schemas, but for specific schema it should be 404 or error.
        // Let's proceed to create if it's 404. If it's other error, throw.
        // Actually, Parse response for non-existent schema might vary. 
        // Let's assume if it fails, we try to create.
        const errorData = await checkResponse.json();
        console.warn('Check schema failed (might not exist):', errorData);
    }

    // 2. Create Schema
    const createResponse = await fetch('https://parseapi.back4app.com/schemas/food', {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': appId.value,
        'X-Parse-Master-Key': masterKeys.value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schema)
    });

    if (createResponse.ok) {
      alert('Food Class 初始化成功！');
    } else {
      const errorData = await createResponse.json();
      console.error('Create schema error:', errorData);
      alert('初始化失敗：' + (errorData.error || '未知錯誤'));
    }

  } catch (error) {
    console.error('Init schema error:', error);
    alert('執行錯誤：' + error.message);
  }
};

const initSubscriptionSchema = async () => {
  if (!appId.value || !masterKeys.value) {
    alert('請先設定 App ID 和 Master Key');
    return;
  }

  const schema = {
    className: "subscription",
    fields: {
      name: { type: "String", required: true },
      price: { type: "Number", required: false },
      nextdate: { type: "Date", required: false },
      site: { type: "String", required: false },
      account: { type: "String", required: false },
      note: { type: "String", required: false }
    },
    classLevelPermissions: {
      find: { "*": true },
      count: { "*": true },
      get: { "*": true },
      create: { "*": true },
      update: { "*": true },
      delete: { "*": true },
      addField: { "*": true },
      protectedFields: { "*": [] }
    }
  };

  try {
    // 1. Check if schema exists
    const checkResponse = await fetch('https://parseapi.back4app.com/schemas/subscription', {
      method: 'GET',
      headers: {
        'X-Parse-Application-Id': appId.value,
        'X-Parse-Master-Key': masterKeys.value,
        'Content-Type': 'application/json'
      }
    });

    if (checkResponse.ok) {
      alert('Subscription Class 已存在，無需新增。');
      return;
    } else if (checkResponse.status !== 404 && checkResponse.status !== 400) {
        const errorData = await checkResponse.json();
        console.warn('Check schema failed (might not exist):', errorData);
    }

    // 2. Create Schema
    const createResponse = await fetch('https://parseapi.back4app.com/schemas/subscription', {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': appId.value,
        'X-Parse-Master-Key': masterKeys.value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schema)
    });

    if (createResponse.ok) {
      alert('Subscription Class 初始化成功！');
    } else {
      const errorData = await createResponse.json();
      console.error('Create schema error:', errorData);
      alert('初始化失敗：' + (errorData.error || '未知錯誤'));
    }

  } catch (error) {
    console.error('Init schema error:', error);
    alert('執行錯誤：' + error.message);
  }
};
</script>

<style scoped>
.actions {
  margin-top: 1.2rem;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.actions.start {
  justify-content: flex-start;
}
.btn {
  border: 1px solid rgba(151, 191, 255, 0.12);
  padding: 0.85rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.94rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-strong);
}
.btn:hover {
  border-color: rgba(120, 217, 255, 0.28);
}
.primary {
  background: linear-gradient(135deg, rgba(72, 166, 255, 0.3), rgba(78, 255, 199, 0.18));
  border-color: rgba(120, 217, 255, 0.28);
}
.page {
  color: var(--color-text);
  max-width: 980px;
  display: grid;
  gap: 1rem;
}
.header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.25rem 1.3rem;
  border-radius: var(--radius-xl);
  background: var(--panel-bg);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}
.header h2 {
  margin: 0;
  font-size: clamp(1.45rem, 1.15rem + 0.8vw, 2.2rem);
}
.badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(101, 216, 255, 1), rgba(63, 103, 255, 0.82));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #04111f;
  box-shadow: 0 18px 36px rgba(47, 113, 255, 0.22);
}
.card {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  padding: 1.4rem;
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}
h3 {
  margin-bottom: 0.55rem;
  font-size: 1.15rem;
}
.desc {
  color: var(--color-text-soft);
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.stat-box {
  padding: 1rem 1.1rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  display: grid;
  gap: 0.35rem;
}

.stat-label {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.stat-value {
  font-size: clamp(1.35rem, 1.1rem + 0.8vw, 2rem);
  color: var(--color-text-strong);
}
.form-group {
  margin-bottom: 1.1rem;
}
.form-group:last-child {
  margin-bottom: 0;
}
label {
  display: block;
  margin-bottom: 0.55rem;
  font-weight: 600;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
}
.input-wrapper {
  display: flex;
  gap: 0.8rem;
}
input {
  flex: 1;
  background: rgba(7, 12, 26, 0.82);
  border: 1px solid rgba(151, 191, 255, 0.12);
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  color: var(--color-text-strong);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: 0.95rem;
}
input:focus {
  outline: none;
  border-color: rgba(120, 217, 255, 0.28);
}
.copy-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(151, 191, 255, 0.12);
  color: var(--color-text-strong);
  padding: 0 1rem;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.copy-btn:hover {
  border-color: rgba(120, 217, 255, 0.28);
}

@media (max-width: 600px) {
  .page {
    gap: 0.85rem;
  }

  .header,
  .card {
    padding: 1rem;
  }

  .header {
    padding: 1rem;
  }
  .actions {
    justify-content: flex-start;
    margin-top: 1rem;
  }
  .actions .btn {
    width: 100%;
  }
  .input-wrapper {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
