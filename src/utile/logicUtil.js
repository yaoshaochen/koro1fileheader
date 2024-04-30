/**
 * Author       : OBKoro1
 * Date         : 2020-02-15 00:11:39
 * LastEditors: OBKoro1
 * LastEditTime: 2020-04-24 16:10:12
 * FilePath     : /koro1FileHeader/src/utile/logicUtil.js
 * Description  :
 * https://github.com/OBKoro1
 */

const util = require('./util')
const vscode = require('vscode')
const global = require('../utile/CONST')

// 将字段弄得一样长
const sameLengthFn = (data, type = 'head') => {
  const config = vscode.workspace.getConfiguration('fileheader')
  let maxNum = config.configObj.functionWideNum // 函数长度
  if (type === 'head') {
    maxNum = config.configObj.wideNum // 头部长度
    if (!config.configObj.wideSame) return data // 不改变长度
  }
  if (maxNum === 0) return data // 不改变长度
  const objData = {}
  // 修改属性
  Object.keys(data).forEach((item) => {
    const newItem = util.spaceStringFn(item, maxNum)
    objData[newItem] = data[item]
  })
  return objData
}

/**
 * 更改字段，不改变他们的顺序
 * @Created_time: 2019-05-07 19:36:20
 * @return {Object} 更换字段后的对象
 */
const changePrototypeNameFn = (data, config) => {
  const keysArr = Object.keys(data)
  const objData = {}
  const specialArr = [
    // 没有操作
    global.SPECIAL_AUTHOR,
    global.SPECIAL_DATE,
    global.SPECIAL_HEAD_DESCRIPTION,
    global.SPECIAL_FN_DESCRIPTION,
    // 需要变更
    global.SPECIAL_LAST_EDIT_TIME,
    global.SPECIAL_LAST_EDITORS,
    global.SPECIAL_FILE_PATH
  ]
  keysArr.forEach((item) => {
    // 特殊字段 且 有设置特殊字段
    const specialItem = getSpecialOptionName(item, true)
    if (specialArr.includes(item) && specialItem) {
      objData[specialItem] = data[item]
    } else if (item.indexOf(global.specialString) !== -1) {
      // 更改用户自定义输出字段 后期需要切割它
      if (item === `${global.specialString}1_copyright`) {
        objData[global.customStringCopyRight] = data[item]
      } else if (item === `${global.specialString}1_date`) {
        objData[global.customStringTime] = data[item]
      } else {
        objData[`symbol_${item}`] = data[item]
      }
    } else {
      objData[item] = data[item]
    }
  })
  return objData
}

/**
 * description: 注释模板使用工作区模板或全局模板
 * param {string} madeName 注释模板的key值
 * return: 使用的模板
 */
const getAnnotationTemplate = (madeName, config) => {
  let userObj = config[madeName]
  // 使用工作区的模板
  if (config.configObj.useWorker) {
    const allTemplate = config.inspect(madeName, 'workspaceValue') // 全部模板
    if (!allTemplate.workspaceValue) return userObj // 未设置
    userObj = allTemplate.workspaceValue
    if (Object.keys(userObj).length === 0) {
      userObj = config[madeName] // 工作区未设置模板使用全局的
    }
  }
  return userObj
}

// 获取语言注释的符号对象
const getLanguageSymbol = (fileEnd) => {
  const config = vscode.workspace.getConfiguration('fileheader') // 配置项默认值
  let languageOption = {}
  // 匹配用户定义语言符号
  if (fileEnd.userLanguage) {
    languageOption = config.configObj.language[fileEnd.fileEnd]
  } else if (fileEnd !== global.NoMatchLanguage) {
    // 匹配插件的符号
    languageOption = global.annotationSymbol[fileEnd]
  } else if (config.configObj.annotationStr.use) {
    // 调用用户设置的默认注释符号
    languageOption = config.configObj.language
  } else {
    // 插件默认设置
    languageOption = global.annotationSymbol.javascript
  }
  return languageOption
}

/**
 * @description: 获取用户设置当前文件的语言/文件后缀 对应的配置，没有的话就用全局配置
 * @param options.optionsName 某项配置比如 language语言设置
 * @param options.globalSetting 该项配置的全局默认配置
 * @param options.defaultValue 参数没找到的默认值
 * @return options
 */
function getLanguageOrFileSetting (options) {
  const { optionsName, globalSetting = '', defaultValue } = options
  const config = vscode.workspace.getConfiguration('fileheader') // 配置项
  const editor = vscode.editor || vscode.window.activeTextEditor // 选中文件
  const languageId = editor.document.languageId
  const languageOptions = config.configObj[optionsName] || {}
  const fsPath = editor.document.uri.fsPath
  const fsName = util.fsPathFn(editor.document.uri.fsPath) // 文件后缀
  // 匹配特殊文件
  const isSpecial = util.specialLanguageFn(fsPath, optionsName)
  if (isSpecial && languageOptions[isSpecial] !== undefined) { return languageOptions[isSpecial] }
  // 检查用户是否设自定义语言 匹配语言
  if (languageOptions[languageId] !== undefined) {
    return languageOptions[languageId]
  } else if (languageOptions[fsName] !== undefined) {
    // 语言没有匹配到 单独匹配一下文件后缀
    return languageOptions[fsName]
  } else {
    // 没匹配到 使用默认
    // 如果配置项中有defaultSetting 就用配置项中的 否则用全局的
    const defaultSetting = languageOptions.defaultSetting
    if (defaultSetting !== undefined) {
      return defaultSetting
    } else {
      const res = config.configObj[globalSetting]
      if (res !== undefined) {
        return res
      }
      return defaultValue // 找不到值就返回这个值的默认值
    }
  }
}

/**
 * @description: 函数注释与头部注释 是否需要头部和尾部
 * @param type [string] 'function' | 'head'
 * @return [boolean]
 */
function noLinkHeadEnd (fileEnd, type) {
  if (!fileEnd.userLanguage) return false
  const customHasHeadEnd = getLanguageOrFileSetting({
    optionsName: 'customHasHeadEnd',
    defaultValue: '' // 只要不为取消 即使用
  })
  if (customHasHeadEnd === 'cancel head and function') {
    return true
  }
  if (type === 'function' && customHasHeadEnd === 'cancel function') {
    return true
  }
  if (type === 'head' && customHasHeadEnd === 'cancel head') {
    return true
  }
  return false // 链接头尾
}

/**
 * @description: 获取特殊字段的key
 */
function getSpecialOptionsKey (keyName) {
  const config = vscode.workspace.getConfiguration('fileheader') // 配置项
  let key = getSpecialOptionName(keyName)
  key = util.spaceStringFn(key, config.configObj.wideNum)
  return key
}

/**
 * @description: 获取某个key的特殊字段
 * 可以根据语言单独配置
 */
/**
 * @description: 获取某个key的特殊字段，可以根据语言单独配置
 * @param {type} key 获取哪个特殊字段的key
 * @param {type} isHas 是否存在
 * @return {type}
 */
function getSpecialOptionName (key, isHas) {
  // 获取用户语言特殊字符、或者整体的特殊字符
  const specialOptions = getLanguageOrFileSetting({
    optionsName: 'specialOptions',
    globalSetting: 'specialOptions',
    defaultValue: {}
  })
  const config = vscode.workspace.getConfiguration('fileheader') // 配置项
  const specialOptionsDefault = config.configObj.specialOptions
  // 合并配置项，默认配置与单独配置结合。
  const options = Object.assign(util.deepClone(specialOptionsDefault), util.deepClone(specialOptions))
  if (isHas) {
    return options[key]
  }
  return options[key] ? options[key] : key
}

module.exports = {
  noLinkHeadEnd,
  sameLengthFn,
  changePrototypeNameFn,
  getAnnotationTemplate,
  getLanguageSymbol,
  getLanguageOrFileSetting,
  getSpecialOptionsKey,
  getSpecialOptionName
}
