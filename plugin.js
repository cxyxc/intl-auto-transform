const manager = require('./manager');
const utils = require('./utils');
const TemplateLiteral = require('./visitor/TemplateLiteral');

const LOCALIZE = 'localize';

// getString()
const getStringT =  (t, key) => t.callExpression(t.identifier('getString'), [t.stringLiteral(key)]);

// this.props.getString()
const propsGetStringT = (t, key) => t.callExpression(
  t.memberExpression(
    t.memberExpression(
      t.thisExpression(),
      t.identifier('props')
    ),
    t.identifier('getString')
  ),
  [t.stringLiteral(key)]
);


const Literal = ({t, filename}) => path => {
  if(!utils.hasChinese(path.node.value)) return;
  const key = manager.setCache(filename, path.node.value);
  
  // 父节点是 JSX 属性时
  if(path.parent.type === 'JSXAttribute') {
    path.replaceWith(
        t.jSXExpressionContainer(
          propsGetStringT(t, key)
        )
    );
    return ;
  }

  let isInReact = false;
  // 寻找并判断当前是否在 React 组件内部    
  path.findParent(parentPath => {
    if(parentPath.isClassDeclaration() &&
      parentPath.node.superClass
    ) {
      // 此处认为在 Class 内部且有 superClass 即为组件
      // TODO: 完善此处逻辑
      isInReact = true;
    }
  });

  if(isInReact) {
    path.replaceWith(propsGetStringT(t, key));
    return;
  } 

  path.replaceWith(getStringT(t, key));
  return ;
}

const JSXText = ({t, filename}) => path => {
  if(!utils.hasChinese(path.node.value)) return;
  const key = manager.setCache(filename, path.node.value);
  path.replaceWith(
    t.jSXExpressionContainer(propsGetStringT(t, key))
  );
};

const Identifier = ({t, filename}) => path => {
  let flag = false;
  path.findParent(parentPath => {
    if(parentPath.isCallExpression() && parentPath.node.callee.name === LOCALIZE) {
      // 发现已添加 localize()
      flag = true; return;
    }
  });
  if(flag) return;
  if (path.node.name === filename.split('.')[0]) {
    path.findParent(parentPath => {
      if(parentPath.isExportDefaultDeclaration()) {
        // 对 export default 的组件进行 localize 包裹
        // 此处认为大写字母开头的为组件
        if(utils.isBF(path.node.name[0])) {
          path.replaceWith(
            t.callExpression(t.identifier(LOCALIZE), [path.node])
          );
        }
      }
    })

    return;
  }
};

const ImportDeclaration = ({t, filename, prefix}) => path => {
  if (path.node.source.value === 'react') {
    // 在 import react 后添加 import localize
    path.insertAfter(
      t.importDeclaration([
        t.importSpecifier(t.identifier(LOCALIZE), t.identifier(LOCALIZE))
      ], t.stringLiteral(`${prefix}${LOCALIZE}`))
    );
  }
}

const AssignmentExpression = ({t, filename}) => path => {
  // 寻找 propTypes 添加 getString
  if (path.node.left.type === 'MemberExpression' &&
    path.node.left.property.type === 'Identifier' &&
    path.node.left.property.name === 'propTypes') {
      let flag = false;
      path.node.right.properties.forEach(element => {
        if(element.type === 'ObjectProperty' && element.key.name === 'getString')
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
              t.identifier('getString'),
              t.memberExpression(t.identifier('PropTypes'), t.identifier('func'))
            )
          ])
        )
      );
  }
};

module.exports = (filename, prefix) => function({ types: t }) {
    manager.cache[filename] = {};
    return {
      name: "intl-replace-plugin",
      visitor: {
        Literal: Literal({t, filename}),
        JSXText: JSXText({t, filename}),
        // 处理字符串模板
        TemplateLiteral: TemplateLiteral({t, filename}),
        // 获取到导出组件的语句
        Identifier: Identifier({t, filename}),
        // 添加 import {localize} from '...';
        ImportDeclaration: ImportDeclaration({t, filename, prefix}),
        // 处理 propTypes
        AssignmentExpression: AssignmentExpression({t, filename}),
      }
  };
};