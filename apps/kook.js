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
          reg: '^#(KOOK|kook)设置[ 0-9]+$',
          fnc: 'kookSet'
        }
      ]
    })
  }

  async kook() {
    const server = config.get('kook.server')
    console.log(server)
    await this.reply('')
  }

  async kookSet() {}
}
