import config from '../utils/config.js'
export function kook() {
  setTimeout(() => {
    for (const uin of Bot.uin) {
      if (typeof uin === 'string') {
        if (uin.startsWith('ko_')) {
          logger.info('开始对 KOOK 加入/退出语言频道进行监听')
          var bot = Bot[uin]
          bot.sdk.on('event.system', async (event) => {
            const rawEvent = event.rawEvent
            const guildId = rawEvent.target_id
            const extra = rawEvent.extra
            const type = extra.type
            const body = extra.body
            if (body.channel_id) {
              const group = getGroupOnEnableedMonitor(guildId)
              if (group) {
                if (type === 'joined_channel' || type === 'exited_channel') {
                  const api = bot.sdk.API
                  const guild = await api.guild.view(guildId)
                  const channel = await api.channel.view(body.channel_id)
                  const user = await api.user.view(body.user_id)
                  if (user.data.bot) {
                    return
                  }
                  let action = ''
                  if (type === 'joined_channel') {
                    action = '加入'
                  } else if (type === 'exited_channel') {
                    action = '退出'
                  }
                  const message = `服务器 ${guild.data.name} 用户 ${user.data.nickname}#${user.data.identify_num} 已${action} 语音频道 ${channel.data.name}`
                  logger.info(message)
                  group.sendMsg(message)
                }
              }
            }
          })
          break
        }
      }
    }
  }, 5000)
}

function getGroupOnEnableedMonitor(guildId) {
  const groups = config.get('kook')
  for (const key in groups) {
    const group = groups[key]
    if (group.server === guildId) {
      if (group.monitor) {
        return Bot.pickGroup(key)
      }
    }
  }
  return false
}
