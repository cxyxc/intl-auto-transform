const manager = require('./manager');

const CallExpression = (t, filename, filepath, enterArray) => path => {
  if((path.node.callee.type === 'MemberExpression'
    && path.node.callee.property.name === 'getString') || 
  (path.node.callee.type === 'Identifier'
    && path.node.callee.name === 'getString')) {
    const value = path.node.arguments[0].value;
    if(value in manager.cache)
        return;
    let line = 0;
    enterArray.forEach((item, index) => {
        if(path.node.arguments[0].start <= item && line === 0)
            line = index + 1;
    });
    console.log('当前 key:', value, '未找到，请检查！\n', `${filepath}:${line}`);
  }
}

module.exports = (filename, filepath, enterArray) => function({ types: t }) {
    return {
      name: "intl-replace-plugin",
      visitor: {
        CallExpression: CallExpression(t, filename, filepath, enterArray),
      }
  };
};