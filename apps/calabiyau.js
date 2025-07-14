import plugin from '../../../lib/plugins/plugin.js'
import meowMessage from '../resources/meow.js'

export class r6s extends plugin {
  constructor() {
    super({
      name: '喵言喵语',
      dsc: '随机获取一条喵言喵语, 卡拉彼丘似了喵!',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#(喵言喵语|猫娘语录)$',
          fnc: 'meow'
        }
      ]
    })
  }

  async meow() {
    const random = Math.floor(Math.random() * meowMessage.length)
    await this.reply(meowMessage[random])
  }
}
