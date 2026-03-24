<template>
  <section class="page">
    <div class="header">
      <div class="badge">🧾</div>
      <h2>訂閱管理系統</h2>
      <div class="actions">
        <button class="btn" @click="fetchData">重新載入</button>
        <button class="btn primary" @click="openModal(null)">新增訂閱</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="search" placeholder="搜尋訂閱名稱或網站..." />
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="list">
      <div class="item" v-for="item in subscriptions" :key="item.id">
        <div class="main-info">
          <div class="name">{{ item.get('name') || '未命名' }}</div>
          <div class="site-link" v-if="item.get('site')">
            <a :href="item.get('site')" target="_blank" rel="noopener">🌐 前往網站</a>
          </div>
        </div>
        <div class="meta">
          <div class="price">價格：${{ item.get('price') || 0 }}</div>
          <div class="date">下期：{{ item.get('nextdate') ? new Date(item.get('nextdate')).toLocaleDateString() : '未設定' }}</div>
          <div class="note" v-if="item.get('note')">備註：{{ item.get('note') }}</div>
        </div>
        <div class="ops">
          <button class="btn" @click="openModal(item)">編輯</button>
          <button class="btn danger" @click="deleteSubscription(item)">刪除</button>
        </div>
      </div>
      <div v-if="subscriptions.length === 0" class="no-data">
        暫無資料或載入中...
      </div>
    </div>

    <!-- 編輯/新增 Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingItem ? '編輯訂閱' : '新增訂閱' }}</h3>
        <div class="form-group">
          <label>名稱</label>
          <input v-model="formData.name" placeholder="請輸入訂閱名稱" />
        </div>
        <div class="form-group">
          <label>價格</label>
          <input type="number" v-model.number="formData.price" placeholder="請輸入價格" />
        </div>
        <div class="form-group">
          <label>下期扣款日</label>
          <input type="date" v-model="formData.nextdate" />
        </div>
        <div class="form-group">
          <label>網站連結</label>
          <input v-model="formData.site" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label>備註</label>
          <input v-model="formData.note" placeholder="備註事項" />
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
import { ref, onMounted, reactive } from 'vue';
import Parse from '../services/parse';

const subscriptions = ref([]);
const showModal = ref(false);
const editingItem = ref(null);
const formData = reactive({
  name: '',
  price: 0,
  nextdate: '',
  site: '',
  note: ''
});

const openModal = (item = null) => {
  editingItem.value = item;
  if (item) {
    formData.name = item.get('name');
    formData.price = item.get('price');
    // Format date for input[type="date"]
    const date = item.get('nextdate');
    formData.nextdate = date ? new Date(date).toISOString().split('T')[0] : '';
    formData.site = item.get('site');
    formData.note = item.get('note');
  } else {
    // Reset form
    formData.name = '';
    formData.price = 0;
    formData.nextdate = '';
    formData.site = '';
    formData.note = '';
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingItem.value = null;
};

const saveSubscription = async () => {
  try {
    const Subscriptions = Parse.Object.extend('subscription');
    let subscription;

    if (editingItem.value) {
      subscription = editingItem.value;
    } else {
      subscription = new Subscriptions();
    }

    subscription.set('name', formData.name);
    subscription.set('price', Number(formData.price));
    if (formData.nextdate) {
      subscription.set('nextdate', new Date(formData.nextdate));
    }
    subscription.set('site', formData.site);
    subscription.set('note', formData.note);

    await subscription.save();
    closeModal();
    fetchData(); // Refresh list
  } catch (error) {
    console.error('Error saving subscription:', error);
    alert('儲存失敗：' + error.message);
  }
};

const deleteSubscription = async (item) => {
  if (!confirm('確定要刪除此訂閱嗎？')) return;
  
  try {
    await item.destroy();
    fetchData(); // Refresh list
  } catch (error) {
    console.error('Error deleting subscription:', error);
    alert('刪除失敗：' + error.message);
  }
};

const fetchData = async () => {
  try {
    // 根據截圖，Class 名稱是小寫的 'subscription'
    const Subscriptions = Parse.Object.extend('subscription');
    const query = new Parse.Query(Subscriptions);
    query.ascending('nextdate');
    // 根據截圖欄位：name, nextdate, price, site, note
    subscriptions.value = await query.find();
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
}
.badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(101, 216, 255, 1), rgba(63, 103, 255, 0.82));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #04111f;
  box-shadow: 0 18px 36px rgba(47, 113, 255, 0.22);
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
}
.item:hover {
  border-color: rgba(120, 217, 255, 0.2);
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
.note {
  font-size: 0.76rem;
  color: var(--warning);
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
  max-width: 500px;
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
.form-group {
  margin-bottom: 1rem;
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
  .actions {
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
