var gulp = require('gulp');
var gutil = require('gulp-util');


/* *************
	CSS
************* */

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');

var postcssProcessors = [
	autoprefixer( {
		browsers: ['last 2 versions']
	} )
];

var sassMainFile = 'src/css/main.scss';
var sassFiles = 'src/css/**/*.scss';

gulp.task('css', function() {
	gulp.src(sassMainFile)
		.pipe(
			postcss(postcssProcessors, {syntax: scss})
		)
		.pipe(
			sass({ outputStyle: 'compressed' })
			.on('error', gutil.log)
		)
		.pipe(gulp.dest('public/css'));
});



/* *************
	JS
************* */

var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var babel = require('gulp-babel');
var jsFiles = 'src/js/**/*.js';

gulp.task('js', function() {
	gulp.src('src/js/lib/*.js')
		.pipe(uglify())
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('public/js/lib/'));

	gulp.src('src/js/utils/*.js')
		.pipe(
			babel({ presets: ['es2015'] })
				.on('error', gutil.log)
		)
		.pipe(uglify())
		.pipe(concat('utils.js'))
		.pipe(gulp.dest('public/js'));

	gulp.src('src/js/main/*.js')
		.pipe(
			babel({ presets: ['es2015'] })
				.on('error', gutil.log)
		)
		//.pipe(uglify())
		.pipe(gulp.dest('public/js'));

	gulp.src('src/js/sw/*.js')
		.pipe(gulp.dest('public'));
});





/* *************
	HTML
************* */

var minifyHTML = require('gulp-minify-html');
var htmlFiles = 'src/*.html';

gulp.task('html', function() {
	return gulp.src(htmlFiles)
		.pipe(minifyHTML({ empty: true }))
		.pipe(gulp.dest('public'));
});


var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var templateFiles = 'src/templates/*.hbs';

gulp.task('templates', function () {
	gulp.src(templateFiles)
		.pipe(handlebars())
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'MyApp.templates',
			noRedeclare: true, // Avoid duplicate declarations
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('public/js/'));
});



/* *************
	SERVER
************* */

var connect = require('gulp-connect');

gulp.task('connect', function() {
	connect.server({
		port: 7200
	});
});




/* *************
	WATCH
************* */

gulp.task('watch', function() {
	gulp.watch(sassFiles,['css']);
	gulp.watch(jsFiles,['js']);
	gulp.watch(htmlFiles,['html']);
	gulp.watch(templateFiles, ['templates'])
});



/* *************
	DEFAULT
************* */

gulp.task('default', ['connect', 'css', 'js', 'html', 'templates', 'watch']);
