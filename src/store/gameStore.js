import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    character: null,
    currentAge: 15,
    currentPhase: 'middle_school',
    currentEvent: null,
    stats: {
      knowledge: 0,
      social: 0,
      wealth: 0,
      health: 100,
      reputation: 0
    },
    inventory: [],
    relationships: [],
    history: [],
    gameOver: false,
    ending: null
  }),

  actions: {
    initCharacter(characterData) {
      this.character = characterData
      this.stats.wealth = characterData.familySavings
      this.currentAge = 15
      this.currentPhase = 'middle_school'
      this.history = []
      this.gameOver = false
      this.ending = null
    },

    addHistory(event, choice, consequences) {
      this.history.push({
        age: this.currentAge,
        phase: this.currentPhase,
        event,
        choice,
        consequences,
        timestamp: Date.now()
      })
    },

    updateStats(delta) {
      Object.keys(delta).forEach(key => {
        if (this.stats[key] !== undefined) {
          this.stats[key] = Math.max(0, Math.min(100, this.stats[key] + delta[key]))
        }
      })
    },

    addWealth(amount) {
      this.stats.wealth += amount
    },

    nextYear() {
      this.currentAge++
      this.updatePhase()
      
      // 随机健康波动
      if (Math.random() < 0.1) {
        this.stats.health = Math.max(0, this.stats.health - Math.floor(Math.random() * 5))
      }

      // 检查游戏结束条件
      if (this.currentAge >= 65 || this.stats.health <= 0) {
        this.gameOver = true
        this.calculateEnding()
      }
    },

    updatePhase() {
      if (this.currentAge < 18) {
        this.currentPhase = 'middle_school'
      } else if (this.currentAge < 22) {
        this.currentPhase = 'university'
      } else if (this.currentAge < 30) {
        this.currentPhase = 'early_career'
      } else if (this.currentAge < 40) {
        this.currentPhase = 'career_growth'
      } else if (this.currentAge < 50) {
        this.currentPhase = 'peak_career'
      } else if (this.currentAge < 65) {
        this.currentPhase = 'late_career'
      } else {
        this.currentPhase = 'retirement'
      }
    },

    calculateEnding() {
      const { wealth, knowledge, social, reputation } = this.stats
      
      let endingType = 'ordinary'
      let referencePerson = null

      if (wealth > 1000000000 && reputation > 80 && social > 80) {
        endingType = 'tycoon'
        referencePerson = {
          name: '王健林',
          wiki: 'https://zh.wikipedia.org/wiki/%E7%8E%8B%E5%81%A5%E6%9E%97',
          description: '万达集团创始人，中国房地产行业领军人物'
        }
      } else if (wealth > 100000000 && reputation > 70) {
        endingType = 'successful_developer'
        referencePerson = {
          name: '潘石屹',
          wiki: 'https://zh.wikipedia.org/wiki/%E6%BD%98%E7%9F%B3%E5%B2%B7',
          description: 'SOHO中国创始人，知名地产开发商'
        }
      } else if (wealth > 10000000 && knowledge > 70) {
        endingType = 'excellent_agent'
        referencePerson = {
          name: '左晖',
          wiki: 'https://zh.wikipedia.org/wiki/%E5%B7%A6%E6%99%96',
          description: '链家、贝壳找房创始人，房产中介行业变革者'
        }
      } else if (wealth > 5000000 && social > 70) {
        endingType = 'sales_director'
        referencePerson = {
          name: '普通销售总监',
          description: '房地产销售团队负责人，年收入百万级'
        }
      } else if (wealth > 1000000) {
        endingType = 'senior_employee'
        referencePerson = {
          name: '资深地产从业者',
          description: '拥有丰富行业经验的资深员工'
        }
      } else if (this.stats.health <= 0) {
        endingType = 'premature_death'
      }

      this.ending = {
        type: endingType,
        age: this.currentAge,
        finalStats: { ...this.stats },
        referencePerson,
        history: [...this.history]
      }
    },

    reset() {
      this.$reset()
    }
  }
})
