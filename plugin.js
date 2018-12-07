const manager = require('./manager');
const utils = require('./utils');
const TemplateLiteral = require('./visitor/TemplateLiteral');

const INTL = 'injectIntl';

const Literal = (t, filename) => path => {
  if(!utils.hasChinese(path.node.value)) return;
  let flag = false;
  path.findParent(path => {
    if(path.isProperty() && path.node.key.name === 'defaultMessage')
      flag = true;
  });
  if(flag) return;
  const chinese = path.node.value;
  const key = manager.setCache(path, filename, chinese);
  
  // 父节点是 import 语句时不做处理
  if(path.parent.type === 'ImportDeclaration') return;

  // 父节点是 JSX 属性时
  if(path.parent.type === 'JSXAttribute') {
    path.replaceWith(
        t.jSXExpressionContainer(
          utils.propsFormatMessageT(t, key, chinese)
        )
    );
    return ;
  }

  let isInReact = utils.pathInReact(path);

  if(isInReact) {
    path.replaceWith(utils.propsFormatMessageT(t, key, chinese));
    return;
  }

  path.replaceWith(utils.formatMessageT(t, key, chinese));
  return ;
}

const JSXText = (t, filename) => path => {
  const chinese = path.node.value;
  if(!utils.hasChinese(path.node.value)) return;
  const key = manager.setCache(path, filename, chinese);
  path.replaceWith(
    t.jSXExpressionContainer(utils.propsFormatMessageT(t, key, chinese))
  );
};

const Identifier = (t, filename) => path => {
  let flag = false;
  path.findParent(parentPath => {
    if(parentPath.isCallExpression() && parentPath.node.callee.name === INTL) {
      // 发现已添加 injectIntl()
      flag = true; return;
    }
  });
  if(flag) return;
  if (path.node.name === filename.split('.')[0]) {
    path.findParent(parentPath => {
      if(parentPath.isExportDefaultDeclaration()) {
        // 针对 export default class XXX {} 的处理
        if(parentPath.node.declaration.type === 'ClassDeclaration') {
          // TODO: 暂不处理这种情况
          return;
        }

        // 对 export default 的组件进行 intl 包裹
        // 此处认为大写字母开头的为组件
        if(utils.isBF(path.node.name[0])) {
          path.replaceWith(
            t.callExpression(t.identifier(INTL), [path.node])
          );
        }
      }
    })

    return;
  }
};

const ImportDeclaration = (t, filename, prefix) => path => {
  if (path.node.source.value === 'react') {
    // 在 import react 后添加 import intl
    path.insertAfter(
      t.importDeclaration([
        t.importSpecifier(t.identifier(INTL), t.identifier(INTL))
      ], t.stringLiteral(`${prefix}intl`))
    );
  }
}

const AssignmentExpression = (t, filename) => path => {
  // 寻找 propTypes 添加 intl
  if (path.node.left.type === 'MemberExpression' &&
    path.node.left.property.type === 'Identifier' &&
    path.node.left.property.name === 'propTypes') {
      let flag = false;
      path.node.right.properties.forEach(element => {
        if(element.type === 'ObjectProperty' && element.key.name === 'intl')
          flag = true;
      });
      if(flag) return;

      path.replaceWith(
        t.assignmentExpression(
          '=',
          path.node.left,
          t.objectExpression([
            ...path.node.right.properties,
            t.objectProperty(
              t.identifier('intl'),
              t.memberExpression(t.identifier('PropTypes'), t.identifier('object'))
            )
          ])
        )
      );
  }
};

module.exports = (filename, prefix) => function({ types: t }) {
    return {
      name: "intl-replace-plugin",
      visitor: {
        Literal: Literal(t, filename),
        JSXText: JSXText(t, filename),
        // 处理字符串模板
        TemplateLiteral: TemplateLiteral(t, filename),
        // 获取到导出组件的语句
        Identifier: Identifier(t, filename),
        // 添加 import {intl} from '...';
        ImportDeclaration: ImportDeclaration(t, filename, prefix),
        // 处理 propTypes
        AssignmentExpression: AssignmentExpression(t, filename),
      }
  };
};