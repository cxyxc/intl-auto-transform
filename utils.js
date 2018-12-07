function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4());
}

// 是否包含中文
function hasChinese(str) {
    return escape(str).indexOf('%u') !== -1
}

// 是否是大写字母
function isBF(str) {
    return str >= 'A' && str <= 'Z'; 
}

function pathInReact(path) {
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
    return isInReact;
}


// formatMessage()
const formatMessageT =  (t, key, chinese) => t.callExpression(t.identifier('formatMessage'), [
  t.objectExpression([
    t.objectProperty(
      t.identifier('id'),
      t.stringLiteral(key)
    ),
    t.objectProperty(
      t.identifier('defaultMessage'),
      t.stringLiteral(chinese)
    )
  ])
]);

// this.props.intl.formatMessage()
const propsFormatMessageT = (t, key, chinese) => t.callExpression(
  t.memberExpression(
    t.memberExpression(
      t.memberExpression(
        t.thisExpression(),
        t.identifier('props')
      ),
      t.identifier('intl')
    ),
    t.identifier('formatMessage')
  ),
  [t.objectExpression([
    t.objectProperty(
      t.identifier('id'),
      t.stringLiteral(key)
    ),
    t.objectProperty(
      t.identifier('defaultMessage'),
      t.stringLiteral(chinese)
    )
  ])]
);

// 首字母大写转为驼峰
function toHump(string) {
  return `${string.slice(0, 1).toLocaleLowerCase()}${string.slice(1)}`;
}

module.exports = {
    guid,
    hasChinese,
    isBF,
    toHump,
    pathInReact,
    formatMessageT,
    propsFormatMessageT
};