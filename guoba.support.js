import { pluginPackage } from './utils/package.js'
import { _paths } from './utils/paths.js'

export function supportGuoba() {
  return {
    pluginInfo: {
      name: pluginPackage.name,
      title: '阿尔萌插件 (armoe-plugin)',
      author: '@真心',
      authorLink: 'https://github.com/RealHeart',
      link: pluginPackage.homepage,
      isV3: true,
      isV2: false,
      description: '提供星穹铁道攻略查询、R6战绩查询、KOOK在线查询等功能',
      iconPath: `${_paths.resources}/logo.webp`
    }
  }
}
