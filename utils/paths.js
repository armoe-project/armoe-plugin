/*
 * 更改此文件需要重启
 */
import path from 'path'
import { pluginPackage } from './package.js'

const _path = process.cwd()
export const _paths = initPaths()

function initPaths() {
  // 插件根目录
  let root = path.join(_path, 'plugins', pluginPackage.name)
  // 插件资源目录
  let resources = path.join(root, 'resources')
  // 插件默认配置目录
  let defSet = path.join(root, 'defSet')
  // 插件配置目录
  let config = path.join(root, 'config')
  return {
    root,
    resources,
    defSet,
    config
  }
}
