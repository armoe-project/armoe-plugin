import plugin from '../../../lib/plugins/plugin.js'
import { makeForwardMsg } from '../utils/common.js'
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
      const messages = []

      const name = data.name // 用户名
      const level = data.level // 等级

      messages.push(`Lv.${level} ${name}`)

      const season = data.currentSeasonBestRegion // 当前赛季
      if (season) {
        const rankName = this.rank(season.rankName) // 段位
        const matches = season.matches // 总场
        const wins = season.wins // 胜场
        const winPct = season.winPct // 胜率
        const kills = season.kills // 杀敌
        const kd = season.kd // K/D比
        const rankPoints = season.rankPoints // MMR
        const maxRankPoints = season.maxRankPoints // 最高MMR

        messages.push(
          '当前赛季: \n' +
            `段位: ${rankName}\n` +
            `总场: ${matches}\n` +
            `胜场: ${wins}\n` +
            `胜率: ${winPct}%\n` +
            `杀敌: ${kills}\n` +
            `K/D比: ${kd.toFixed(2)}\n` +
            `MMR: ${rankPoints}\n` +
            `最高MMR: ${maxRankPoints}`
        )
      } else {
        messages.push('当前赛季暂无数据')
      }

      const lifetime = data.lifetimeStats // 生涯数据
      if (lifetime) {
        const bestRank = this.rank(lifetime.bestMmr.name) // 最高段位
        const bestMmr = lifetime.bestMmr.mmr // 最高MMR
        const winPct = lifetime.winPct // 总胜率
        const wins = lifetime.wins // 总胜场
        const kd = lifetime.kd // KD比
        const kills = lifetime.kills // 总杀敌
        const matches = lifetime.matches // 总局数
        const headshotPct = lifetime.headshotPct // 爆头率
        const headshots = lifetime.headshots // 爆头数
        const meleeKills = lifetime.meleeKills // 近战击杀
        const deaths = lifetime.deaths // 死亡数
        const losses = lifetime.losses // 失败数

        messages.push(
          '生涯数据: \n' +
            `最高段位: ${bestRank}\n` +
            `最高MMR: ${bestMmr}\n` +
            `总场次: ${matches}\n` +
            `总胜场: ${wins}\n` +
            `总败场: ${losses}\n` +
            `总胜率: ${winPct}%\n` +
            `总杀敌: ${kills}\n` +
            `总死亡: ${deaths}\n` +
            `爆头率: ${headshotPct}%\n` +
            `爆头击杀: ${headshots}\n` +
            `近战击杀: ${meleeKills}\n` +
            `K/D比: ${kd.toFixed(2)}\n`
        )
      } else {
        messages.push('暂无生涯数据')
      }

      // TOOD: 干员数据
      // const operators = this.sortOperators(data.operators)
      // logger.mark(operators)

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
