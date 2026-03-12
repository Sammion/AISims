<template>
  <div class="game-container">
    <div class="game-header">
      <div class="header-left">
        <h2>{{ character.name }} 的人生</h2>
        <div class="age-info">
          <span class="age">{{ currentAge }} 岁</span>
          <span class="year">({{ 1995 + currentAge - 15 }}年)</span>
          <span class="phase">{{ phaseName }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="danger" size="small" @click="confirmExit">
          返回主菜单
        </el-button>
        <el-button type="warning" size="small" @click="showSaveDialog = true">
          存档
        </el-button>
        <el-button type="info" size="small" @click="showLoadDialog = true">
          读档
        </el-button>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">知识</span>
        <el-progress :percentage="stats.knowledge" :show-text="false" color="#409eff" />
        <span class="stat-value">{{ stats.knowledge }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">社交</span>
        <el-progress :percentage="stats.social" :show-text="false" color="#67c23a" />
        <span class="stat-value">{{ stats.social }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">健康</span>
        <el-progress :percentage="stats.health" :show-text="false" color="#e6a23c" />
        <span class="stat-value">{{ stats.health }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">声望</span>
        <el-progress :percentage="stats.reputation" :show-text="false" color="#909399" />
        <span class="stat-value">{{ stats.reputation }}</span>
      </div>
      <div class="stat-item wealth">
        <span class="stat-label">现金</span>
        <span class="stat-value">¥{{ formatWealth(stats.cash) }}</span>
      </div>
      <div class="stat-item wealth">
        <span class="stat-label">房产</span>
        <span class="stat-value">¥{{ formatWealth(stats.property) }}</span>
      </div>
      <div class="stat-item wealth">
        <span class="stat-label">投资</span>
        <span class="stat-value">¥{{ formatWealth(stats.investment) }}</span>
      </div>
    </div>

    <div class="event-card" v-if="currentEvent">
      <div class="event-image" :style="{ backgroundImage: `url(${getEventImage(currentEvent.id)})` }"></div>
      <div class="event-header">
        <h3>{{ currentEvent.title }}</h3>
      </div>
      <div class="event-content">
        <p>{{ currentEvent.description }}</p>
      </div>
      <div class="event-choices">
        <el-button 
          v-for="(choice, index) in currentEvent.choices" 
          :key="index"
          type="primary"
          @click="makeChoice(choice)"
          class="choice-btn"
        >
          {{ choice.text }}
        </el-button>
      </div>
    </div>

    <div class="consequence-card" v-if="showConsequence">
      <div class="consequence-content">
        <p>{{ consequenceText }}</p>
        <div class="stat-changes" v-if="statChanges">
          <span 
            v-for="(value, key) in statChanges" 
            :key="key" 
            class="change-item"
            :class="{ positive: value > 0, negative: value < 0 }"
          >
            {{ statNames[key] }} {{ value > 0 ? '+' : '' }}{{ key === 'wealth' ? formatWealth(value) : value }}
          </span>
        </div>
      </div>
      <el-button type="primary" @click="nextEvent">继续</el-button>
    </div>

    <!-- 人生阶段切换庆祝画面 -->
    <div class="phase-celebration" v-if="showPhaseCelebration">
      <div class="celebration-content">
        <div class="celebration-title">🎉 恭喜进入新的人生阶段！</div>
        <div class="phase-name">{{ phaseCelebrationData.name }}</div>
        <div class="phase-description">{{ phaseCelebrationData.description }}</div>
        <div class="phase-tips">{{ phaseCelebrationData.tips }}</div>
        <el-button type="primary" size="large" @click="closePhaseCelebration">
          开启新篇章
        </el-button>
      </div>
    </div>

    <el-dialog title="保存游戏" v-model="showSaveDialog" width="400px">
      <el-form :model="saveData">
        <el-form-item label="存档名称">
          <el-input v-model="saveData.name" placeholder="请输入存档名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSaveDialog = false">取消</el-button>
        <el-button type="primary" @click="saveGame">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="读取游戏" v-model="showLoadDialog" width="500px">
      <el-table :data="saveList" style="width: 100%">
        <el-table-column prop="name" label="存档名称" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="date" label="保存时间" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="loadGame(scope.row)">读取</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="showLoadDialog = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import { events, randomEvents } from '@/data/events'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const gameStore = useGameStore()

const character = computed(() => gameStore.character)
const currentAge = computed(() => gameStore.currentAge)
const currentPhase = computed(() => gameStore.currentPhase)
const stats = computed(() => gameStore.stats)

const currentEvent = ref(null)
const showConsequence = ref(false)
const consequenceText = ref('')
const statChanges = ref(null)
const showSaveDialog = ref(false)
const showLoadDialog = ref(false)
const saveData = ref({ name: '' })
const saveList = ref([])
const showPhaseCelebration = ref(false)
const phaseCelebrationData = ref({})
const previousPhase = ref(null)

const statNames = {
  knowledge: '知识',
  social: '社交',
  health: '健康',
  reputation: '声望',
  wealth: '财富'
}

const phaseConfig = {
  middle_school: {
    name: '中学时期',
    description: '青涩的少年时光，充满了无限可能',
    tips: '努力学习，为未来打下坚实基础'
  },
  university: {
    name: '大学时期',
    description: '人生最美好的青春年华，自由而充满活力',
    tips: '兼顾学习和社交，积累人脉和经验'
  },
  early_career: {
    name: '职场初期',
    description: '正式步入社会，开启职业生涯',
    tips: '脚踏实地，虚心学习，快速成长'
  },
  career_growth: {
    name: '职业上升期',
    description: '事业稳步上升，能力和地位不断提升',
    tips: '抓住机遇，勇于挑战，实现自我价值'
  },
  peak_career: {
    name: '事业巅峰期',
    description: '达到人生事业的顶峰，影响力不断扩大',
    tips: '把握行业趋势，做出正确的战略选择'
  },
  late_career: {
    name: '职业生涯后期',
    description: '经验丰富，德高望重',
    tips: '培养接班人，规划退休生活'
  },
  retirement: {
    name: '退休生活',
    description: '辛苦了一辈子，终于可以安享晚年',
    tips: '享受生活，做自己想做的事情'
  }
}

const phaseName = computed(() => {
  const phaseMap = {
    middle_school: '中学时期',
    university: '大学时期',
    early_career: '职场初期',
    career_growth: '职业上升期',
    peak_career: '事业巅峰期',
    late_career: '职业生涯后期',
    retirement: '退休'
  }
  return phaseMap[currentPhase.value] || ''
})

// 事件背景图映射
const eventImageMap = {
  // 中学时期
  ms_001: 'https://picsum.photos/seed/ms001/800/300',
  ms_002: 'https://picsum.photos/seed/ms002/800/300',
  ms_003: 'https://picsum.photos/seed/ms003/800/300',
  // 大学时期
  uni_001: 'https://picsum.photos/seed/uni001/800/300',
  uni_002: 'https://picsum.photos/seed/uni002/800/300',
  uni_003: 'https://picsum.photos/seed/uni003/800/300',
  uni_004: 'https://picsum.photos/seed/uni004/800/300',
  uni_005: 'https://picsum.photos/seed/uni005/800/300',
  uni_006: 'https://picsum.photos/seed/uni006/800/300',
  uni_007: 'https://picsum.photos/seed/uni007/800/300',
  uni_008: 'https://picsum.photos/seed/uni008/800/300',
  // 职场初期
  ec_001: 'https://picsum.photos/seed/ec001/800/300',
  ec_002: 'https://picsum.photos/seed/ec002/800/300',
  // 职业上升期
  cg_001: 'https://picsum.photos/seed/cg001/800/300',
  cg_002: 'https://picsum.photos/seed/cg002/800/300',
  // 事业巅峰期
  pc_001: 'https://picsum.photos/seed/pc001/800/300',
  pc_002: 'https://picsum.photos/seed/pc002/800/300',
  pc_003: 'https://picsum.photos/seed/pc003/800/300',
  pc_004: 'https://picsum.photos/seed/pc004/800/300',
  pc_005: 'https://picsum.photos/seed/pc005/800/300',
  // 职业生涯后期
  lc_001: 'https://picsum.photos/seed/lc001/800/300',
  lc_002: 'https://picsum.photos/seed/lc002/800/300',
  lc_003: 'https://picsum.photos/seed/lc003/800/300',
  lc_004: 'https://picsum.photos/seed/lc004/800/300',
  lc_005: 'https://picsum.photos/seed/lc005/800/300',
  // 随机事件
  rand_001: 'https://picsum.photos/seed/rand001/800/300',
  rand_002: 'https://picsum.photos/seed/rand002/800/300',
  rand_003: 'https://picsum.photos/seed/rand003/800/300',
  rand_004: 'https://picsum.photos/seed/rand004/800/300'
}

const getEventImage = (eventId) => {
  return eventImageMap[eventId] || 'https://picsum.photos/seed/default/800/300'
}

onMounted(() => {
  if (!character.value) {
    router.push('/')
    return
  }
  previousPhase.value = currentPhase.value
  generateEvent()
  loadSaveList()
})

watch(() => gameStore.gameOver, (newVal) => {
  if (newVal) {
    router.push('/ending')
  }
})

const generateEvent = () => {
  const phaseEvents = events[currentPhase.value] || []
  
  // 70%概率触发阶段事件，30%概率触发随机事件
  if (Math.random() < 0.7 && phaseEvents.length > 0) {
    const randomIndex = Math.floor(Math.random() * phaseEvents.length)
    currentEvent.value = phaseEvents[randomIndex]
  } else {
    const randomIndex = Math.floor(Math.random() * randomEvents.length)
    currentEvent.value = randomEvents[randomIndex]
  }
}

const makeChoice = (choice) => {
  let consequences = choice.consequences || currentEvent.value.consequences
  
  // 如果是函数则执行，传入角色属性
  if (typeof consequences === 'function') {
    consequences = consequences({
      appearance: character.value.appearance,
      gender: character.value.gender,
      fatherTrait: character.value.fatherTrait,
      motherTrait: character.value.motherTrait,
      ...stats.value
    })
  }

  // 应用后果
  const changes = {}
  Object.keys(consequences).forEach(key => {
    if (key === 'description') return
    let value = consequences[key]
    // 如果是函数则执行获取动态值
    if (typeof value === 'function') {
      value = value()
    }
    if (key === 'wealth') {
      gameStore.addWealth(value)
    } else if (stats.value[key] !== undefined) {
      gameStore.updateStats({ [key]: value })
    }
    changes[key] = value
  })

  // 记录历史
  gameStore.addHistory(currentEvent.value.title, choice.text, consequences)

  // 显示后果
  consequenceText.value = consequences.description || '你做出了选择'
  statChanges.value = changes
  showConsequence.value = true
  currentEvent.value = null
}

const nextEvent = () => {
  showConsequence.value = false
  statChanges.value = null
  const oldPhase = currentPhase.value
  gameStore.nextYear()
  const newPhase = currentPhase.value
  
  // 检测阶段切换
  if (!gameStore.gameOver && oldPhase !== newPhase) {
    phaseCelebrationData.value = phaseConfig[newPhase]
    showPhaseCelebration.value = true
  } else if (!gameStore.gameOver) {
    generateEvent()
  }
}

const closePhaseCelebration = () => {
  showPhaseCelebration.value = false
  previousPhase.value = currentPhase.value
  generateEvent()
}

const formatWealth = (amount) => {
  const absAmount = Math.abs(amount)
  const sign = amount >= 0 ? '' : '-'
  if (absAmount >= 100000000) {
    return sign + (absAmount / 100000000).toFixed(1) + '亿'
  } else if (absAmount >= 10000) {
    return sign + (absAmount / 10000).toFixed(1) + '万'
  }
  return sign + absAmount.toLocaleString()
}

const confirmExit = () => {
  ElMessageBox.confirm(
    '确定要返回主菜单吗？当前未保存的进度将会丢失。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    gameStore.reset()
    router.push('/')
  }).catch(() => {
    // 取消操作
  })
}

const saveGame = () => {
  const save = {
    id: Date.now(),
    name: saveData.value.name || `存档-${Date.now()}`,
    age: currentAge.value,
    phase: currentPhase.value,
    character: { ...character.value },
    stats: { ...stats.value },
    history: [...gameStore.history],
    date: new Date().toLocaleString('zh-CN')
  }

  const saves = JSON.parse(localStorage.getItem('gameSaves') || '[]')
  
  // 限制最多保存10个存档，超过则删除最早的
  if (saves.length >= 10) {
    saves.shift()
    ElMessage.warning('存档数量已达上限，已删除最早的存档')
  }
  
  saves.push(save)
  
  try {
    localStorage.setItem('gameSaves', JSON.stringify(saves))
    showSaveDialog.value = false
    saveData.value.name = ''
    loadSaveList()
    ElMessage.success('游戏已保存')
  } catch (e) {
    ElMessage.error('保存失败：存储空间不足，请删除部分旧存档后重试')
  }
}

const loadSaveList = () => {
  saveList.value = JSON.parse(localStorage.getItem('gameSaves') || '[]')
}

const loadGame = (save) => {
  // 直接加载所有状态，避免initCharacter重置财富
  gameStore.character = save.character
  gameStore.currentAge = save.age
  gameStore.currentPhase = save.phase
  gameStore.stats = { ...save.stats }
  gameStore.history = [...save.history]
  gameStore.gameOver = false
  gameStore.ending = null
  
  showLoadDialog.value = false
  generateEvent()
  
  ElMessage.success('游戏已加载')
}
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

/* 人生阶段庆祝画面 */
.phase-celebration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.5s ease-in-out;
}

.celebration-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 80px;
  border-radius: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: bounceIn 0.8s ease-out;
}

.celebration-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.phase-name {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.phase-description {
  font-size: 20px;
  margin-bottom: 15px;
  opacity: 0.95;
}

.phase-tips {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.game-header {
  background: white;
  border-radius: 15px;
  padding: 20px 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.age-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
  color: #666;
}

.age {
  font-weight: bold;
  color: #409eff;
}

.year {
  color: #67c23a;
  font-weight: 500;
  background: rgba(103, 194, 58, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.stats-bar {
  background: white;
  border-radius: 15px;
  padding: 20px 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: right;
}

.wealth .stat-value {
  color: #67c23a;
  font-size: 18px;
}

.event-card {
  background: white;
  border-radius: 15px;
  padding: 0 0 30px 0;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}

.event-header h3 {
  margin: 0 30px 20px 30px;
  color: #333;
  font-size: 24px;
}

.event-content {
  margin: 0 30px 30px 30px;
}

.event-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin: 0;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 30px;
}

.choice-btn {
  text-align: left;
  padding: 15px 20px;
  height: auto;
  white-space: normal;
  font-size: 15px;
}

.consequence-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.consequence-content {
  margin-bottom: 30px;
}

.consequence-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

.stat-changes {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.change-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: #f0f9ff;
  color: #409eff;
}

.change-item.positive {
  background: #f0f9ff;
  color: #67c23a;
}

.change-item.negative {
  background: #fef0f0;
  color: #f56c6c;
}
</style>
