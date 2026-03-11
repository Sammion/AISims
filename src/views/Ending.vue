<template>
  <div class="ending-container">
    <div class="ending-card">
      <div class="ending-header">
        <div class="ending-icon">{{ endingInfo.icon }}</div>
        <h1 class="ending-title">{{ endingInfo.title }}</h1>
        <p class="ending-subtitle">{{ endingInfo.subtitle }}</p>
      </div>

      <div class="ending-stats">
        <h3>人生总结</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">最终年龄</span>
            <span class="stat-value">{{ ending.age }} 岁</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">知识</span>
            <span class="stat-value">{{ ending.finalStats.knowledge }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">社交</span>
            <span class="stat-value">{{ ending.finalStats.social }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">健康</span>
            <span class="stat-value">{{ ending.finalStats.health }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">声望</span>
            <span class="stat-value">{{ ending.finalStats.reputation }}</span>
          </div>
          <div class="stat-item wealth">
            <span class="stat-label">总财富</span>
            <span class="stat-value">¥{{ formatWealth(ending.finalStats.wealth) }}</span>
          </div>
        </div>
      </div>

      <div class="reference-person" v-if="ending.referencePerson">
        <h3>参考人物</h3>
        <div class="person-card">
          <div class="person-name">{{ ending.referencePerson.name }}</div>
          <div class="person-desc">{{ ending.referencePerson.description }}</div>
          <a 
            v-if="ending.referencePerson.wiki" 
            :href="ending.referencePerson.wiki" 
            target="_blank"
            class="wiki-link"
          >
            查看维基百科
          </a>
        </div>
      </div>

      <div class="ending-actions">
        <el-button type="primary" size="large" @click="restart">
          重新开始
        </el-button>
        <el-button type="info" size="large" @click="showHistory = true">
          查看人生历程
        </el-button>
      </div>
    </div>

    <el-dialog title="你的人生历程" v-model="showHistory" width="800px">
      <div class="history-list">
        <div v-for="(item, index) in ending.history" :key="index" class="history-item">
          <div class="history-header">
            <span class="history-age">{{ item.age }} 岁</span>
            <span class="history-phase">{{ phaseNames[item.phase] }}</span>
          </div>
          <div class="history-event">{{ item.event }}</div>
          <div class="history-choice">选择：{{ item.choice }}</div>
          <div class="history-result">结果：{{ item.consequences.description }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showHistory = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const ending = computed(() => gameStore.ending)
const showHistory = ref(false)

const phaseNames = {
  middle_school: '中学时期',
  university: '大学时期',
  early_career: '职场初期',
  career_growth: '职业上升期',
  peak_career: '事业巅峰期',
  late_career: '职业生涯后期',
  retirement: '退休'
}

const endingMap = {
  tycoon: {
    icon: '👑',
    title: '房地产大亨',
    subtitle: '你成为了叱咤风云的房地产行业领军人物，你的名字被载入行业史册，商业帝国遍布全国。'
  },
  successful_developer: {
    icon: '🏢',
    title: '成功的地产开发商',
    subtitle: '你创立了自己的地产公司，开发了多个知名项目，在行业内享有盛誉，实现了财富自由。'
  },
  excellent_agent: {
    icon: '🤝',
    title: '优秀的房产中介创始人',
    subtitle: '你颠覆了传统房产中介行业，创立了全国性的房产服务平台，帮助千万人找到了理想的家。'
  },
  sales_director: {
    icon: '📈',
    title: '销售总监',
    subtitle: '你成为了顶级房企的销售负责人，带领团队创造了无数销售奇迹，年收入百万，生活富足。'
  },
  senior_employee: {
    icon: '💼',
    title: '资深地产从业者',
    subtitle: '你在房地产行业深耕多年，积累了丰富的行业经验，有房有车，家庭幸福，过着安稳的中产阶级生活。'
  },
  ordinary: {
    icon: '🏠',
    title: '普通地产从业者',
    subtitle: '你在地产行业兢兢业业工作了一辈子，虽然没有大富大贵，但也买了自己的房子，过着平淡幸福的生活。'
  },
  premature_death: {
    icon: '⚰️',
    title: '英年早逝',
    subtitle: '由于长期劳累和不注意健康，你在年轻时就离开了人世，人生的无限可能戛然而止。'
  }
}

const endingInfo = computed(() => {
  return endingMap[ending.value?.type] || endingMap.ordinary
})

onMounted(() => {
  if (!ending.value) {
    router.push('/')
  }
})

const formatWealth = (amount) => {
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(1) + '亿'
  } else if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toLocaleString()
}

const restart = () => {
  gameStore.reset()
  router.push('/')
}
</script>

<style scoped>
.ending-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ending-card {
  background: white;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.ending-header {
  margin-bottom: 40px;
}

.ending-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.ending-title {
  font-size: 42px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.ending-subtitle {
  font-size: 18px;
  color: #666;
  line-height: 1.8;
  margin: 0 auto;
  max-width: 600px;
}

.ending-stats {
  margin-bottom: 40px;
  text-align: left;
}

.ending-stats h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-item {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.wealth .stat-value {
  color: #67c23a;
}

.reference-person {
  margin-bottom: 40px;
  text-align: left;
}

.reference-person h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.person-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
}

.person-name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.person-desc {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.95;
}

.wiki-link {
  display: inline-block;
  padding: 10px 20px;
  background: white;
  color: #667eea;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.wiki-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.ending-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.history-list {
  max-height: 600px;
  overflow-y: auto;
  padding: 10px 0;
}

.history-item {
  border-left: 3px solid #409eff;
  padding-left: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.history-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.history-header {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.history-age {
  font-weight: bold;
  color: #409eff;
  font-size: 16px;
}

.history-phase {
  color: #999;
  font-size: 14px;
}

.history-event {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.history-choice {
  color: #67c23a;
  margin-bottom: 5px;
  font-size: 14px;
}

.history-result {
  color: #666;
  font-size: 14px;
}
</style>
