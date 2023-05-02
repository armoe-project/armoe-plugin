import plugin from '../../../lib/plugins/plugin.js'
import { _paths } from '../utils/paths.js'
import fs from 'fs'

const rolePath = `${_paths.resources}/星穹铁道/攻略图/角色`

export class strategy extends plugin {
  constructor() {
    super({
      name: '星穹铁道-攻略',
      dsc: '查询崩坏：星穹铁道的角色攻略 数据来源于米游社',
      event: 'message',
      priority: 400,
      rule: [
        {
          reg: '^#(.*)(攻略)$',
          fnc: 'strategy'
        }
      ]
    })
  }

  async strategy(e) {
    const reg = /^#(.*)(攻略)$/
    const match = reg.exec(e.msg)
    const roleName = match[1].trim()

    const roleFiles = await this.getRoleList()
    if (roleFiles.includes(roleName)) {
      const image = segment.image(`${rolePath}/${roleName}.png`)
      this.reply(image)
      return true
    } else {
      logger.mark(`[星穹铁道-攻略][strategy]未找到角色 [${roleName}] 放行消息交由云崽处理.`)
      return false
    }
  }

  async getRoleList() {
    const roleFiles = fs.readdirSync(rolePath)
    return roleFiles
      .filter((file) => file.endsWith('.png'))
      .map((file) => file.replace(/.png/g, ''))
  }
}
