// const Antd = require('ant-design-vue/lib/index.js')

import Antd, {version, Input } from 'ant-design-vue'
import PropTypes, { withUndefined } from 'ant-design-vue/lib/_util/vue-types/index'
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

const getAttributes = component => {
  const attributes = []
  for (let key in component.props) {
    let type = 'string'
    const propTypeName = component.props[key]._vueTypes_name

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
      name: key,
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
  const attributes = []
  for (let key in component.props) {
    let type = 'string'
    const propTypeName = component.props[key]._vueTypes_name

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

    if (PropTypes)
      attributes.push({
        name: key,
        value: {
          kind: 'expression',
          type: type
        },
      })
  }

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

const prettyResult = JSON.stringify(webTypes, null, 2)
let st = Input.__proto__.toString()

console.log(st)
