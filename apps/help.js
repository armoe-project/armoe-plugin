import plugin from '../../../lib/plugins/plugin.js'

const helpList = [
  {
    name: 'R6战绩查询',
    desc: '通过用户名查询彩虹六号战绩',
    usage: '#r6s <用户名>'
  },
  {
    name: 'KOOK语音查询',
    desc: '查询KOOK语音频道在线人数',
    usage: '#KOOK'
  },
  {
    name: '喵言喵语',
    desc: '随机获取一条喵言喵语, 卡拉彼丘似了喵!',
    usage: '#喵言喵语'
  }
]

export class help extends plugin {
  constructor() {
    super({
      name: 'Armoe Plugin 帮助',
      dsc: '查看 Armoe Plugin 帮助信息',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^#(Ar|ar|AR|Armoe|armoe|ARMOE)(插件| Plugin| plugin)?(帮助|菜单|功能|说明|使用说明)$',
          fnc: 'help'
        }
      ]
    })
  }

  async help() {
    let message = 'Armoe Plugin 功能列表\n'
    helpList.forEach((help) => {
      message += `功能: ${help.name}\n简介: ${help.desc}\n使用: ${help.usage}\n\n`
    })
    await this.reply(message.trimEnd())
  }
}
