import plugin from '../../../lib/plugins/plugin.js'
import config from '../utils/config.js'
import { getPlatform } from '../utils/common.js'
import fetch from 'node-fetch'

export class kook extends plugin {
  constructor() {
    super({
      name: 'KOOK语音查询',
      dsc: '查询KOOK语音频道在线人数',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#(KOOK|kook)$',
          fnc: 'kook'
        },
        {
          reg: '^#(KOOK|kook)设置(.*)$',
          fnc: 'kookSet'
        },
        {
          reg: '^#(KOOK|kook)监听$',
          fnc: 'kookMonitor'
        }
      ]
    })
  }

  async kook(e) {
    const platform = getPlatform(e)

    if (platform == 'KOOK') {
      return await this.reply('该命令不支持KOOK平台使用.')
    }

    if (e.isPrivate) {
      return await this.reply('该命令仅限群聊使用.')
    }

    const server = config.get(`kook.${e.group_id}.server`)

    if (!server) {
      return await this.reply('请使用 #KOOK设置 设置本群服务器')
    }

    const url = `https://www.kookapp.cn/api/guilds/${server}/widget.json`
    const response = await fetch(url)
    const errMsg = '错误, 无法获取数据!\n请检查服务器小工具是否已开启!'

    if (!response.ok) {
      return await this.reply(errMsg)
    }

    const data = await response.json()
    const name = data.name
    const channels = data.channels
    const inviteLink = data.invite_link

    let msg = ''
    channels.forEach((item) => {
      if (item.users) {
        const name = item.name
        const users = item.users
        msg = `${msg}${name}: `
        users.forEach((user) => {
          msg = `${msg}${user.nickname}, `
        })
        msg = msg.substring(0, msg.length - 2)
        msg = `${msg}\n`
      }
    })
    if (msg == '') {
      msg = `${name} 频道语音无人在线\n`
    } else {
      msg = `${name} 频道语音在线:\n${msg}`
    }

    msg = msg.substring(0, msg.length - 1)
    msg = `${msg}\n\n加入频道: ${inviteLink}`
    await this.reply(msg)
  }

  async kookSet(e) {
    const platform = getPlatform(e)

    if (platform == 'KOOK') {
      return await this.reply('该命令不支持KOOK平台使用.')
    }

    if (e.isPrivate) {
      return await this.reply('该命令仅限群聊使用!')
    }

    const role = e.sender.role
    if (role != 'owner' && role != 'admin') {
      return await this.reply('该命令仅限群主或管理员使用!')
    }

    const reg = /^#(KOOK|kook)设置(.*)$/
    const match = reg.exec(e.msg)

    const link = match[2].trim()

    if (link == '') {
      return await this.reply(
        '获取服务器ID流程:\n' +
          '1.右上角点击服务器名称, 服务器设置>小工具\n' +
          '2.开启服务器小工具\n' +
          '3.复制JSON API\n' +
          '4.发送: #KOOK设置 <链接>'
      )
    }

    const errMsg = '错误, 无法获取数据!\n请检查链接是否正确, 小工具是否已开启!'
    try {
      const response = await fetch(link)
      if (!response.ok) {
        return await this.reply(errMsg)
      }
      const data = await response.json()

      const server = link
        .replace(/^#(KOOK|kook)设置$/, '')
        .replace(/https:\/\/kookapp.cn\/api\/guilds\//, '')
        .replace(/\/widget.json/, '')
        .trim()

      config.set(`kook.${e.group_id}.server`, server)

      await this.reply(
        `已成功设置本群KOOK服务器为: ${data.name}` +
          `\n如需查询语音频道在线请发送: #KOOK` +
          `\n如需监听服务器语音频道请发送: #KOOK监听`
      )
    } catch (e) {
      await this.reply(errMsg)
    }
  }

  async kookMonitor(e) {
    const platform = getPlatform(e)

    if (platform == 'KOOK') {
      return await this.reply('该命令不支持KOOK平台使用.')
    }

    if (e.isPrivate) {
      return await this.reply('该命令仅限群聊使用.')
    }

    const server = config.get(`kook.${e.group_id}.server`)

    if (!server) {
      return await this.reply('请使用 #KOOK设置 设置本群服务器')
    }

    const url = `https://www.kookapp.cn/api/guilds/${server}/widget.json`
    const response = await fetch(url)
    const errMsg = '错误, 无法获取数据!\n请检查服务器小工具是否已开启!'

    if (!response.ok) {
      return await this.reply(errMsg)
    }

    const data = await response.json()
    const name = data.name

    const status = config.get(`kook.${e.group_id}.monitor`)

    if (status) {
      config.set(`kook.${e.group_id}.monitor`, false)
      return await this.reply(`已关闭对服务器 ${name} 的监听，如需开启请再次发送 #KOOK监听`)
    } else {
      config.set(`kook.${e.group_id}.monitor`, true)
      return await this.reply(`已开启对服务器 ${name} 的监听，如需关闭请再次发送 #KOOK监听`)
    }
  }
}
