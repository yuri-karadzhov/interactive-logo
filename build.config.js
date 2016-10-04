var fs = require('fs');

module.exports = {
  code: {
    src: 'src/**/*.js',
    main: 'src/index.js',
    name: 'index.js',
    dst: 'dist',
    clean: [
      'dist/**/*.js',
      'dist/**/*.js.map'
    ],
    map: './'
  },
  style: {
    src: 'src/**/*.scss',
    main: 'src/index.scss',
    dst: 'dist',
    clean: [
      'dist/**/*.css',
      'dist/**/*.css.map'
    ],
    map: './'
  },
  template: {
    src: 'src/**/*.view.html',
    main: 'src/index.html',
    module: 'templatesCache',
    mainDst: 'dist',
    inject: '<!-- inject:vendor:{{ext}} -->',
    dst: 'dist',
    min: {
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: false,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true
    },
    clean: [
      'dist/**/*.html',
      'dist/templates.js'
    ]
  },
  font: {
    dst: 'dist/fonts',
    clean: 'dist/fonts'
  },
  image: {
    src: 'src/img/**/*',
    dst: 'dist/img',
    clean: 'dist/img'
  },
  ext: {
    eslint: '.eslintrc',
    browserslist: 'browserslist'
  },
  static: {
    port: 8000,
    livereload: true
  }
};
