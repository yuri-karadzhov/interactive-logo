'use strict';

import gulp from 'gulp';
import plugins from 'gulp-load-plugins';

const $$ = plugins();

// import buffer from 'vinyl-buffer';
import del from 'del';
// import source from 'vinyl-source-stream';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import yargs from 'yargs';

const argv = yargs
  .alias('p', 'production')
  .argv;

import cfg from './build.config';
import wpCfg from './webpack.config.babel';

const IS_DEVELOPMENT = argv.p || process.env.NODE_ENV === 'development';

gulp.task('default', ['watch']);

gulp.task('watch', () => {
  var config = Object.create(wpCfg);
  config.entry.index.unshift('webpack-dev-server/client?http://localhost:8080/');

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(config), {
		stats: {
			colors: true
		}
	}).listen(8080, 'localhost', function(err) {
		if(err) throw new $$.util.PluginError('webpack-dev-server', err);
		$$.util.log('[webpack-dev-server]', 'http://localhost:8080/');
	});
});

gulp.task('build', (cb) => {
  webpack(wpCfg, (err, stats) => {
    if(err) throw new $$.util.PluginError('webpack', err);
    $$.util.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));
    cb();
  });
});

gulp.task('clean', () => {
  // TODO move path to config
  return del('./dist');
});

gulp.task('lint', ['lint:code', 'lint:style', 'lint:template']);

gulp.task('code:lint', ['lint:code']);
gulp.task('lint:code', () => {
  return gulp.src(cfg.code.src, {base: './'})
    .pipe($$.plumber({
      errorHandler: $$.notify.onError(err => ({
        title: 'Code Lint',
        message: err.message
      }))
    }))
    .pipe($$.cached('lint:code'))
    .pipe($$.jscs({
      configPath: cfg.ext.jscs,
      fix: true
    }))
    .pipe($$.jshint(cfg.ext.jshint))
    .pipe($$.jshint.reporter('jshint-stylish'))
    .pipe($$.jshint.reporter('fail'));
});

gulp.task('style:lint', ['lint:style']);
gulp.task('lint:style', function() {
  return gulp.src(cfg.style.src)
    .pipe($$.plumber({
      errorHandler: $$.notify.onError(err => ({
        title: 'Style Lint',
        message: err.message
      }))
    }))
    .pipe($$.cached('lint:style'))
    .pipe($$.sassLint())
    .pipe($$.sassLint.format())
    .pipe($$.sassLint.failOnError());
});

gulp.task('template:lint', ['lint:template']);
gulp.task('lint:template', function() {
  return gulp.src([cfg.template.src, cfg.template.main])
    .pipe($$.plumber({
      errorHandler: $$.notify.onError(err => ({
        title: 'Template Lint',
        message: err.message
      }))
    }))
    .pipe($$.cached('lint:template'))
    .pipe($$.html5Lint());
});
