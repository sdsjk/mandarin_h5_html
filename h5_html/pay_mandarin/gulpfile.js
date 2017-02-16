var gulp = require("gulp"),
	connect = require("gulp-connect");

gulp.task("connect", function () {
	connect.server({
		port: 8088,
		hostname: '127.0.0.1',
		base: '',
		open: {
			target: 'http://localhost:8088/html/index.html',
			appName: 'Chrome',
			callback: function () {
			}
		},
		livereload: true
	})
})

gulp.task('default', ['connect']);