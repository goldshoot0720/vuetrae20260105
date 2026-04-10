<template>
  <section class="page">
    <div class="header">
      <div class="badge">食</div>
      <h2>食品管理</h2>
      <div class="actions">
        <input
          ref="foodFile"
          type="file"
          accept=".csv,text/csv"
          class="hidden-file"
          @change="handleFoodImport"
        >
        <button class="btn" @click="fetchData">重新整理</button>
        <button class="btn" @click="toggleSelectAll">{{ isAllSelected ? '取消全選' : '全選' }}</button>
        <button class="btn danger" :disabled="selectedFoodIds.size === 0" @click="deleteSelectedFoods">
          全選刪除
        </button>
        <button class="btn" @click="exportFoodCSV">匯出 CSV</button>
        <button class="btn" @click="foodFile?.click()">匯入 CSV</button>
        <button class="btn primary" @click="openModal(null)">新增食品</button>
      </div>
    </div>

    <div class="toolbar">
      <input
        v-model.trim="searchTerm"
        class="search"
        placeholder="搜尋食品名稱、商店、圖片網址或雜湊..."
      >
      <div class="count-pill">筆數 {{ filteredFoods.length }} / {{ foods.length }}</div>
      <button class="btn">搜尋</button>
    </div>

    <div v-if="progress.active" class="progress-panel" :class="[`is-${progress.kind}`]">
      <div class="progress-copy">
        <strong>{{ progress.title }}</strong>
        <span>{{ progress.message }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: `${progress.percent}%` }"></div>
      </div>
      <div class="progress-meta">{{ progress.percent }}%</div>
    </div>

    <div class="cards">
      <div class="card" v-for="item in filteredFoods" :key="item.id">
        <label class="select-chip">
          <input
            type="checkbox"
            :checked="selectedFoodIds.has(item.id)"
            @change="toggleFoodSelection(item.id)"
          >
          <span>選取</span>
        </label>
        <div class="thumb food" :style="item.get('photo') ? { backgroundImage: `url(${item.get('photo')})` } : {}"></div>
        <div class="meta">
          <div class="name">{{ item.get('name') || '未命名食品' }}</div>
          <div class="info">
            <span v-if="item.get('shop')" class="shop-tag">店家 {{ item.get('shop') }}</span>
            <div class="details">
              <span>數量 {{ item.get('amount') || 0 }}</span>
              <span>價格 {{ Number(item.get('price') || 0).toLocaleString() }}</span>
            </div>
            <div v-if="item.get('photohash')" class="hash">雜湊 {{ item.get('photohash') }}</div>
            <div class="expiry" :class="{ expired: isExpired(item.get('todate')), warning: isExpiringSoon(item.get('todate')) }">
              到期 {{ item.get('todate') ? new Date(item.get('todate')).toLocaleDateString() : '未設定' }}
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
        目前沒有符合條件的食品資料。
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
            <label>店家</label>
            <input v-model="formData.shop" placeholder="請輸入店家">
          </div>
          <div class="form-group">
            <label>到期日</label>
            <input type="date" v-model="formData.todate">
          </div>
          <div class="form-group full">
            <label>圖片網址</label>
            <input v-model="formData.photo" placeholder="https://...">
          </div>
          <div class="form-group full">
            <label>圖片雜湊</label>
            <input v-model="formData.photohash" placeholder="可選填">
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
import { computed, onMounted, reactive, ref } from 'vue'
import Parse from '../services/parse'

const CSV_HEADERS = ['name', 'amount', 'todate', 'photo', 'price', 'shop', 'photohash']

const foods = ref([])
const foodFile = ref(null)
const searchTerm = ref('')
const selectedFoodIds = ref(new Set())
const showModal = ref(false)
const editingItem = ref(null)
const progress = reactive({
  active: false,
  kind: 'idle',
  title: '',
  message: '',
  percent: 0,
})
const formData = reactive({
  name: '',
  amount: 0,
  price: 0,
  shop: '',
  todate: '',
  photo: '',
  photohash: '',
})

const filteredFoods = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) return foods.value

  return foods.value.filter((item) => {
    const fields = [
      item.get('name'),
      item.get('shop'),
      item.get('photo'),
      item.get('photohash'),
    ]

    return fields.some((value) => String(value || '').toLowerCase().includes(keyword))
  })
})

const isAllSelected = computed(() => (
  filteredFoods.value.length > 0
  && filteredFoods.value.every((item) => selectedFoodIds.value.has(item.id))
))

const formatDateInput = (value) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60000)
  return localDate.toISOString().split('T')[0]
}

const startProgress = (kind, title, message) => {
  progress.active = true
  progress.kind = kind
  progress.title = title
  progress.message = message
  progress.percent = 0
}

const updateProgress = (percent, message) => {
  progress.percent = Math.max(0, Math.min(100, Math.round(percent)))
  progress.message = message
}

const finishProgress = (message) => {
  progress.percent = 100
  progress.message = message
  window.setTimeout(() => {
    progress.active = false
  }, 1200)
}

const failProgress = (message, error) => {
  progress.kind = 'error'
  progress.message = message
  console.error(message, error)
}

const resetForm = () => {
  formData.name = ''
  formData.amount = 0
  formData.price = 0
  formData.shop = ''
  formData.todate = ''
  formData.photo = ''
  formData.photohash = ''
}

const openModal = (item = null) => {
  editingItem.value = item
  if (item) {
    formData.name = item.get('name') || ''
    formData.amount = Number(item.get('amount') || 0)
    formData.price = Number(item.get('price') || 0)
    formData.shop = item.get('shop') || ''
    formData.todate = formatDateInput(item.get('todate'))
    formData.photo = item.get('photo') || ''
    formData.photohash = item.get('photohash') || ''
  } else {
    resetForm()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
}

const toggleFoodSelection = (id) => {
  const next = new Set(selectedFoodIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedFoodIds.value = next
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const next = new Set(selectedFoodIds.value)
    for (const item of filteredFoods.value) {
      next.delete(item.id)
    }
    selectedFoodIds.value = next
    return
  }

  const next = new Set(selectedFoodIds.value)
  for (const item of filteredFoods.value) {
    next.add(item.id)
  }
  selectedFoodIds.value = next
}

const fetchData = async () => {
  try {
    const query = new Parse.Query('food')
    query.ascending('todate')
    query.limit(1000)
    foods.value = await query.find()
  } catch (error) {
    console.error('Error fetching foods:', error)
  }
}

const saveFood = async () => {
  try {
    const Food = Parse.Object.extend('food')
    const food = editingItem.value || new Food()

    food.set('name', formData.name.trim())
    food.set('amount', Number(formData.amount) || 0)
    food.set('price', Number(formData.price) || 0)
    food.set('shop', formData.shop.trim())
    if (formData.todate) {
      food.set('todate', new Date(`${formData.todate}T00:00:00`))
    } else if (editingItem.value) {
      food.unset('todate')
    }
    food.set('photo', formData.photo.trim())
    food.set('photohash', formData.photohash.trim())

    await food.save()
    closeModal()
    await fetchData()
  } catch (error) {
    console.error('Error saving food:', error)
    alert('儲存失敗：' + error.message)
  }
}

const deleteFood = async (item) => {
  if (!confirm('確定要刪除這筆食品資料嗎？')) return
  try {
    await item.destroy()
    const next = new Set(selectedFoodIds.value)
    next.delete(item.id)
    selectedFoodIds.value = next
    await fetchData()
  } catch (error) {
    console.error('Error deleting food:', error)
    alert('刪除失敗：' + error.message)
  }
}

const deleteSelectedFoods = async () => {
  const selectedItems = filteredFoods.value.filter((item) => selectedFoodIds.value.has(item.id))
  if (selectedItems.length === 0) {
    alert('請先選擇要刪除的食品資料。')
    return
  }

  const confirmation = window.prompt(
    `即將刪除 ${selectedItems.length} 筆食品資料。\n請輸入 DELETE food 以確認刪除。`,
    '',
  )

  if (confirmation !== 'DELETE food') {
    alert('驗證文字不正確，已取消刪除。')
    return
  }

  try {
    await Parse.Object.destroyAll(selectedItems)
    selectedFoodIds.value = new Set()
    await fetchData()
    alert(`已刪除 ${selectedItems.length} 筆食品資料。`)
  } catch (error) {
    console.error('Error deleting selected foods:', error)
    alert('批次刪除失敗：' + error.message)
  }
}

const escapeCSVValue = (value) => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

const convertRowsToCSV = (rows) => {
  const lines = [CSV_HEADERS.join(',')]
  for (const row of rows) {
    lines.push(CSV_HEADERS.map((header) => escapeCSVValue(row[header])).join(','))
  }
  return `${lines.join('\r\n')}\r\n`
}

const parseCSV = (text) => {
  const rows = []
  let row = []
  let value = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(value)
      value = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1
      }
      row.push(value)
      value = ''
      if (row.some((cell) => cell !== '')) {
        rows.push(row)
      }
      row = []
      continue
    }

    value += char
  }

  if (value !== '' || row.length > 0) {
    row.push(value)
    if (row.some((cell) => cell !== '')) {
      rows.push(row)
    }
  }

  return rows
}

const normalizeImportedValue = (value) => String(value || '').trim()

const exportFoodCSV = async () => {
  try {
    startProgress('export', '匯出食品 CSV', '正在整理資料...')
    const query = new Parse.Query('food')
    query.ascending('todate')
    query.limit(1000)
    const results = await query.find()
    updateProgress(30, `已讀取 ${results.length} 筆食品資料...`)

    const rows = results.map((item) => ({
      name: item.get('name') || '',
      amount: Number(item.get('amount') || 0),
      todate: item.get('todate') ? item.get('todate').toISOString() : '',
      photo: item.get('photo') || '',
      price: Number(item.get('price') || 0),
      shop: item.get('shop') || '',
      photohash: item.get('photohash') || '',
    }))

    updateProgress(70, '正在產生 CSV...')
    const csv = convertRowsToCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'back4appfood.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    finishProgress(`匯出完成，共 ${rows.length} 筆。`)
  } catch (error) {
    failProgress('匯出失敗。', error)
    alert('匯出失敗：' + error.message)
  }
}

const handleFoodImport = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    startProgress('import', '匯入食品 CSV', `正在讀取 ${file.name}...`)
    const csvText = await file.text()
    updateProgress(10, '正在解析 CSV...')
    const rows = parseCSV(csvText)
    if (rows.length < 2) {
      throw new Error('CSV 內容不足，無法匯入。')
    }

    const headers = rows[0].map((value) => normalizeImportedValue(value).toLowerCase())
    const expectedHeaders = CSV_HEADERS.map((header) => header.toLowerCase())
    const headerMatches = expectedHeaders.every((header, index) => headers[index] === header)

    if (!headerMatches) {
      throw new Error(`CSV 欄位需為：${CSV_HEADERS.join(', ')}`)
    }

    const Food = Parse.Object.extend('food')
    let count = 0
    const total = rows.length - 1
    updateProgress(15, `準備匯入 ${total} 筆資料...`)

    for (const row of rows.slice(1)) {
      if (!row.some((cell) => normalizeImportedValue(cell) !== '')) continue

      const record = Object.fromEntries(
        CSV_HEADERS.map((header, index) => [header, row[index] ?? '']),
      )

      const food = new Food()
      food.set('name', normalizeImportedValue(record.name))
      food.set('amount', Number(record.amount) || 0)
      food.set('price', Number(record.price) || 0)
      food.set('photo', record.photo || '')
      food.set('shop', normalizeImportedValue(record.shop))
      food.set('photohash', normalizeImportedValue(record.photohash))

      const todate = normalizeImportedValue(record.todate)
      if (todate) {
        food.set('todate', new Date(todate))
      }

      await food.save()
      count += 1
      updateProgress(15 + (count / Math.max(total, 1)) * 80, `已完成 ${count} / ${total} 筆...`)
    }

    await fetchData()
    finishProgress(`匯入完成，共 ${count} 筆。`)
    alert(`已匯入 ${count} 筆食品資料。`)
  } catch (error) {
    failProgress('匯入失敗。', error)
    alert('匯入失敗：' + error.message)
  } finally {
    event.target.value = ''
  }
}

const getDaysRemaining = (date) => {
  if (!date) return ''
  const now = new Date()
  const target = new Date(date)
  const diffTime = target - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '已過期'
  if (diffDays === 0) return '今天到期'
  return `剩 ${diffDays} 天`
}

const isExpired = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}

const isExpiringSoon = (date) => {
  if (!date) return false
  const now = new Date()
  const target = new Date(date)
  const diffTime = target - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= 7
}

onMounted(() => {
  fetchData()
})
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
  background: linear-gradient(145deg, rgba(84, 228, 188, 1), rgba(36, 139, 114, 0.86));
  display: flex;
  align-items: center;
  justify-content: center;
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
  border: 1px solid rgba(123, 161, 152, 0.14);
  color: var(--color-text-strong);
  padding: 0.82rem 1rem;
  border-radius: 999px;
  margin-left: 0;
}

.actions .primary,
.modal-actions .btn.primary {
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
  align-items: center;
  flex-wrap: wrap;
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

.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(123, 161, 152, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-strong);
  white-space: nowrap;
}

.progress-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 18rem) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.1rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(123, 161, 152, 0.18);
  background: rgba(255, 255, 255, 0.04);
}

.progress-panel.is-error {
  border-color: rgba(255, 124, 142, 0.28);
}

.progress-copy {
  display: grid;
  gap: 0.2rem;
}

.progress-copy strong {
  color: var(--color-text-strong);
}

.progress-copy span,
.progress-meta {
  font-size: 0.84rem;
  color: var(--color-text-soft);
}

.progress-track {
  height: 0.55rem;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(36, 139, 114, 0.9), rgba(78, 128, 209, 0.86));
  transition: width 0.25s ease;
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
  position: relative;
}

.card:hover {
  border-color: rgba(84, 228, 188, 0.2);
}

.thumb.food {
  min-height: 100%;
  background:
    linear-gradient(135deg, rgba(40, 93, 124, 0.28), rgba(19, 34, 31, 0.18));
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

.shop-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  margin-bottom: 0.45rem;
  border: 1px solid rgba(123, 161, 152, 0.12);
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
  max-height: min(86vh, 44rem);
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
  border: 1px solid rgba(123, 161, 152, 0.14);
  background: rgba(10, 15, 20, 0.84);
  color: var(--color-text-strong);
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.4rem;
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

  .progress-panel {
    grid-template-columns: 1fr;
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
    align-items: stretch;
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
