import fs from 'node:fs'
import { pluginPackage } from './utils/package.js'
import { kook } from './native/kook.js'

const files = fs.readdirSync('./plugins/armoe-plugin/apps').filter((file) => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

kook()

logger.mark('-----------------')
logger.mark(`欢迎使用 Armoe Plugin, 当前版本: ${pluginPackage.version}`)
logger.mark(`Github: ${pluginPackage.homepage}`)
logger.mark('-----------------')

export { apps }
