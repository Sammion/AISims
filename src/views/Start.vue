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
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startGame = () => {
  router.push('/create')
}
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
