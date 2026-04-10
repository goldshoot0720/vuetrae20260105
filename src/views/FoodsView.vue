<template>
  <section class="page">
    <div class="header">
      <div class="badge">🍎</div>
      <h2>食品管理系統</h2>
      <div class="actions">
        <input
          ref="foodFile"
          type="file"
          accept=".csv,text/csv"
          class="hidden-file"
          @change="handleFoodImport"
        >
        <button class="btn" @click="fetchData">重新載入</button>
        <button class="btn" @click="exportFoodCSV">匯出 CSV</button>
        <button class="btn" @click="foodFile?.click()">匯入 CSV</button>
        <button class="btn primary" @click="openModal(null)">新增食品</button>
      </div>
    </div>
    <div class="toolbar">
      <input
        v-model.trim="searchTerm"
        class="search"
        placeholder="搜尋食品名稱、商店、圖片雜湊..."
      >
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="cards">
      <div class="card" v-for="item in filteredFoods" :key="item.id">
        <div class="thumb food" :style="item.get('photo') ? { backgroundImage: `url(${item.get('photo')})` } : {}"></div>
        <div class="meta">
          <div class="name">{{ item.get('name') || '未命名' }}</div>
          <div class="info">
            <span v-if="item.get('shop')" class="shop-tag">🏠 {{ item.get('shop') }}</span>
            <div class="details">
              <span>數量：{{ item.get('amount') || 0 }}</span>
              <span>價格：{{ Number(item.get('price') || 0).toLocaleString() }}</span>
            </div>
            <div v-if="item.get('photohash')" class="hash">雜湊：{{ item.get('photohash') }}</div>
            <div class="expiry" :class="{ expired: isExpired(item.get('todate')), warning: isExpiringSoon(item.get('todate')) }">
              📅 {{ item.get('todate') ? new Date(item.get('todate')).toLocaleDateString() : '未設定' }}
              <span v-if="item.get('todate')">({{ getDaysRemaining(item.get('todate')) }})</span>
            </div>
          </div>
          <div class="ops">
            <button class="btn" @click="openModal(item)">編輯</button>
            <button class="btn danger" @click="deleteFood(item)">刪除</button>
          </div>
        </div>
      </div>
      <div v-if="filteredFoods.length === 0" class="no-data">
        暫無資料或查無符合項目
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingItem ? '編輯食品' : '新增食品' }}</h3>
        <div class="form-grid">
          <div class="form-group full">
            <label>名稱</label>
            <input v-model="formData.name" placeholder="請輸入食品名稱">
          </div>
          <div class="form-group">
            <label>數量</label>
            <input type="number" v-model.number="formData.amount" placeholder="請輸入數量">
          </div>
          <div class="form-group">
            <label>價格</label>
            <input type="number" v-model.number="formData.price" placeholder="請輸入價格">
          </div>
          <div class="form-group">
            <label>商店</label>
            <input v-model="formData.shop" placeholder="購買商店">
          </div>
          <div class="form-group">
            <label>到期日</label>
            <input type="date" v-model="formData.todate">
          </div>
          <div class="form-group full">
            <label>圖片連結</label>
            <input v-model="formData.photo" placeholder="https://...">
          </div>
          <div class="form-group full">
            <label>圖片雜湊</label>
            <input v-model="formData.photohash" placeholder="可空白">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">取消</button>
          <button class="btn primary" @click="saveFood">儲存</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Parse from '../services/parse';

const CSV_HEADERS = ['name', 'amount', 'todate', 'photo', 'price', 'shop', 'photohash'];

const foods = ref([]);
const foodFile = ref(null);
const searchTerm = ref('');
const showModal = ref(false);
const editingItem = ref(null);
const formData = reactive({
  name: '',
  amount: 0,
  price: 0,
  shop: '',
  todate: '',
  photo: '',
  photohash: ''
});

const filteredFoods = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase();
  if (!keyword) return foods.value;

  return foods.value.filter((item) => {
    const fields = [
      item.get('name'),
      item.get('shop'),
      item.get('photo'),
      item.get('photohash')
    ];

    return fields.some((value) => String(value || '').toLowerCase().includes(keyword));
  });
});

const formatDateInput = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split('T')[0];
};

const resetForm = () => {
  formData.name = '';
  formData.amount = 0;
  formData.price = 0;
  formData.shop = '';
  formData.todate = '';
  formData.photo = '';
  formData.photohash = '';
};

const openModal = (item = null) => {
  editingItem.value = item;
  if (item) {
    formData.name = item.get('name') || '';
    formData.amount = Number(item.get('amount') || 0);
    formData.price = Number(item.get('price') || 0);
    formData.shop = item.get('shop') || '';
    formData.todate = formatDateInput(item.get('todate'));
    formData.photo = item.get('photo') || '';
    formData.photohash = item.get('photohash') || '';
  } else {
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingItem.value = null;
};

const fetchData = async () => {
  try {
    const query = new Parse.Query('food');
    query.ascending('todate');
    query.limit(1000);
    foods.value = await query.find();
  } catch (error) {
    console.error('Error fetching foods:', error);
  }
};

const saveFood = async () => {
  try {
    const Food = Parse.Object.extend('food');
    const food = editingItem.value || new Food();

    food.set('name', formData.name.trim());
    food.set('amount', Number(formData.amount) || 0);
    food.set('price', Number(formData.price) || 0);
    food.set('shop', formData.shop.trim());
    if (formData.todate) {
      food.set('todate', new Date(`${formData.todate}T00:00:00`));
    } else if (editingItem.value) {
      food.unset('todate');
    }
    food.set('photo', formData.photo.trim());
    food.set('photohash', formData.photohash.trim());

    await food.save();
    closeModal();
    await fetchData();
  } catch (error) {
    console.error('Error saving food:', error);
    alert('儲存失敗：' + error.message);
  }
};

const deleteFood = async (item) => {
  if (!confirm('確定要刪除嗎？')) return;
  try {
    await item.destroy();
    await fetchData();
  } catch (error) {
    console.error('Error deleting food:', error);
    alert('刪除失敗：' + error.message);
  }
};

const escapeCSVValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const convertRowsToCSV = (rows) => {
  const lines = [CSV_HEADERS.join(',')];
  for (const row of rows) {
    lines.push(CSV_HEADERS.map((header) => escapeCSVValue(row[header])).join(','));
  }
  return `${lines.join('\r\n')}\r\n`;
};

const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(value);
      value = '';
      if (row.some((cell) => cell !== '')) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    value += char;
  }

  if (value !== '' || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell !== '')) {
      rows.push(row);
    }
  }

  return rows;
};

const normalizeImportedValue = (value) => String(value || '').trim();

const exportFoodCSV = async () => {
  try {
    const query = new Parse.Query('food');
    query.ascending('todate');
    query.limit(1000);
    const results = await query.find();

    const rows = results.map((item) => ({
      name: item.get('name') || '',
      amount: Number(item.get('amount') || 0),
      todate: item.get('todate') ? item.get('todate').toISOString() : '',
      photo: item.get('photo') || '',
      price: Number(item.get('price') || 0),
      shop: item.get('shop') || '',
      photohash: item.get('photohash') || ''
    }));

    const csv = convertRowsToCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'back4appfood.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting food CSV:', error);
    alert('匯出失敗：' + error.message);
  }
};

const handleFoodImport = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const csvText = await file.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) {
      throw new Error('CSV 內容為空，或沒有資料列。');
    }

    const headers = rows[0].map((value) => normalizeImportedValue(value).toLowerCase());
    const expectedHeaders = CSV_HEADERS.map((header) => header.toLowerCase());
    const headerMatches = expectedHeaders.every((header, index) => headers[index] === header);

    if (!headerMatches) {
      throw new Error(`CSV 欄位需為：${CSV_HEADERS.join(',')}`);
    }

    const Food = Parse.Object.extend('food');
    let count = 0;

    for (const row of rows.slice(1)) {
      if (!row.some((cell) => normalizeImportedValue(cell) !== '')) continue;

      const record = Object.fromEntries(
        CSV_HEADERS.map((header, index) => [header, row[index] ?? ''])
      );

      const food = new Food();
      food.set('name', normalizeImportedValue(record.name));
      food.set('amount', Number(record.amount) || 0);
      food.set('price', Number(record.price) || 0);
      food.set('photo', record.photo || '');
      food.set('shop', normalizeImportedValue(record.shop));
      food.set('photohash', normalizeImportedValue(record.photohash));

      const todate = normalizeImportedValue(record.todate);
      if (todate) {
        food.set('todate', new Date(todate));
      }

      await food.save();
      count += 1;
    }

    await fetchData();
    alert(`成功匯入 ${count} 筆食品資料！`);
  } catch (error) {
    console.error('Import food error:', error);
    alert('匯入失敗：' + error.message);
  } finally {
    event.target.value = '';
  }
};

const getDaysRemaining = (date) => {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '已過期';
  if (diffDays === 0) return '今天到期';
  return `剩 ${diffDays} 天`;
};

const isExpired = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

const isExpiringSoon = (date) => {
  if (!date) return false;
  const now = new Date();
  const target = new Date(date);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page {
  color: var(--color-text);
  display: grid;
  gap: 1rem;
}

.header {
  display: grid;
  grid-template-columns: auto 1fr auto;
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
  color: #04111f;
  box-shadow: 0 18px 36px rgba(47, 113, 255, 0.22);
}

.hidden-file {
  display: none;
}

.actions {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.actions .btn,
.toolbar .btn,
.ops .btn,
.modal-actions .btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(151, 191, 255, 0.12);
  color: var(--color-text-strong);
  padding: 0.82rem 1rem;
  border-radius: 999px;
  margin-left: 0;
}

.actions .primary {
  background: linear-gradient(135deg, rgba(72, 166, 255, 0.3), rgba(78, 255, 199, 0.18));
  border-color: rgba(120, 217, 255, 0.28);
}

.toolbar {
  display: flex;
  gap: 0.8rem;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(151, 191, 255, 0.1);
}

.search {
  flex: 1;
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  background: rgba(7, 12, 26, 0.72);
  color: var(--color-text-strong);
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: grid;
  grid-template-columns: 140px 1fr;
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}

.card:hover {
  border-color: rgba(120, 217, 255, 0.2);
}

.thumb.food {
  min-height: 100%;
  background:
    linear-gradient(135deg, rgba(79, 114, 204, 0.38), rgba(11, 16, 31, 0.12));
  background-size: cover;
  background-position: center;
}

.meta {
  padding: 1rem 1rem 1.1rem;
}

.name {
  font-weight: 700;
  color: var(--color-text-strong);
}

.info {
  font-size: 0.84rem;
  color: var(--color-text);
  margin: 0.55rem 0 0;
}

.ops {
  margin-top: 0.85rem;
  display: flex;
  gap: 0.7rem;
}

.ops .btn {
  padding: 0.72rem 0.95rem;
  font-size: 0.78rem;
}

.ops .btn.danger {
  background: rgba(255, 107, 129, 0.12);
  color: #ffd8dc;
  border-color: rgba(255, 124, 142, 0.22);
}

.shop-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  margin-bottom: 0.45rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
}

.details {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  margin-bottom: 0.45rem;
}

.hash {
  margin-bottom: 0.45rem;
  font-size: 0.76rem;
  color: var(--color-text-soft);
  word-break: break-all;
}

.expiry {
  font-size: 0.82rem;
  color: var(--color-text-strong);
}

.expiry.expired {
  color: var(--danger);
  font-weight: bold;
}

.expiry.warning {
  color: var(--warning);
  font-weight: bold;
}

.no-data {
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px dashed rgba(151, 191, 255, 0.22);
  color: var(--color-text-soft);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 8, 18, 0.64);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(14px);
}

.modal {
  background: linear-gradient(180deg, rgba(12, 19, 38, 0.96), rgba(6, 10, 22, 0.96));
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 680px;
  max-height: min(86vh, 44rem);
  overflow-y: auto;
  color: var(--color-text-strong);
  border: 1px solid rgba(151, 191, 255, 0.16);
  box-shadow: 0 34px 100px rgba(1, 6, 18, 0.55);
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 1.1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.55rem;
  font-size: 0.84rem;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.form-group input {
  width: 100%;
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  background: rgba(7, 12, 26, 0.82);
  color: var(--color-text-strong);
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.modal-actions .btn.primary {
  background: linear-gradient(135deg, rgba(72, 166, 255, 0.3), rgba(78, 255, 199, 0.18));
  border-color: rgba(120, 217, 255, 0.28);
}

@media (max-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .actions,
  .form-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .header {
    display: flex;
    flex-wrap: wrap;
    padding: 1rem;
  }

  .header h2 {
    flex: 1;
    margin-left: 8px;
  }

  .actions {
    width: 100%;
    display: flex;
    gap: 0.8rem;
  }

  .actions .btn {
    width: 100%;
  }

  .toolbar {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .page {
    gap: 0.85rem;
  }

  .header,
  .toolbar {
    padding: 0.95rem;
  }

  .card {
    grid-template-columns: 1fr;
  }

  .thumb.food {
    min-height: 11rem;
  }

  .meta {
    padding: 0.9rem 0.9rem 1rem;
  }

  .ops {
    width: 100%;
  }

  .ops .btn {
    flex: 1;
    text-align: center;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>
