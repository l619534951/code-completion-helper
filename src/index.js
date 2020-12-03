import Antd, {version} from 'ant-design-vue'
import PropTypes, { withUndefined } from 'ant-design-vue/lib/_util/vue-types/index'
const rimraf = require('rimraf')
const { resolve } = require('path')
const fs = require('fs')
const { writeJsonFile } = require('./write')

const components = []
const fakeVue = {
  component: function (componentName, component) {
    components.push(component)
  },
  use: function (component) {
    component.install(fakeVue)
  },
  config: {
    globalProperties: {}
  },
}
Antd.install(fakeVue)

function createWebTypes() {
  const getAttributes = componentProps => {
    const attributes = []
    for (let propName in componentProps) {
      let type = 'string'
      const propTypeName = componentProps[propName]._vueTypes_name
      switch (propTypeName) {
        case PropTypes.looseBool._vueTypes_name:
          type = 'boolean'
          break
        case PropTypes.func._vueTypes_name:
          type = 'function'
          break
        case PropTypes.number._vueTypes_name:
          type = 'number'
          break
        // case PropTypes.oneOf._vueTypes_name:
        //   type =
        default:
          type = 'string'
          break
      }
      attributes.push({
        name: propName,
        value: {
          kind: 'expression',
          type: type
        },
      })
    }
    return attributes
  }
  
  const createTag = component => {
    // 只包含属性名称
    const attributes = getAttributes(component.props)
    
    return {
      name: component.name,
      attributes: attributes
    }
  }
  
  const tags = components.map(createTag)
  
  const webTypes = {
    $schema: 'http://json.schemastore.org/web-types',
    framework: 'vue',
    name: 'ant-design-vue',
    version: version,
    contributions: {
      html: {
        'types-syntax': 'typescript',
        'description-markup': 'markdown',
        tags,
      },
    },
  }
  
  writeJsonFile(webTypes, 'dist/web-types.json')
}
rimraf.sync(resolve('./dist'))

createWebTypes()
