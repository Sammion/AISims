export const events = {
  middle_school: [
    {
      id: 'ms_001',
      title: '初中毕业选择',
      description: '你刚完成九年义务教育，面临人生第一个重要选择：',
      choices: [
        {
          text: '考上重点高中，努力学习',
          consequences: {
            knowledge: +10,
            social: -5,
            description: '你埋头苦读，成绩优异，但社交时间减少了'
          }
        },
        {
          text: '上普通高中，兼顾学习和社交',
          consequences: {
            knowledge: +5,
            social: +5,
            description: '你平衡了学习和生活，认识了很多朋友'
          }
        },
        {
          text: '辍学打工，早点进入社会',
          consequences: {
            knowledge: -10,
            social: +10,
            wealth: +5000,
            description: '你早早进入社会，开始打拼，积累了社会经验'
          }
        }
      ]
    },
    {
      id: 'ms_002',
      title: '暑假工机会',
      description: '暑假期间，亲戚介绍你去房产中介门店帮忙发传单：',
      choices: [
        {
          text: '去打工，锻炼自己',
          consequences: {
            social: +8,
            wealth: +2000,
            knowledge: +3,
            description: '你第一次接触房地产行业，了解了基础的房产知识'
          }
        },
        {
          text: '在家学习，准备高中课程',
          consequences: {
            knowledge: +8,
            description: '你利用暑假预习了高中知识，开学后轻松很多'
          }
        },
        {
          text: '和朋友出去玩，享受假期',
          consequences: {
            social: +5,
            health: +3,
            description: '你度过了一个轻松愉快的假期'
          }
        }
      ]
    }
  ],

  university: [
    {
      id: 'uni_001',
      title: '大学专业选择',
      description: '高考结束，你面临专业选择：',
      choices: [
        {
          text: '选择土木工程/建筑专业',
          consequences: {
            knowledge: +15,
            description: '你系统学习了建筑相关知识，为进入地产行业打下基础'
          }
        },
        {
          text: '选择市场营销/工商管理专业',
          consequences: {
            social: +15,
            description: '你学习了销售和管理知识，适合从事地产销售、运营工作'
          }
        },
        {
          text: '选择金融/经济专业',
          consequences: {
            knowledge: +10,
            social: +5,
            description: '你学习了金融知识，对房地产投资有独到理解'
          }
        }
      ]
    },
    {
      id: 'uni_003',
      title: '大学联谊活动',
      description: '学校举办大型联谊活动，你会：',
      choices: [
        {
          text: '积极参与，认识新朋友',
          consequences: ({ appearance, gender }) => {
            const baseSocial = 10
            const appearanceBonus = appearance >= 7 ? 8 : appearance >= 5 ? 5 : 2
            const genderBonus = gender === 'female' ? 3 : gender === 'male' ? 2 : 0
            const totalBonus = appearanceBonus + genderBonus
            return {
              social: baseSocial + totalBonus,
              description: `你在联谊会上认识了很多朋友，颜值和性别帮你获得了${totalBonus}点额外社交加成`
            }
          }
        },
        {
          text: '待在宿舍学习',
          consequences: {
            knowledge: +8,
            description: '你利用时间好好学习，专业知识更加扎实'
          }
        }
      ]
    },
    {
      id: 'uni_004',
      title: '课程设计比赛',
      description: '学校举办房产项目设计大赛，奖金丰厚：',
      choices: [
        {
          text: '组队参赛，冲击一等奖',
          consequences: {
            knowledge: +12,
            reputation: +8,
            wealth: +3000,
            description: '你们团队的设计作品获得了一等奖，得到了评委的高度认可'
          }
        },
        {
          text: '参加但不追求名次',
          consequences: {
            knowledge: +5,
            social: +3,
            description: '你参与了比赛，学到了很多实践知识，认识了不少同学'
          }
        },
        {
          text: '不参加，专心学习',
          consequences: {
            knowledge: +6,
            description: '你利用这段时间巩固了专业知识，成绩有所提升'
          }
        }
      ]
    },
    {
      id: 'uni_005',
      title: '兼职机会',
      description: '课余时间你想找份兼职补贴生活费：',
      choices: [
        {
          text: '做房产销售兼职',
          consequences: {
            social: +8,
            wealth: +2000,
            knowledge: +4,
            description: '你利用周末时间做房产销售兼职，提前了解了行业情况'
          }
        },
        {
          text: '做家教',
          consequences: {
            wealth: +1500,
            knowledge: +3,
            description: '你利用课余时间做家教，收入稳定，还锻炼了表达能力'
          }
        },
        {
          text: '不兼职，专注学业',
          consequences: {
            knowledge: +5,
            health: +2,
            description: '你专心学习，成绩优秀，还获得了奖学金'
          }
        }
      ]
    },
    {
      id: 'uni_006',
      title: '社团活动',
      description: '你想参加一个社团丰富大学生活：',
      choices: [
        {
          text: '加入房地产研究协会',
          consequences: {
            knowledge: +7,
            social: +5,
            description: '你在协会里认识了很多志同道合的朋友，经常一起讨论行业动态'
          }
        },
        {
          text: '加入创业协会',
          consequences: {
            social: +10,
            reputation: +3,
            description: '你参与了多个创业项目，锻炼了商业思维和实践能力'
          }
        },
        {
          text: '加入运动社团',
          consequences: {
            health: +8,
            social: +6,
            description: '你经常参加体育锻炼，身体变得更加强壮，还认识了很多朋友'
          }
        }
      ]
    },
    {
      id: 'uni_002',
      title: '实习机会',
      description: '大三暑假，你获得了两个实习机会：',
      choices: [
        {
          text: '去知名房企实习',
          consequences: ({ fatherTrait, motherTrait }) => {
            const baseKnowledge = 10
            const baseSocial = 10
            const baseReputation = 5
            
            // 父母性格加成
            let bonus = 0
            if (fatherTrait === 'business' || motherTrait === 'career') {
              bonus = 5
            } else if (fatherTrait === 'intellectual' || motherTrait === 'careful') {
              bonus = 3
            }
            
            return {
              knowledge: baseKnowledge + bonus,
              social: baseSocial + bonus,
              reputation: baseReputation + bonus,
              description: `你在知名房企实习表现出色，家庭背景帮你获得了${bonus}点额外加成`
            }
          }
        },
        {
          text: '去小型中介公司实习',
          consequences: {
            social: +15,
            wealth: +5000,
            description: '你在一线销售岗位锻炼，积累了实战经验和客户资源'
          }
        },
        {
          text: '准备考研，继续深造',
          consequences: {
            knowledge: +20,
            description: '你决定继续深造，提升自己的学历和专业能力'
          }
        }
      ]
    },
    {
      id: 'uni_007',
      title: '学术讲座',
      description: '学校邀请了地产行业大佬来做学术讲座：',
      choices: [
        {
          text: '提前到场，认真听讲并提问',
          consequences: {
            knowledge: +8,
            reputation: +4,
            description: '你的问题得到了大佬的赏识，给你留下了联系方式'
          }
        },
        {
          text: '正常参加，认真学习',
          consequences: {
            knowledge: +5,
            description: '你学到了很多行业前沿知识，受益匪浅'
          }
        },
        {
          text: '不去了，在宿舍休息',
          consequences: {
            health: +3,
            description: '你好好休息了一下，精神状态好了很多'
          }
        }
      ]
    },
    {
      id: 'uni_008',
      title: '考证机会',
      description: '你可以考取相关职业资格证书提升竞争力：',
      choices: [
        {
          text: '备考房地产经纪人资格证',
          consequences: {
            knowledge: +10,
            reputation: +5,
            description: '你成功考取了资格证，未来找工作更有竞争力'
          }
        },
        {
          text: '备考注册建造师证',
          consequences: {
            knowledge: +12,
            reputation: +6,
            description: '你通过了考试，获得了含金量很高的职业资格证书'
          }
        },
        {
          text: '不考证，积累实践经验',
          consequences: {
            social: +5,
            wealth: +1000,
            description: '你利用时间做兼职和项目，积累了不少实践经验'
          }
        }
      ]
    }
  ],

  early_career: [
    {
      id: 'ec_001',
      title: '第一份工作',
      description: '大学毕业，你需要选择第一份工作：',
      choices: [
        {
          text: '进入大型房企做管培生',
          consequences: {
            reputation: +10,
            knowledge: +10,
            wealth: +8000,
            description: '你进入了头部房企，接受系统培训，职业起点很高'
          }
        },
        {
          text: '进入房产中介公司做销售',
          consequences: {
            social: +15,
            wealth: +5000,
            description: '你从基层销售做起，收入与业绩直接挂钩'
          }
        },
        {
          text: '自主创业，开一家小中介门店',
          consequences: {
            social: +20,
            wealth: -20000,
            reputation: +5,
            description: '你拿出全部积蓄创业，风险很高但前景广阔'
          }
        }
      ]
    },
    {
      id: 'ec_002',
      title: '行业红利期',
      description: '2010年前后，房地产行业迎来快速发展期，你看到了机会：',
      choices: [
        {
          text: '加杠杆贷款投资房产',
          consequences: {
            wealth: +100000,
            reputation: +5,
            description: '你看准时机投资房产，资产快速增值'
          }
        },
        {
          text: '跳槽到更好的平台',
          consequences: {
            reputation: +10,
            wealth: +20000,
            description: '你凭借行业经验跳槽到更好的公司，薪资翻倍'
          }
        },
        {
          text: '安稳工作，不冒风险',
          consequences: {
            knowledge: +5,
            health: +5,
            description: '你选择安稳工作，虽然没赚大钱但生活稳定'
          }
        }
      ]
    }
  ],

  career_growth: [
    {
      id: 'cg_001',
      title: '职业晋升机会',
      description: '工作几年后，你有机会晋升为部门负责人：',
      choices: [
        {
          text: '接受晋升，承担更多责任',
          consequences: {
            reputation: +15,
            social: +10,
            wealth: +50000,
            health: -10,
            description: '你成为管理层，收入和地位提升，但工作压力也更大了'
          }
        },
        {
          text: '积累资源准备创业',
          consequences: {
            social: +15,
            reputation: +5,
            description: '你积累了足够的资源和人脉，准备开创自己的事业'
          }
        },
        {
          text: '转做投资，实现财务自由',
          consequences: {
            wealth: +200000,
            knowledge: +10,
            description: '你利用多年积累的经验投资房产，实现了财务自由'
          }
        }
      ]
    },
    {
      id: 'cg_002',
      title: '贵人相助',
      description: '在一次行业峰会上，你认识了一位地产行业的大佬：',
      choices: [
        {
          text: '主动交流，争取合作机会',
          consequences: {
            social: +20,
            reputation: +15,
            wealth: +100000,
            description: '你得到了大佬的赏识，获得了宝贵的合作机会'
          }
        },
        {
          text: '认真听讲，学习经验',
          consequences: {
            knowledge: +15,
            description: '你学到了很多行业前沿知识，受益匪浅'
          }
        },
        {
          text: '觉得高攀不起，默默离开',
          consequences: {
            health: +5,
            description: '你觉得自己资历尚浅，没有上前打扰'
          }
        }
      ]
    }
  ],

  peak_career: [
    {
      id: 'pc_001',
      title: '行业调整期',
      description: '房地产行业进入调整期，市场环境发生变化：',
      choices: [
        {
          text: '转型做商业地产/城市更新',
          consequences: {
            knowledge: +15,
            wealth: +200000,
            reputation: +10,
            description: '你成功转型，抓住了新的行业机会'
          }
        },
        {
          text: '稳健经营，收缩业务',
          consequences: {
            wealth: +50000,
            health: +10,
            description: '你选择稳健发展，成功度过行业寒冬'
          }
        },
        {
          text: '加杠杆扩张，赌一把',
          consequences: {
            wealth: -500000,
            health: -20,
            description: '你误判了形势，扩张失败，损失惨重'
          }
        }
      ]
    },
    {
      id: 'pc_002',
      title: '行业峰会演讲邀请',
      description: '你收到了行业顶级峰会的演讲邀请：',
      choices: [
        {
          text: '接受邀请，分享经验',
          consequences: {
            reputation: +20,
            social: +15,
            description: '你的演讲大获成功，行业地位进一步提升'
          }
        },
        {
          text: '拒绝邀请，专注公司业务',
          consequences: {
            wealth: +150000,
            knowledge: +10,
            description: '你专注于公司运营，业务更上一层楼'
          }
        }
      ]
    },
    {
      id: 'pc_003',
      title: '企业并购机会',
      description: '有一家小型地产公司经营不善，寻求被并购：',
      choices: [
        {
          text: '抓住机会，低价并购',
          consequences: {
            wealth: +300000,
            reputation: +15,
            description: '并购非常成功，公司规模扩大了一倍'
          }
        },
        {
          text: '风险太大，放弃并购',
          consequences: {
            health: +5,
            description: '你规避了潜在风险，公司稳步发展'
          }
        }
      ]
    }
  ],

  late_career: [
    {
      id: 'lc_001',
      title: '退休前的选择',
      description: '临近退休，你需要考虑未来的安排：',
      choices: [
        {
          text: '培养接班人，顺利交接',
          consequences: {
            reputation: +10,
            health: +10,
            description: '你培养了优秀的接班人，公司平稳发展'
          }
        },
        {
          text: '出售公司，套现享受生活',
          consequences: {
            wealth: +5000000,
            health: +15,
            description: '你出售了全部资产，实现了完美退休'
          }
        },
        {
          text: '继续奋斗，直到干不动为止',
          consequences: {
            wealth: +1000000,
            health: -15,
            description: '你热爱这份事业，选择继续发光发热'
          }
        }
      ]
    },
    {
      id: 'lc_002',
      title: '行业协会荣誉职位',
      description: '你被提名担任房地产行业协会会长：',
      choices: [
        {
          text: '接受任命，为行业做贡献',
          consequences: {
            reputation: +25,
            social: +20,
            description: '你成为行业领军人物，备受尊敬'
          }
        },
        {
          text: '婉言谢绝，安心退休',
          consequences: {
            health: +20,
            description: '你选择功成身退，安享晚年生活'
          }
        }
      ]
    },
    {
      id: 'lc_003',
      title: '慈善捐赠邀请',
      description: '慈善机构邀请你捐赠建立希望小学：',
      choices: [
        {
          text: '慷慨捐赠，回馈社会',
          consequences: {
            reputation: +30,
            wealth: -200000,
            description: '你的善举得到了社会的广泛赞誉'
          }
        },
        {
          text: '婉拒捐赠，保留财富给子女',
          consequences: {
            wealth: +0,
            description: '你选择为子女留下更多财富'
          }
        }
      ]
    }
  ]
}

export const randomEvents = [
  {
    id: 'rand_001',
    title: '楼市暴涨',
    description: '房地产市场迎来暴涨，你的资产大幅增值！',
    choices: [
      {
        text: '抓住机会加大投资',
        consequences: {
          wealth: () => Math.random() * 500000 + 100000,
          reputation: +5,
          description: '你看准时机追加投资，资产大幅增值！'
        }
      },
      {
        text: '见好就收，落袋为安',
        consequences: {
          wealth: () => Math.random() * 200000 + 50000,
          health: +3,
          description: '你选择稳健操作，锁定了部分收益，避免了后续风险。'
        }
      }
    ]
  },
  {
    id: 'rand_002',
    title: '政策调控',
    description: '国家出台房地产调控政策，市场降温。',
    choices: [
      {
        text: '降价抛售，快速回笼资金',
        consequences: {
          wealth: () => -(Math.random() * 200000 + 50000),
          knowledge: +5,
          description: '你果断止损，虽然损失了部分资金，但保住了现金流。'
        }
      },
      {
        text: '长期持有，等待市场回暖',
        consequences: {
          wealth: () => -(Math.random() * 100000 + 20000),
          reputation: +3,
          description: '你看好行业长期发展，选择持有，虽然短期亏损但获得了业内认可。'
        }
      }
    ]
  },
  {
    id: 'rand_003',
    title: '项目成功',
    description: '你负责的项目大获成功，得到了公司奖励！',
    choices: [
      {
        text: '接受奖金，继续努力',
        consequences: {
          wealth: () => Math.random() * 100000 + 20000,
          reputation: +10,
          description: '你获得了丰厚的奖金，在公司的地位也更加稳固。'
        }
      },
      {
        text: '把奖金分给团队成员',
        consequences: {
          social: +15,
          reputation: +15,
          description: '你大方地分享了奖金，团队凝聚力大大增强，大家都愿意跟随你干。'
        }
      }
    ]
  },
  {
    id: 'rand_004',
    title: '健康问题',
    description: '长期高强度工作让你的身体出现了问题，需要休养。',
    choices: [
      {
        text: '立刻住院治疗，健康最重要',
        consequences: {
          health: +15,
          wealth: -10000,
          description: '你放下工作专心休养，身体很快恢复了健康。'
        }
      },
      {
        text: '带病坚持工作，项目不能停',
        consequences: {
          health: -20,
          reputation: +8,
          wealth: +50000,
          description: '你坚持完成了项目，得到了领导的赏识，但身体状况更差了。'
        }
      }
    ]
  }
]
