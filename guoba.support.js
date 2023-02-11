import { pluginPackage } from './utils/package.js'
import { _paths } from './utils/paths.js'

export function supportGuoba() {
  return {
    pluginInfo: {
      name: pluginPackage.name,
      title: 'Armoe Plugin',
      author: '@真心',
      authorLink: 'https://github.com/RealHeart',
      link: pluginPackage.homepage,
      isV3: true,
      isV2: false,
      description: '主要提供R6查询、KOOK查询等功能',
      iconPath: `${_paths.resources}/logo.webp`
    }
  }
}
