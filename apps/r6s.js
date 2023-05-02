import plugin from '../../../lib/plugins/plugin.js'
import { makeForwardMsg } from '../utils/common.js'
import fetch from 'node-fetch'
import { segment } from 'oicq'

export class r6s extends plugin {
  constructor() {
    super({
      name: 'R6战绩查询',
      dsc: '通过用户名查询彩虹六号战绩',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#(r6s|R6S)(.*)$',
          fnc: 'r6s'
        }
      ]
    })
  }

  async r6s(e) {
    const reg = /^#(r6s|R6S)(.*)$/
    const match = reg.exec(e.msg)
    const username = match[2].trim()

    if (username == '') {
      return await this.reply('参数错误，请输入用户名!\n示例: #r6s QGZhenXin')
    }

    const api = 'https://r6.tracker.network/api/v0/overwolf/player'

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
      const avatar = data.avatar // 头像
      const name = data.name // 用户名
      const level = data.level // 等级

      const season = data.currentSeasonBestRegion // 当前赛季
      const rankName = this.rank(season.rankName) // 段位
      const matches = season.matches // 总场
      const wins = season.wins // 胜场
      const winPct = season.winPct // 胜率
      const kills = season.kills // 杀敌
      const kd = season.kd // K/D比
      const rankPoints = season.rankPoints // MMR
      const maxRankPoints = season.maxRankPoints // 最高MMR

      // TOOD: 干员数据
      // const operators = this.sortOperators(data.operators)
      // logger.mark(operators)

      const messages = []

      let avatarImage
      try {
        avatarImage = segment.image(avatar)
      } catch (error) {}

      if (avatarImage) {
        messages.push(avatarImage)
      }

      messages.push(
        `Lv.${level} ${name}\n` +
          `段位: ${rankName}\n` +
          `总场: ${matches}\n` +
          `胜场: ${wins}\n` +
          `胜率: ${winPct}%\n` +
          `杀敌: ${kills}\n` +
          `K/D比: ${kd.toFixed(2)}\n` +
          `MMR: ${rankPoints}\n` +
          `最高MMR: ${maxRankPoints}`
      )

      const message = await makeForwardMsg(e, messages)
      await this.reply(message)
    } catch (error) {
      logger.error(data)
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
      .replace(/CHAMPION/, '冠军')
  }

  sortOperators(operators) {
    return operators.sort((a, b) => a.timePlayed - b.timePlayed).reverse()
  }
}
