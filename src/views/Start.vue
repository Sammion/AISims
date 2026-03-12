<template>
  <div class="start-container">
    <div class="start-card">
      <h1 class="title">🏘️ 房地产大亨</h1>
      <h2 class="subtitle">人生模拟游戏</h2>
      <p class="description">
        从90年代出生的普通人开始，通过一次次人生选择，<br>
        最终成为叱咤风云的房地产大亨，或普通的地产从业者。<br>
        你的每一个决定，都将影响未来的人生轨迹。
      </p>
      
      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">🎭</span>
          <span>自定义人物属性</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📅</span>
          <span>真实时代背景</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔀</span>
          <span>多分支剧情</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🏆</span>
          <span>多种结局成就</span>
        </div>
      </div>

      <el-button type="primary" size="large" @click="startGame" class="start-btn">
        开始游戏
      </el-button>
      
      <el-button type="info" size="large" @click="loadGame" class="load-btn" style="margin-left: 20px;">
        读取存档
      </el-button>
      
      <el-dialog title="读取游戏" v-model="showLoadDialog" width="500px">
        <el-table :data="saveList" style="width: 100%">
          <el-table-column prop="name" label="存档名称" />
          <el-table-column prop="age" label="年龄" />
          <el-table-column prop="date" label="保存时间" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="loadSave(scope.row)">读取</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <el-button @click="showLoadDialog = false">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const showLoadDialog = ref(false)
const saveList = ref([])

const startGame = () => {
  router.push('/create')
}

const loadGame = () => {
  loadSaveList()
  showLoadDialog.value = true
}

const loadSaveList = () => {
  saveList.value = JSON.parse(localStorage.getItem('gameSaves') || '[]')
}

const loadSave = (save) => {
  // 直接加载所有状态
  gameStore.character = save.character
  gameStore.currentAge = save.age
  gameStore.currentPhase = save.phase
  gameStore.stats = { ...save.stats }
  gameStore.history = [...save.history]
  gameStore.gameOver = false
  gameStore.ending = null
  
  showLoadDialog.value = false
  router.push('/game')
}

onMounted(() => {
  loadSaveList()
})
</script>

<style scoped>
.start-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.start-card {
  background: white;
  border-radius: 20px;
  padding: 60px 80px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 24px;
  color: #666;
  margin-bottom: 30px;
  font-weight: normal;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 40px;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  color: #555;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 10px;
}

.feature-icon {
  font-size: 20px;
}

.start-btn {
  width: 200px;
  height: 50px;
  font-size: 18px;
}
</style>
