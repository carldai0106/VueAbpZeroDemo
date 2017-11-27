// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    jquery: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // extends: [
  //   'eslint:recommended',
  //   'plugin:vue/recommended'
  // ],

  // required to lint *.vue files
  plugins: [
    'html'
    //,'vue/recommended'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    //add by carl
    semi: ['error', 'always'],
    indent: 0,
    'space-before-function-paren': 0,
    eqeqeq: 'off',
    'import/first': 'off'
  },
  globals: {
    abp: true,
    swal: true,
    Waves: true,
    // 'alert': true,
    // 'fetch': true,
    // 'localStorage': true,
    // 'jquery': true,
    // '$': true,
    // 'Exception': true,
    'lang': true,
    'Morris': true,
    'toastr': true
  }
};
