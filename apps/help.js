import plugin from '../../../lib/plugins/plugin.js'

export class help extends plugin {
  constructor(e) {
    super({
      name: '阿尔萌帮助',
      dsc: '阿尔萌帮助',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#?阿尔萌(插件)?帮助$',
          fnc: 'help'
        }
      ]
    })
  }

  async help() {
    await this.reply('未实现')
  }
}
