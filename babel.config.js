const plugins = ['@babel/plugin-proposal-optional-chaining'];

if (process.env.CODE_COVERAGE === 'true') {
  plugins.push('istanbul');
  console.log('ATTENTION: istabul included');
} else {
  console.log('ATTENTION: istanbul not included');
}

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: plugins,
};
