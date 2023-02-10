import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

export class r6s extends plugin {
  constructor() {
    super({
      name: 'R6战绩查询',
      dsc: '通过用户名查询彩虹六号战绩',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#(r6s|R6s)$',
          fnc: 'r6s'
        },
        {
          reg: '^#(r6s|R6S)([ A-Za-z0-9]+)$',
          fnc: 'r6s'
        }
      ]
    })
  }

  async r6s(e) {
    const reg = /^#(r6s|R6S)([ A-Za-z0-9]+)$/
    const match = reg.exec(e.msg)

    if (match == null) {
      return await this.reply('参数错误，请输入用户名!\n示例: #r6s QGZhenXin')
    }

    const api = 'https://r6.tracker.network/api/v0/overwolf/player'
    const username = match[2]

    const response = await fetch(`${api}?name=${username}`)
    const errMsg = '查询失败，请检查用户名是否正确或稍后再试!'
    if (!response.ok) {
      return await this.reply(errMsg)
    }
    const data = await response.json()
    if (!data.success) {
      return await this.reply(errMsg)
    }

    try {
      const name = data.name
      const level = data.level

      const season = data.currentSeasonBestRegion
      const rankName = season.rankName
      const matches = season.matches
      const wins = season.wins
      const winPct = season.winPct
      const kills = season.kills
      const kd = season.kd
      const rankPoints = season.rankPoints
      const maxRankPoints = season.maxRankPoints

      const message =
        `Lv.${level} ${name}\n` +
        `段位: ${this.rank(rankName)}\n` +
        `总场: ${matches}\n` +
        `胜场: ${wins}\n` +
        `胜率: ${winPct}%\n` +
        `杀敌: ${kills}\n` +
        `K/D比: ${kd.toFixed(2)}\n` +
        `MMR: ${rankPoints}\n` +
        `最高MMR: ${maxRankPoints}`

      await this.reply(message)
    } catch (error) {
      console.log(data)
      await this.reply(errMsg)
      throw error
    }
  }

  rank(rankName) {
    return rankName
      .replace(/COPPER/, '紫铜')
      .replace(/BRONZE/, '青铜')
      .replace(/SILVER/, '白银')
      .replace(/GOLD/, '黄金')
      .replace(/PLATINUM/, '白金')
      .replace(/EMERALD/, '翡翠')
      .replace(/DIMOND/, '钻石')
      .replace(/CHAMPIONS/, '冠军')
  }
}
