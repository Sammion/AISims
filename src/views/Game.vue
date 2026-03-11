<template>
  <div class="game-container">
    <div class="game-header">
      <div class="header-left">
        <h2>{{ character.name }} 的人生</h2>
        <div class="age-info">
          <span class="age">{{ currentAge }} 岁</span>
          <span class="phase">{{ phaseName }}</span>
        </div>
      </div>
      <div class="header-right">
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
        <span class="stat-label">财富</span>
        <span class="stat-value">¥{{ formatWealth(stats.wealth) }}</span>
      </div>
    </div>

    <div class="event-card" v-if="currentEvent">
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
          <span v-for="(value, key) in statChanges" :key="key" class="change-item">
            {{ statNames[key] }} {{ value > 0 ? '+' : '' }}{{ value }}
          </span>
        </div>
      </div>
      <el-button type="primary" @click="nextEvent">继续</el-button>
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
import { ElMessage } from 'element-plus'

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

const statNames = {
  knowledge: '知识',
  social: '社交',
  health: '健康',
  reputation: '声望',
  wealth: '财富'
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

onMounted(() => {
  if (!character.value) {
    router.push('/')
    return
  }
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
  const consequences = choice.consequences || currentEvent.value.consequences
  
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
  gameStore.nextYear()
  
  if (!gameStore.gameOver) {
    generateEvent()
  }
}

const formatWealth = (amount) => {
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(1) + '亿'
  } else if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toLocaleString()
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
  saves.push(save)
  localStorage.setItem('gameSaves', JSON.stringify(saves))
  
  showSaveDialog.value = false
  saveData.value.name = ''
  loadSaveList()
  
  ElMessage.success('游戏已保存')
}

const loadSaveList = () => {
  saveList.value = JSON.parse(localStorage.getItem('gameSaves') || '[]')
}

const loadGame = (save) => {
  gameStore.initCharacter(save.character)
  gameStore.currentAge = save.age
  gameStore.currentPhase = save.phase
  gameStore.stats = { ...save.stats }
  gameStore.history = [...save.history]
  
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
  gap: 20px;
  font-size: 16px;
  color: #666;
}

.age {
  font-weight: bold;
  color: #409eff;
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
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.event-header h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.event-content {
  margin-bottom: 30px;
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
  background: #f0f9ff;
  border-radius: 20px;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

.change-item:is([class*="+"]) {
  background: #f0f9ff;
  color: #67c23a;
}

.change-item:is([class*="-"]) {
  background: #fef0f0;
  color: #f56c6c;
}
</style>
