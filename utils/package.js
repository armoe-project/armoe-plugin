import path from 'path'
import { readJson } from './common.js'

// 三种获取插件名的方式
// console.log('pluginName 1:', path.basename(path.join(import.meta.url, '../../')))
// console.log('pluginName 2:', import.meta.url.match(/[\/\\](GUOBA-PLUGIN)[\/\\]/i)[1])
// console.log('pluginName 3:', path.basename(path.dirname(path.dirname(import.meta.url))))

const pluginName = path.basename(path.join(import.meta.url, '../../'))

const yunzaiPackage = readJson('./package.json')
const pluginPackage = readJson(`./plugins/${pluginName}/package.json`)

export { yunzaiPackage, pluginPackage }
