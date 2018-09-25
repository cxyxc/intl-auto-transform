const utils = require('./utils');

const CallExpression = (t, filename) => path => {
  if((path.node.callee.type === 'MemberExpression'
    && path.node.callee.property.name === 'getString') || 
  (path.node.callee.type === 'Identifier'
    && path.node.callee.name === 'getString')) {
      const fileKey = filename.split('.')[0];
      const value = `${utils.toHump(fileKey)}.${utils.transformStr(path.node.arguments[0].value)}`;
      path.node.arguments[0].value = value;
  }
}

module.exports = (filename, prefix) => function({ types: t }) {
    return {
      name: "intl-replace-plugin",
      visitor: {
        CallExpression: CallExpression(t, filename),
      }
  };
};