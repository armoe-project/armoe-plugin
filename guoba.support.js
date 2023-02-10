const path = process.cwd()
const pluginName = 'armoe-plugin'
const pluginPath = `${path}/plugins/${pluginName}`

export function supportGuoba() {
  return {
    pluginInfo: {
      name: pluginName,
      title: 'Armoe Plugin',
      author: '@真心',
      authorLink: 'https://github.com/RealHeart',
      link: 'https://github.com/armoe-project/armoe-plugin',
      isV3: true,
      isV2: false,
      description: '主要提供R6查询、KOOK查询等功能',
      iconPath: `${pluginPath}/resources/logo.webp`
    }
  }
}
