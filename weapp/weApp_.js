"use strict";

function init() {
    var isDev = global.appConfig.isDev,
        TransConfigToPf = (require("./trans/transConfigToPf.js"),
            require("./trans/transWxmlToJs.js"),
            require("./trans/transWxmlToHtml.js"),
            require("./trans/transManager.js")),
        tools = require("./utils/tools.js"),
        Async = (require("async"), require("fs")),
        Path = require("path"),
        Url = require("url"),
        VenderMgr = require("./utils/vendorManager.js"),
        ProjectMgr = (require("glob"), require("./utils/projectManager.js")),
        AppServiceConfig = require("../config/appserviceConfig.js"),
        ProjectStores = require("../stores/projectStores.js"),
        WindowStores = require("../stores/windowStores.js"),
        ErrorTpl = require("./tpl/errorTpl.js"),
        AppServiceErrorTpl = require("./tpl/appserviceErrorTpl.js"),
        asdebugPath = Path.join(__dirname, "appservice/asdebug.js"),
        Asdebug = Async.readFileSync(asdebugPath, "utf8");
    tools.noBrowser.join(",");
    _exports.getAppservice = function (_url, callback) {
        var project = tools.getProject(_url),
            url = Url.parse(_url),
            pathname = url.pathname,
            isAppService = /appservice$/.test(pathname),
            isAppserviceSdk = /appservice-sdk\.js$/.test(pathname),
            isAsDegug = /asdebug\.js$/.test(pathname),
            isAsCheck = /ascheck\.js$/.test(pathname),
            isWebNode = /webnode\.js$/.test(pathname),
            isReporterSdk = /reporter-sdk\.js/.test(pathname),
            isAppServiceEngine = /app_service_engine\.js/.test(pathname),
            isJsMap = (/\.js$/.test(pathname), /\.js\.map$/.test(pathname)),
            isWAService = /WAService\.js/.test(pathname),
            projectName = (project.appname.toLowerCase(), project.appid.toLowerCase(), project.hash),
            config = void 0;
        try {
            config = tools.getProjectConfig(project)
        } catch (y) {
            var N = ErrorTpl.replace(/{{error}}/g, function () {
                return JSON.stringify(y)
            });
            return void callback(500, {}, N)
        }
        var R = ProjectStores.getProjectConfig(project);
        config.projectConfig = R, config.appserviceConfig = AppServiceConfig;
        var $ = config.pages || [];
        isAppService ? ! function () {
            var r = require("./tpl/appserviceTpl.js"),
                s = "http://" + projectName + ".appservice.open.weixin.qq.com/",
                t = [],
                i = [],
                p = [];
            ProjectMgr.getAllJSFileList(project, function (n, files) {
                for (var c = {}, a = 0, l = $.length; a < l; a++) {
                    var j = $[a] + ".js";
                    c[j] = !0, t.push("<script>__wxRoute = '" + $[a] + "';__wxRouteBegin = true</script>"), t.push('<script src="' + s + j + '"></script>')
                }
                for (var index = 0, d = files.length; index < d; index++) {
                    var file = files[index];
                    c[file] || ("app.js" === file ? p.push('<script src="' + s + file + '"></script>') : i.push('<script src="' + s + file + '"></script>'))
                }
                t = i.concat(p).concat(t), isDev ? (t.unshift('<script src="' + s + 'app_service_engine.js"></script>'), t.unshift('<script src="' + s + 'reporter-sdk.js"></script>'), t.unshift('<script src="' + s + 'appservice-sdk.js"></script>'), t.unshift('<script src="' + s + 'webnode.js"></script>')) 
                : t.unshift('<script src="' + s + 'WAService.js"></script>'),
                
                 t.unshift('<script src="' + s + 'asdebug.js"></script>'), config.appname = project.appname, config.appid = project.appid, config.apphash = project.hash, config.isTourist = project.isTourist, project.isTourist && (config.userInfo = WindowStores.getUserInfo()), t.unshift("<script>var __wxConfig = " + JSON.stringify(config) + "</script>"), r = r.replace("<script></script>", t.join("")), callback(null, {}, r)
            })
        } () : isWAService ?
         callback(null, {}, VenderMgr.getFile("WAService.js")) : 
         isReporterSdk ?
          callback(null, {}, VenderMgr.getFile("reporter-sdk.js")) :
          isAppServiceEngine ? 
          callback(null, {}, VenderMgr.getFile("app_service_engine.js")) : 
          isAppserviceSdk ? 
          callback(null, {}, VenderMgr.getFile("appservice-sdk.js")) : 
          isAsDegug ? 
          callback(null, {}, Asdebug) : 
          isAsCheck ?
           callback(null, {}, asCheck) :
            isWebNode ?
             callback(null, {}, VenderMgr.getFile("webnode.js")) :
              isJsMap ? ! function () {
            var e = Path.join(project.projectpath, pathname);
            Async.readFile(e, function (r, s) {
                return r ? void callback(404, {}, "do not find " + e) : void callback(200, {}, s)
            })
        } () : ! function () {
            var e = _url.replace("http://" + projectName + ".appservice.open.weixin.qq.com/", "");
            ProjectMgr.getScripts({
                project: project,
                fileName: e,
                needRequire: "app.js" === e || $.indexOf(e.replace(/\.js/, "")) !== -1
            }, function (r, s) {
                if (r)
                    if (s) callback(null, {
                        "es6-error": encodeURIComponent(JSON.stringify(r.e)),
                        "es6-errorfile": encodeURIComponent(JSON.stringify(r.sourceFileName))
                    }, s);
                    else {
                        var t = AppServiceErrorTpl.replace("{{error}}", r.toString().replace(/\\/g, "/")).replace("{{fileName}}", e);
                        callback(null, {}, t)
                    }
                else callback(null, {
                    "Content-Type": "text/javascript; charset=UTF-8"
                }, s)
            })
        } ()
    }, _exports.getResponse = function (e, s) {
        TransConfigToPf.getResponse(e, s)
    }
}
var _exports = {};
init(), module.exports = _exports;