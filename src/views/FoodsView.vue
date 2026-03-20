<template>
  <section class="page">
    <div class="header">
      <div class="badge">🍎</div>
      <h2>食品管理系統</h2>
      <div class="actions">
        <button class="btn" @click="fetchData">重新載入</button>
        <button class="btn primary" @click="openModal(null)">新增食品</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="search" placeholder="搜尋食品名稱或商店..." />
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="cards">
      <div class="card" v-for="item in foods" :key="item.id">
        <div class="thumb food" :style="item.get('photo') ? { backgroundImage: `url(${item.get('photo')})` } : {}"></div>
        <div class="meta">
          <div class="name">{{ item.get('name') || '未命名' }}</div>
          <div class="info">
            <span v-if="item.get('shop')" class="shop-tag">🏠 {{ item.get('shop') }}</span>
            <div class="details">
              <span>數量：{{ item.get('amount') || 0 }}</span>
              <span>價格：${{ (item.get('price') || 0).toLocaleString() }}</span>
            </div>
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
      <div v-if="foods.length === 0" class="no-data">
        暫無資料或載入中...
      </div>
    </div>

    <!-- 編輯/新增 Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingItem ? '編輯食品' : '新增食品' }}</h3>
        <div class="form-group">
          <label>名稱</label>
          <input v-model="formData.name" placeholder="請輸入食品名稱" />
        </div>
        <div class="form-group">
          <label>數量</label>
          <input type="number" v-model.number="formData.amount" placeholder="請輸入數量" />
        </div>
        <div class="form-group">
          <label>價格</label>
          <input type="number" v-model.number="formData.price" placeholder="請輸入價格" />
        </div>
        <div class="form-group">
          <label>商店</label>
          <input v-model="formData.shop" placeholder="購買商店" />
        </div>
        <div class="form-group">
          <label>到期日</label>
          <input type="date" v-model="formData.todate" />
        </div>
        <div class="form-group">
          <label>圖片連結</label>
          <input v-model="formData.photo" placeholder="https://..." />
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
import { ref, onMounted, reactive } from 'vue';
import Parse from '../services/parse';

const foods = ref([]);
const showModal = ref(false);
const editingItem = ref(null);
const formData = reactive({
  name: '',
  amount: 0,
  price: 0,
  shop: '',
  todate: '',
  photo: ''
});

const openModal = (item = null) => {
  editingItem.value = item;
  if (item) {
    formData.name = item.get('name');
    formData.amount = item.get('amount');
    formData.price = item.get('price');
    formData.shop = item.get('shop');
    formData.todate = item.get('todate') ? item.get('todate').toISOString().substr(0, 10) : '';
    formData.photo = item.get('photo');
  } else {
    Object.assign(formData, {
      name: '',
      amount: 0,
      price: 0,
      shop: '',
      todate: '',
      photo: ''
    });
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
    query.descending('todate');
    foods.value = await query.find();
  } catch (error) {
    console.error('Error fetching foods:', error);
  }
};

const saveFood = async () => {
  try {
    let food;
    if (editingItem.value) {
      food = editingItem.value;
    } else {
      const Food = Parse.Object.extend('food');
      food = new Food();
    }
    
    food.set('name', formData.name);
    food.set('amount', formData.amount);
    food.set('price', formData.price);
    food.set('shop', formData.shop);
    if (formData.todate) {
      food.set('todate', new Date(formData.todate));
    }
    food.set('photo', formData.photo);
    
    await food.save();
    closeModal();
    fetchData();
  } catch (error) {
    console.error('Error saving food:', error);
    alert('儲存失敗：' + error.message);
  }
};

const deleteFood = async (item) => {
  if (!confirm('確定要刪除嗎？')) return;
  try {
    await item.destroy();
    fetchData();
  } catch (error) {
    console.error('Error deleting food:', error);
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
.actions {
  display: flex;
  gap: 0.7rem;
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
  background: rgba(255,255,255,0.06);
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
  max-width: 500px;
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

@media (max-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
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
    flex: 1;
  }
  .toolbar {
    flex-direction: column;
  }
}
</style>
