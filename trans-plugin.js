const manager = require('./manager');
const utils = require('./utils');

const CallExpression = (t, filename) => path => {
  if(path.node.callee.type === 'MemberExpression'
  && path.node.callee.property.name === 'getString') {
      console.log(path.node.arguments[0].value);
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