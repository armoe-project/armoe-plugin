import YAML from 'yaml'
import fs from 'fs'
import { pluginPackage } from './package.js'
import { _paths } from './paths.js'

/**
 * 配置文件
 */
class Config {
  constructor() {
    /** 配置文件 */
    this.config = {}

    // 初始化
    this.init()
  }

  /**
   * 初始化配置文件
   */
  init() {
    if (!fs.existsSync(_paths.config)) {
      fs.mkdirSync(_paths.config)
    }

    if (!fs.existsSync(`${_paths.config}/config.yaml`)) {
      fs.copyFileSync(
        `${_paths.defSet}/config.yaml`,
        `${_paths.config}/config.yaml`
      )
    }

    try {
      this.config = YAML.parse(
        fs.readFileSync(`${_paths.config}/config.yaml`, 'utf8')
      )
    } catch (error) {
      logger.error(`[Armoe] 配置文件格式错误! `, error)
      throw error
    }

    this.readYaml()
  }

  /**
   * 通过路径获取配置
   *
   * @param {string} path 路径
   */
  get(path) {
    return this.config[path]
  }

  /**
   * 通过路径设置配置
   *
   * @param {string} path
   * @param {*} value
   */
  set(path, value) {
    this.config[path] = value
    this.saveYaml()
  }

  /**
   * 读取Yaml文件
   */
  readYaml() {
    try {
      this.config = YAML.parse(
        fs.readFileSync(`${_paths.config}/config.yaml`, 'utf8')
      )
    } catch (error) {
      logger.error(`[Armoe] 配置文件格式错误! `, error)
      throw error
    }
  }

  saveYaml() {
    try {
      const yaml = YAML.stringify(this.config)
      fs.writeFileSync(`${_paths.config}/config.yaml`, yaml, 'utf8')
    } catch (e) {
      logger.error(`[Armoe] 配置文件写入失败! `, error)
      throw error
    }
  }
}

export default new Config()
