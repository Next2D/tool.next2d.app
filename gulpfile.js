const gulp        = require("gulp");
const concat      = require("gulp-concat");
const uglify      = require("gulp-uglify-es").default;
const cleanCSS    = require("gulp-clean-css");
const rename      = require("gulp-rename");
const browserSync = require("browser-sync").create();
const TestServer  = require("karma").Server;
const preprocess  = require("gulp-preprocess");
const minimist    = require("minimist");
const fs          = require("fs-extra");
const replace     = require("gulp-replace");
const htmlMin     = require("gulp-htmlmin");
const ejs         = require("gulp-ejs");
const eslint      = require("gulp-eslint");

const options = minimist(process.argv.slice(2), {
    "boolean": [ "prodBuild" ],
    "string": ["distPath", "version"],
    "default": {
        "prodBuild": false,
        "version": "0.72.0",
        "distPath": "."
    }
});

/**
 * @description HTMLをminifyして出力
 * @return {*}
 * @public
 */
const buildHTML = () =>
{
    const ejsList = [
        "src/html/html-start.ejs",
        "src/html/head-start.ejs",
        "src/html/head.ejs",
        "src/html/head-google-tag.ejs",
        "src/html/head-end.ejs",
        "src/html/body-start.ejs",
        "src/html/tool.ejs",
        "src/html/view-start.ejs",
        "src/html/tab.ejs",
        "src/html/screen.ejs",
        "src/html/timeline.ejs",
        "src/html/view-end.ejs",
        "src/html/controller-start.ejs",
        "src/html/controller-tab.ejs",
        "src/html/controller-area-start.ejs",
        "src/html/controller-area-property-start.ejs",
        "src/html/controller-object-area-start.ejs",
        "src/html/controller-ease.ejs",
        "src/html/controller-video.ejs",
        "src/html/controller-text.ejs",
        "src/html/controller-transform.ejs",
        "src/html/controller-reference.ejs",
        "src/html/controller-color.ejs",
        "src/html/controller-nine-slice.ejs",
        "src/html/controller-fill-color.ejs",
        "src/html/controller-loop.ejs",
        "src/html/controller-blend.ejs",
        "src/html/controller-filter.ejs",
        "src/html/controller-object-area-end.ejs",
        "src/html/controller-area-property-end.ejs",
        "src/html/controller-area-library.ejs",
        "src/html/controller-area-js.ejs",
        "src/html/controller-area-plugin.ejs",
        "src/html/controller-area-end.ejs",
        "src/html/controller-ad-start.ejs",
        "src/html/controller-google-tag.ejs",
        "src/html/controller-ad-end.ejs",
        "src/html/controller-end.ejs",
        "src/html/confirm-modal.ejs",
        "src/html/screen-menu.ejs",
        "src/html/plugin-modal.ejs",
        "src/html/editor-modal.ejs",
        "src/html/timeline-menu.ejs",
        "src/html/timeline-layer-menu.ejs",
        "src/html/library-menu.ejs",
        "src/html/library-export-modal.ejs",
        "src/html/user-setting.ejs",
        "src/html/shortcut-setting-menu.ejs",
        "src/html/detail-modal.ejs",
        "src/html/player-preview.ejs",
        "src/html/body-end.ejs",
        "src/html/html-end.ejs"
    ];

    const src = [];
    for (let idx = 0; ejsList.length > idx; ++idx) {

        const path = ejsList[idx];
        if (!options.prodBuild && path.indexOf("google") > -1) {
            continue;
        }

        src.push(path);
    }

    return gulp
        .src(src)
        .pipe(ejs())
        .pipe(concat("build.html"))
        .pipe(replace("###BUILD_VERSION###", options.version))
        .pipe(htmlMin({
            "collapseWhitespace" : true,
            "removeComments"     : true
        }))
        .pipe(concat("index.html"))
        .pipe(gulp.dest(options.distPath));
};

/**
 * @description 本番用の書き出し設定
 * @return {*}
 * @public
 */
const prodBuild = (done) =>
{
    options.prodBuild = true;
    done();
};

/**
 * @description ヘッダーの書き出し
 * @return {*}
 * @public
 */
const buildVersion = () =>
{
    return gulp
        .src("src/javascript/License.file")
        .pipe(replace("###BUILD_VERSION###", options.version))
        .pipe(replace("###BUILD_YEAR###", `${new Date().getFullYear()}`))
        .pipe(rename("src/javascript/License.build.file"))
        .pipe(gulp.dest("."));
};

/**
 * @description JavaScriptをまとめてminifyして出力
 * @return {*}
 * @public
 */
const buildJavaScript = () =>
{
    const build = gulp
        .src([
            "src/javascript/License.build.file",
            "src/javascript/Header.file",
            "src/languages/src/Language.js",
            "src/languages/src/*.js",
            "src/javascript/Util.replaced.js",
            "src/javascript/GlobalKeyboardCommand.js",
            "src/javascript/encoder/*.js",
            "src/javascript/instance/Instance.js",
            "src/javascript/instance/*.js",
            "src/javascript/filter/Filter.js",
            "src/javascript/filter/*.js",
            "src/javascript/parser/*.js",
            "src/javascript/WorkSpace.js",
            "src/javascript/event/*.js",
            "src/javascript/view/KeyboardCommand.js",
            "src/javascript/view/tool/*.js",
            "src/javascript/view/tool/defaultTool/BaseTool.js",
            "src/javascript/view/tool/defaultTool/DrawTool.js",
            "src/javascript/view/tool/defaultTool/*.js",
            "src/javascript/view/controller/BaseController.js",
            "src/javascript/view/controller/GradientFilterController.js",
            "src/javascript/view/**/*.js",
            "src/javascript/view/*.js",
            "src/javascript/external/*.js",
            "src/javascript/Footer.file"
        ])
        .pipe(concat("next2d-tool.min.js"))
        .pipe(preprocess({
            "context": {
                "DEBUG": !options.prodBuild
            }
        }));

    // if (options.prodBuild) {
    //     build.pipe(uglify({ "output": { "comments": /^!/ } }));
    // }

    return build.pipe(gulp.dest(`${options.distPath}/assets/js/`));
};

/**
 * @description Workerの処理をminify化
 * @return {*}
 * @public
 */
const buildWorker = () =>
{
    return gulp
        .src([
            "src/javascript/worker/*.js",
            "!src/javascript/worker/*.min.js"
        ])
        .pipe(uglify())
        .pipe(rename({ "extname": ".min.js" }))
        .pipe(gulp.dest("src/javascript/worker"));
};

/**
 * @description Workerの処理をUtilに結合
 * @return {*}
 * @public
 */
const buildUtil = () =>
{
    return gulp
        .src("src/javascript/Util.js")
        .pipe(replace("###UNZIP_WORKER###",        fs.readFileSync("src/javascript/worker/UnzipWorker.min.js",       "utf8").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "")))
        .pipe(replace("###ZLIB_DEFLATE_WORKER###", fs.readFileSync("src/javascript/worker/ZlibDeflateWorker.min.js", "utf8").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "")))
        .pipe(replace("###UNLZMA_WORKER###",       fs.readFileSync("src/javascript/worker/UnLzmaWorker.min.js",      "utf8").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "")))
        .pipe(replace("###PARSER_WORKER###",       fs.readFileSync("src/javascript/worker/SwfParserWorker.min.js",   "utf8").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "")))
        .pipe(replace("###ZLIB_INFLATE_WORKER###", fs.readFileSync("src/javascript/worker/ZlibInflateWorker.min.js", "utf8").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "")))
        .pipe(rename("src/javascript/Util.replaced.js"))
        .pipe(gulp.dest("."));
};

/**
 * @description StyleSheetをまとめてminifyして出力
 * @return {*}
 * @public
 */
const buildStyleSheet = () =>
{
    return gulp
        .src([
            "src/stylesheet/main.css",
            "src/stylesheet/**/*.css"
        ])
        .pipe(cleanCSS())
        .pipe(concat("main.min.css"))
        .pipe(gulp.dest(`${options.distPath}/assets/css/`));
};

/**
 * @description local serverを起動
 * @return {void}
 * @public
 */
const browser = (done) =>
{
    browserSync.init({
        "server": {
            "baseDir": ".",
            "index": "index.html"
        },
        "reloadOnRestart": true
    });
    done();
};

/**
 * @description local serverを再読込
 * @return {void}
 * @public
 */
const reload = (done) =>
{
    browserSync.reload();
    done();
};

/**
 * @description ファイルを監視、変更があればビルドしてlocal serverを再読込
 * @return {void}
 * @public
 */
const watchFiles = () =>
{
    gulp
        .watch("src/**/*.css")
        .on("change", gulp.series(buildStyleSheet, reload));

    gulp
        .watch([
            "src/javascript/**/*.js",
            "../tool-language/src/*.js",
            "!src/javascript/worker/*.min.js",
            "!src/javascript/Util.replaced.js"
        ])
        .on("change", gulp.series(
            buildVersion,
            buildWorker,
            buildUtil,
            buildJavaScript,
            reload
        ));

    gulp
        .watch("src/html/**/*.ejs")
        .on("change", gulp.series(buildHTML, reload));
};

/**
 * @description ESLintを実行
 * @public
 */
const lint = () =>
{
    return gulp
        .src([
            "src/javascript/**/*.js"
        ])
        .pipe(eslint({ "useEslintrc": true }))
        // .pipe(eslint.format())
        .pipe(eslint.failOnError());
};

/**
 * @description テストを実行
 * @public
 */
const test = (done) =>
{
    return new TestServer({
        "configFile": `${__dirname}/karma.conf.js`,
        "singleRun": true
    }, done).start();
};

exports.default = gulp.series(
    buildVersion,
    buildWorker,
    buildUtil,
    buildJavaScript,
    buildStyleSheet,
    buildHTML,
    browser,
    watchFiles
);
exports.build = gulp.series(
    prodBuild,
    buildVersion,
    buildWorker,
    buildUtil,
    buildJavaScript,
    buildStyleSheet,
    buildHTML
);
exports.test = gulp.series(
    buildVersion,
    buildWorker,
    buildUtil,
    buildJavaScript,
    test
);
exports.lint  = gulp.series(lint);
