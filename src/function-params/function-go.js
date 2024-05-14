/*
 * Author       : OBKoro1
 * CreateDate   : 2020-09-07 15:47:40
 * LastEditors  : OBKoro1 obkoro1@foxmail.com
 * LastEditTime : 2022-05-14 16:34:29
 * File         : \koro1FileHeader\src\function-params\function-go.js
 * Description  : java语言获取函数参数
 */

class GetParams {
  init (lineProperty) {
    this.text = lineProperty.text // 代码
    this.match = false // 是否匹配到参数
    this.res = ''
    this.returnRes = '' // 函数返回值
    this.matchProcess()
  }

  // 匹配流程
  matchProcess () {
    const matchObj = {
      matchFunction: 2,
      matchFuncNoName: 1
    }
    let params = ''
    const keyArr = Object.keys(matchObj)
    for (const item of keyArr.values()) {
      const match = this[item]()
      if (match) {
        const index = matchObj[item]
        params = match[index]
        break
      }
    }
    // 匹配参数
    this.parsing(params)
    // 匹配返回值
    this.parsingReturn()
  }

  // 匹配方法声明的参数
  matchFunction () {
    // 匹配单词func 可能有空格 可能有函数名 可能有空格 匹配括号 匹配括号内的一切
    const reg = /\bfunc\b.*(\w+)\s*\((.*?)\)/
    return reg.exec(this.text)
  }

  // 匹配匿名函数  var Add = func(a, b int) int {
  matchFuncNoName () {
    const reg = /\bfunc\b\s*\((.*?)\)/
    return reg.exec(this.text)
  }

  parsing (params) {
    let subRes
    const paramsArr = [] // 参数列表
    // 可能的空格 匹配参数 匹配可能的参数类型 遇到逗号停下来
    const reg = /(\w+(,\s+\w+)+\s+[\w.*]+|\w+\s+[\w.*]+|[\w.*]+)/g
    // 捕获函数参数
    while ((subRes = reg.exec(params))) {
      if (!subRes || subRes[1] === undefined || subRes[1] === '' || subRes[1] === 'undefined') break
      // 去掉多余空格
      subRes[1] = subRes[1].replace(/(\s)*,(\s)*/g, ',')
      const rArr = subRes[1].split(' ')
      // 有名参数（需要考虑连续多个参数同类型的case: (demo1, demo2, demo3 string, e error)）
      const sameNameArr = rArr[0].split(',')
      for (const item of sameNameArr.values()) {
        paramsArr.push({
          type: rArr[1],
          param: item
        })
      }
    }
    this.res = paramsArr
    if (paramsArr.length !== 0) {
      this.match = true
    }
  }

  parsingReturn () {
    const returnArr = [] // 返回值列表
    const reg = /func\s+(?:\([^)]*\))*\s?\w+\s*\([^)]*\)\s*(\([^)]*\))?\s*(\([\s\S]*\))?\s*([^{]*)/g
    // 匹配所有的返回值
    const ret = reg.exec(this.text)
    if (!ret) {
      return
    }
    // 解析返回值的不同格式
    // 已知的格式有  error | (string, error) | (demo string) | (demo string, e error) | (demo Obj, e error) | (demo1, demo2 string, e error)
    // 为了逻辑简单，先匹配到所有返回值的部分，然后分别匹配出所有的返回值

    let bracketRet
    if ((ret[1] !== undefined) && (ret[1] !== '')) {
      bracketRet = ret[1]
    } else if (ret[3] !== undefined && ret[3] !== '') {
      bracketRet = ret[3]
    }
    if (bracketRet === '') {
      return
    }
    // 匹配每个返回参数及其类型
    let subRes
    const subReg = /(\w+(,\s+\w+)+\s+[\w.*]+|\w+\s+[\w.*]+|[\w.*]+)/g
    while ((subRes = subReg.exec(bracketRet))) {
      if (!subRes || subRes[1] === undefined || subRes[1] === '' || subRes[1] === 'undefined') break
      // 去掉多余空格
      subRes[1] = subRes[1].replace(/(\s)*,(\s)*/g, ',')
      const rArr = subRes[1].split(' ')
      // 无名参数
      if (rArr.length === 1) {
        returnArr.push({
          type: rArr[0],
          param: '*'
        })
        continue
      }
      // 有名参数（需要考虑连续多个参数同类型的case: (demo1, demo2, demo3 string, e error)）
      const sameNameArr = rArr[0].split(',')
      for (const item of sameNameArr.values()) {
        returnArr.push({
          type: rArr[1],
          param: item
        })
      }
    }

    this.returnRes = returnArr
    if (returnArr.length !== 0) {
      this.match = true
    }
  }
}

module.exports = new GetParams()
