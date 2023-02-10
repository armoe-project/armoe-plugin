import plugin from '../../../lib/plugins/plugin.js'

const helpList = [
  {
    name: 'R6战绩查询',
    desc: '通过用户名查询彩虹六号战绩',
    usage: '#r6s <用户名>'
  }
]

export class help extends plugin {
  constructor(e) {
    super({
      name: 'Armoe Plugin 帮助',
      dsc: '查看 Armoe Plugin 帮助信息',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#(Ar|ar|AR|Armoe|armoe|ARMOE)(插件| Plugin| plugin)?(帮助|菜单|说明|使用说明)$',
          fnc: 'help'
        }
      ]
    })
  }

  async help() {
    let message = 'Armoe Plugin 帮助\n'
    helpList.forEach((help) => {
      message += `功能: ${help.name}\n简介: ${help.desc}\n使用方法: ${help.usage}\n`
    })
    await this.reply(message)
  }
}
