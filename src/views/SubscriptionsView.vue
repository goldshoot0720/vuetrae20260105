<template>
  <section class="page">
    <div class="header">
      <div class="badge">🧾</div>
      <h2>訂閱管理系統</h2>
      <div class="actions">
        <input
          ref="subscriptionFile"
          type="file"
          accept=".csv,text/csv"
          class="hidden-file"
          @change="handleSubscriptionImport"
        >
        <button class="btn" @click="fetchData">重新載入</button>
        <button class="btn" @click="exportSubscriptionCSV">匯出 CSV</button>
        <button class="btn" @click="subscriptionFile?.click()">匯入 CSV</button>
        <button class="btn" @click="toggleSelectAll">{{ isAllSelected ? '取消全選' : '全選' }}</button>
        <button class="btn danger" :disabled="selectedSubscriptionIds.size === 0" @click="deleteSelectedSubscriptions">全選刪除</button>
        <button class="btn primary" @click="openModal(null)">新增訂閱</button>
      </div>
    </div>
    <div class="toolbar">
      <input
        v-model.trim="searchTerm"
        class="search"
        placeholder="搜尋名稱、網站、帳號、備註..."
      >
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="summary-pill">
      顯示筆數 {{ filteredSubscriptions.length }} / {{ subscriptions.length }}
    </div>
    <div class="list">
      <div class="item" v-for="item in filteredSubscriptions" :key="item.id">
        <label class="select-chip">
          <input
            type="checkbox"
            :checked="selectedSubscriptionIds.has(item.id)"
            @change="toggleSubscriptionSelection(item.id)"
          >
          <span>選取</span>
        </label>
        <div class="main-info">
          <div class="name">{{ item.get('name') || '未命名' }}</div>
          <div class="site-link" v-if="item.get('site')">
            <a :href="item.get('site')" target="_blank" rel="noopener">🌐 前往網站</a>
          </div>
        </div>
        <div class="meta">
          <div class="price">價格：{{ formatPrice(item) }}</div>
          <div class="date">下期：{{ formatDisplayDate(item.get('nextdate')) }}</div>
          <div class="info-line" v-if="item.get('account')">帳號：{{ item.get('account') }}</div>
          <div class="info-line" v-if="item.get('continue') !== undefined">
            續訂：{{ item.get('continue') ? '是' : '否' }}
          </div>
          <div class="note" v-if="item.get('note')">備註：{{ item.get('note') }}</div>
        </div>
        <div class="ops">
          <button class="btn" @click="openModal(item)">編輯</button>
          <button class="btn danger" @click="deleteSubscription(item)">刪除</button>
        </div>
      </div>
      <div v-if="filteredSubscriptions.length === 0" class="no-data">
        暫無資料或查無符合項目
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingItem ? '編輯訂閱' : '新增訂閱' }}</h3>
        <div class="form-grid">
          <div class="form-group full">
            <label>名稱</label>
            <input v-model="formData.name" placeholder="請輸入訂閱名稱">
          </div>
          <div class="form-group">
            <label>價格</label>
            <input type="number" v-model.number="formData.price" placeholder="請輸入價格">
          </div>
          <div class="form-group">
            <label>幣別</label>
            <input v-model="formData.currency" placeholder="TWD / USD / CNY">
          </div>
          <div class="form-group">
            <label>下期扣款日</label>
            <input type="date" v-model="formData.nextdate">
          </div>
          <div class="form-group">
            <label>帳號</label>
            <input v-model="formData.account" placeholder="帳號或識別">
          </div>
          <div class="form-group full">
            <label>網站連結</label>
            <input v-model="formData.site" placeholder="https://...">
          </div>
          <div class="form-group full">
            <label>備註</label>
            <textarea v-model="formData.note" rows="5" placeholder="備註事項"></textarea>
          </div>
          <label class="check-row full">
            <input type="checkbox" v-model="formData.continue">
            <span>是否持續續訂</span>
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">取消</button>
          <button class="btn primary" @click="saveSubscription">儲存</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Parse from '../services/parse';

const CSV_HEADERS = ['name', 'site', 'price', 'nextdate', 'note', 'account', 'currency', 'continue'];

const subscriptions = ref([]);
const showModal = ref(false);
const editingItem = ref(null);
const searchTerm = ref('');
const subscriptionFile = ref(null);
const selectedSubscriptionIds = ref(new Set());
const formData = reactive({
  name: '',
  price: 0,
  nextdate: '',
  site: '',
  note: '',
  account: '',
  currency: 'TWD',
  continue: true
});

const filteredSubscriptions = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase();
  if (!keyword) return subscriptions.value;

  return subscriptions.value.filter((item) => {
    const fields = [
      item.get('name'),
      item.get('site'),
      item.get('note'),
      item.get('account'),
      item.get('currency')
    ];

    return fields.some((value) => String(value || '').toLowerCase().includes(keyword));
  });
});

const isAllSelected = computed(() => (
  filteredSubscriptions.value.length > 0
  && filteredSubscriptions.value.every((item) => selectedSubscriptionIds.value.has(item.id))
));

const formatDateInput = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split('T')[0];
};

const formatDisplayDate = (value) => {
  if (!value) return '未設定';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '未設定';
  return date.toLocaleDateString();
};

const formatPrice = (item) => {
  const currency = item.get('currency') || 'TWD';
  const price = Number(item.get('price') || 0);
  return `${currency} ${price}`;
};

const resetForm = () => {
  formData.name = '';
  formData.price = 0;
  formData.nextdate = '';
  formData.site = '';
  formData.note = '';
  formData.account = '';
  formData.currency = 'TWD';
  formData.continue = true;
};

const openModal = (item = null) => {
  editingItem.value = item;
  if (item) {
    formData.name = item.get('name') || '';
    formData.price = Number(item.get('price') || 0);
    formData.nextdate = formatDateInput(item.get('nextdate'));
    formData.site = item.get('site') || '';
    formData.note = item.get('note') || '';
    formData.account = item.get('account') || '';
    formData.currency = item.get('currency') || 'TWD';
    formData.continue = Boolean(item.get('continue'));
  } else {
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingItem.value = null;
};

const toggleSubscriptionSelection = (id) => {
  const next = new Set(selectedSubscriptionIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedSubscriptionIds.value = next;
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const next = new Set(selectedSubscriptionIds.value);
    for (const item of filteredSubscriptions.value) {
      next.delete(item.id);
    }
    selectedSubscriptionIds.value = next;
    return;
  }

  const next = new Set(selectedSubscriptionIds.value);
  for (const item of filteredSubscriptions.value) {
    next.add(item.id);
  }
  selectedSubscriptionIds.value = next;
};

const saveSubscription = async () => {
  try {
    const Subscription = Parse.Object.extend('subscription');
    const subscription = editingItem.value || new Subscription();

    subscription.set('name', formData.name.trim());
    subscription.set('price', Number(formData.price) || 0);
    if (formData.nextdate) {
      subscription.set('nextdate', new Date(`${formData.nextdate}T00:00:00`));
    } else if (editingItem.value) {
      subscription.unset('nextdate');
    }
    subscription.set('site', formData.site.trim());
    subscription.set('note', formData.note);
    subscription.set('account', formData.account.trim());
    subscription.set('currency', (formData.currency || 'TWD').trim().toUpperCase());
    subscription.set('continue', Boolean(formData.continue));

    await subscription.save();
    closeModal();
    await fetchData();
  } catch (error) {
    console.error('Error saving subscription:', error);
    alert('儲存失敗：' + error.message);
  }
};

const deleteSubscription = async (item) => {
  if (!confirm('確定要刪除此訂閱嗎？')) return;

  try {
    await item.destroy();
    const next = new Set(selectedSubscriptionIds.value);
    next.delete(item.id);
    selectedSubscriptionIds.value = next;
    await fetchData();
  } catch (error) {
    console.error('Error deleting subscription:', error);
    alert('刪除失敗：' + error.message);
  }
};

const deleteSelectedSubscriptions = async () => {
  const selectedItems = filteredSubscriptions.value.filter((item) => selectedSubscriptionIds.value.has(item.id));
  if (selectedItems.length === 0) {
    alert('請先選取要刪除的訂閱。');
    return;
  }

  const confirmation = window.prompt(
    `將刪除 ${selectedItems.length} 筆訂閱資料。\n請輸入 DELETE subscription 確認刪除：`,
    ''
  );

  if (confirmation !== 'DELETE subscription') {
    alert('未輸入正確指令，已取消刪除。');
    return;
  }

  try {
    await Parse.Object.destroyAll(selectedItems);
    selectedSubscriptionIds.value = new Set();
    await fetchData();
    alert(`已刪除 ${selectedItems.length} 筆訂閱資料。`);
  } catch (error) {
    console.error('Error deleting selected subscriptions:', error);
    alert('批次刪除失敗：' + error.message);
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

const parseBoolean = (value) => String(value || '').trim().toLowerCase() === 'true';

const normalizeImportedValue = (value) => String(value || '').trim();

const exportSubscriptionCSV = async () => {
  try {
    const Subscription = Parse.Object.extend('subscription');
    const query = new Parse.Query(Subscription);
    query.ascending('nextdate');
    query.limit(1000);
    const results = await query.find();

    const rows = results.map((item) => ({
      name: item.get('name') || '',
      site: item.get('site') || '',
      price: Number(item.get('price') || 0),
      nextdate: formatDateInput(item.get('nextdate')),
      note: item.get('note') || '',
      account: item.get('account') || '',
      currency: item.get('currency') || 'TWD',
      continue: Boolean(item.get('continue'))
    }));

    const csv = convertRowsToCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'back4appsubscription.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting subscription CSV:', error);
    alert('匯出失敗：' + error.message);
  }
};

const handleSubscriptionImport = async (event) => {
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

    const Subscription = Parse.Object.extend('subscription');
    let count = 0;

    for (const row of rows.slice(1)) {
      if (!row.some((cell) => normalizeImportedValue(cell) !== '')) continue;

      const record = Object.fromEntries(
        CSV_HEADERS.map((header, index) => [header, row[index] ?? ''])
      );

      const subscription = new Subscription();
      subscription.set('name', normalizeImportedValue(record.name));
      subscription.set('site', normalizeImportedValue(record.site));
      subscription.set('price', Number(record.price) || 0);
      subscription.set('note', record.note || '');
      subscription.set('account', normalizeImportedValue(record.account));
      subscription.set('currency', normalizeImportedValue(record.currency || 'TWD').toUpperCase() || 'TWD');
      subscription.set('continue', parseBoolean(record.continue));

      const nextdate = normalizeImportedValue(record.nextdate);
      if (nextdate) {
        subscription.set('nextdate', new Date(`${nextdate}T00:00:00`));
      }

      await subscription.save();
      count += 1;
    }

    await fetchData();
    alert(`成功匯入 ${count} 筆訂閱資料！`);
  } catch (error) {
    console.error('Import subscription error:', error);
    alert('匯入失敗：' + error.message);
  } finally {
    event.target.value = '';
  }
};

const fetchData = async () => {
  try {
    const Subscription = Parse.Object.extend('subscription');
    const query = new Parse.Query(Subscription);
    query.ascending('nextdate');
    query.limit(1000);
    subscriptions.value = await query.find();
    selectedSubscriptionIds.value = new Set(
      [...selectedSubscriptionIds.value].filter((id) => subscriptions.value.some((item) => item.id === id))
    );
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  }
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
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  padding: 1.25rem 1.3rem;
  border-radius: var(--radius-xl);
  background: var(--panel-bg);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}

.header h2 {
  flex: 1;
  min-width: 150px;
  margin: 0;
  font-size: clamp(1.45rem, 1.15rem + 0.8vw, 2.2rem);
}

.actions {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(84, 228, 188, 1), rgba(36, 139, 114, 0.86));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #04111f;
  box-shadow: 0 18px 36px rgba(30, 122, 101, 0.22);
}

.hidden-file {
  display: none;
}

.select-chip {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(10, 15, 20, 0.88);
  border: 1px solid rgba(123, 161, 152, 0.16);
  color: var(--color-text-strong);
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
}

.select-chip input {
  width: 0.95rem;
  height: 0.95rem;
}

.actions .btn,
.toolbar .btn,
.ops .btn,
.modal-actions .btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(123, 161, 152, 0.14);
  color: var(--color-text-strong);
  padding: 0.82rem 1rem;
  border-radius: 999px;
  margin-left: 0;
}

.actions .primary {
  background: linear-gradient(135deg, rgba(36, 139, 114, 0.3), rgba(78, 128, 209, 0.16));
  border-color: rgba(84, 228, 188, 0.24);
}

.actions .danger,
.ops .danger {
  background: rgba(255, 107, 129, 0.12);
  color: #ffd8dc;
  border-color: rgba(255, 124, 142, 0.22);
}

.actions .btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.toolbar {
  display: flex;
  gap: 0.8rem;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(123, 161, 152, 0.12);
}

.search {
  flex: 1;
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(123, 161, 152, 0.14);
  background: rgba(10, 15, 20, 0.84);
  color: var(--color-text-strong);
}

.summary-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(10, 15, 20, 0.88);
  border: 1px solid rgba(123, 161, 152, 0.14);
  color: var(--color-text-strong);
  font-size: 0.84rem;
  width: fit-content;
}

.list {
  display: grid;
  gap: 1rem;
}

.item {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  padding: 1.2rem;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
  position: relative;
}

.item:hover {
  border-color: rgba(84, 228, 188, 0.2);
}

.main-info {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text-strong);
}

.site-link a {
  color: var(--accent-strong);
  text-decoration: none;
  font-size: 0.82rem;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.88rem;
  color: var(--color-text);
}

.info-line {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

.note {
  font-size: 0.76rem;
  color: var(--warning);
  white-space: pre-wrap;
}

.price {
  color: var(--color-text-strong);
  font-weight: 700;
}

.ops .btn {
  padding: 0.72rem 0.95rem;
}

.ops .danger {
  color: #ffd8dc;
  border-color: rgba(255, 124, 142, 0.22);
  background: rgba(255, 107, 129, 0.12);
}

.no-data {
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px dashed rgba(123, 161, 152, 0.24);
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
  max-height: min(86vh, 46rem);
  overflow-y: auto;
  color: var(--color-text-strong);
  border: 1px solid rgba(123, 161, 152, 0.16);
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

.form-group {
  margin-bottom: 0;
}

.form-group.full,
.check-row.full {
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

.form-group input,
.form-group textarea {
  width: 100%;
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(123, 161, 152, 0.14);
  background: rgba(10, 15, 20, 0.84);
  color: var(--color-text-strong);
  box-sizing: border-box;
  font: inherit;
}

.form-group textarea {
  min-height: 7rem;
  resize: vertical;
  white-space: pre-wrap;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0;
  color: var(--color-text-strong);
}

.check-row input {
  width: 1rem;
  height: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.modal-actions .btn.primary {
  background: linear-gradient(135deg, rgba(36, 139, 114, 0.3), rgba(78, 128, 209, 0.16));
  border-color: rgba(84, 228, 188, 0.24);
}

@media (max-width: 700px) {
  .item {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .ops {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
    gap: 0.6rem;
  }

  .header {
    padding: 1rem;
  }

  .modal {
    width: 95%;
    padding: 1.25rem;
  }

  .toolbar,
  .actions,
  .form-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .actions {
    width: 100%;
  }

  .actions .btn,
  .toolbar .btn,
  .modal-actions .btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .page {
    gap: 0.85rem;
  }

  .header,
  .toolbar,
  .item {
    padding: 0.95rem;
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
