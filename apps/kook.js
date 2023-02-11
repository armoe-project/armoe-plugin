import plugin from '../../../lib/plugins/plugin.js'
import config from '../utils/config.js'
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
          reg: '^#(KOOK|kook)设置$',
          fnc: 'kookSet'
        },
        {
          reg: '^#(KOOK|kook)设置(.*)$',
          fnc: 'kookSet'
        }
      ]
    })
  }

  async kook(e) {
    if (e.isPrivate) {
      return await this.reply('该命令仅限群聊使用.')
    }

    const server = config.get(`kook.servers.${e.group_id}`)

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
    if (e.isPrivate) {
      return await this.reply('该命令仅限群聊使用!')
    }

    const reg = /^#(KOOK|kook)设置(.*)$/
    const match = reg.exec(e.msg)

    if (match == null) {
      return await this.reply(
        '获取服务器ID流程:\n' +
          '1.右上角点击服务器名称, 服务器设置>小工具\n' +
          '2.开启服务器小工具\n' +
          '3.复制JSON API\n' +
          '4.发送: #KOOK设置 <链接>'
      )
    }

    const link = match[2].trim()
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

      config.set(`kook.servers.${e.group_id}`, server)

      await this.reply(`已成功设置本群KOOK服务器为: ${data.name}`)
    } catch (e) {
      await this.reply(errMsg)
    }
  }
}
