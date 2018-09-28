const manager = require('./manager');

const CallExpression = (t, filename, filepath) => path => {
  if((path.node.callee.type === 'MemberExpression'
    && path.node.callee.property.name === 'getString') || 
  (path.node.callee.type === 'Identifier'
    && path.node.callee.name === 'getString')) {
    const value = path.node.arguments[0].value;
    if(value in manager.cache)
        return;
    console.log('当前 key:', value, '未找到，请检查！\n', `${filepath}:${path.node.arguments[0].start}`);
  }
}

module.exports = (filename, filepath) => function({ types: t }) {
    return {
      name: "intl-replace-plugin",
      visitor: {
        CallExpression: CallExpression(t, filename, filepath),
      }
  };
};