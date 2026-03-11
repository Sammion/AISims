<template>
  <div class="create-container">
    <div class="create-card">
      <h1 class="title">创建你的角色</h1>
      
      <el-form :model="character" label-width="120px" class="form">
        <el-form-item label="姓名">
          <el-input 
            v-model="character.name" 
            placeholder="请输入姓名" 
            maxlength="10" 
            show-word-limit
            @input="character.name = character.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')"
          />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="character.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="长相">
          <el-slider v-model="character.appearance" :min="1" :max="10" show-input />
          <div class="slider-desc">
            <span>普通</span>
            <span>颜值出众</span>
          </div>
        </el-form-item>

        <el-form-item label="家庭储蓄">
          <el-select v-model="character.familySavings" placeholder="请选择家庭条件">
            <el-option :value="10000" label="普通家庭 (1万元)" />
            <el-option :value="50000" label="小康家庭 (5万元)" />
            <el-option :value="200000" label="富裕家庭 (20万元)" />
            <el-option :value="1000000" label="富商家庭 (100万元)" />
          </el-select>
        </el-form-item>

        <el-form-item label="父亲性格">
          <el-select v-model="character.fatherTrait" placeholder="请选择">
            <el-option value="strict" label="严格型" />
            <el-option value="lenient" label="宽容型" />
            <el-option value="business" label="经商型" />
            <el-option value="intellectual" label="知识型" />
          </el-select>
        </el-form-item>

        <el-form-item label="母亲性格">
          <el-select v-model="character.motherTrait" placeholder="请选择">
            <el-option value="careful" label="细心型" />
            <el-option value="open" label="开明型" />
            <el-option value="career" label="事业型" />
            <el-option value="warm" label="温暖型" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="confirm" :disabled="!canSubmit">
            确认创建
          </el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const character = ref({
  name: '',
  gender: 'male',
  appearance: 5,
  familySavings: 10000,
  fatherTrait: 'strict',
  motherTrait: 'careful'
})

const canSubmit = computed(() => {
  return character.value.name.trim() !== ''
})

const confirm = () => {
  if (!canSubmit.value) return
  
  gameStore.initCharacter({ ...character.value })
  router.push('/game')
}

const reset = () => {
  character.value = {
    name: '',
    gender: 'male',
    appearance: 5,
    familySavings: 10000,
    fatherTrait: 'strict',
    motherTrait: 'careful'
  }
}
</script>

<style scoped>
.create-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.create-card {
  background: white;
  border-radius: 20px;
  padding: 40px 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.form {
  margin-top: 30px;
}

.slider-desc {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}
</style>
