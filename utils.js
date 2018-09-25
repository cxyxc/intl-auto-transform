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

// 首字母大写转为驼峰
function toHump(string) {
  return `${string.slice(0, 1).toLocaleLowerCase()}${string.slice(1)}`;
}

// 下划线转驼峰
function transformStr(str){
  const re = /_(\w)/g;
  return str.toLowerCase().replace(re, function ($0, $1){
      return $1.toUpperCase();
  });
}

module.exports = {
    guid,
    hasChinese,
    isBF,
    toHump,
    pathInReact,
    getStringT,
    propsGetStringT,
    transformStr
};