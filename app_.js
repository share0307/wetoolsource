"use strict";

function init() {
    var react = require("../dist/lib/react.js"),
        reactDom = require("../dist/lib/react-dom.js"),
        init = require("../dist/common/loadInit/init.js"),
        Controller = require("../dist/components/ContainController.js"),
        startProxy = require("../dist/common/proxy/startProxy.js"),
        windowAction = require("../dist/actions/windowActions.js"),
        webviewAction = require("../dist/actions/webviewActions.js"),
        WebviewStores = require("../dist/stores/webviewStores.js"),
        log = require("../dist/common/log/log.js"),
        shortCut = require("../dist/common/shortCut/shortCut.js"),
        l = global.appConfig.isDev;
    if ("darwin" === process.platform) {
        var Menu = require("../dist/common/menu/menu.js");
        nw.Window.get().menu = Menu
    }
    nw.App.on("open", function(n) {
        var e = tools.getArgsURL(n);
        if (e) {
            log.info("index.js Reopen App with url: " + e);
            var i = WebviewStores.getCurrentWebviewID();
            webviewAction.getA8keyWebview(i, {
                url: e,
                isSync: !0,
                from: "urlbar"
            })
        }
        nw.Window.get().focus()
    }), nw.App.argv.indexOf("inspect") !== -1 && tools.openInspectWin();
    var argsUrl = tools.getArgsURL(nw.App.argv);
    argsUrl && (log.info("index.js Open App with url: " + argsUrl), webviewAction.setInitURL(argsUrl)), shortCut.register(), global.weinreWin = {};
    var timer = void 0;
    window.addEventListener("resize", function() {
        timer = setTimeout(function() {
            clearTimeout(timer), windowAction.resize(document.body.offsetHeight)
        }, 20)
    }), window.addEventListener("keydown", function(n) {
        var e = n.keyCode;
        123 === e && (windowAction.changeDevtools(), n.preventDefault())
    }), !l && window.addEventListener("contextmenu", function(n) {
        n.preventDefault()
    }), Win.on("focus", function() {
        windowAction.focus(), shortCut.register()
    }), Win.on("blur", function() {
        windowAction.blur(), shortCut.unRegister()
    }), Win.on("navigation", function(n, e, i) {
        log.info("index.js navigation " + e + " ignore"), nw.Shell.openExternal(e), i.ignore()
    }), Win.on("new-win-policy", function(n, e, i) {
        log.info("index.js new-win-policy " + e + " ignore"), i.ignore()
    }), Win.on("close", function() {
        log.info("index.js close"), process.exit()
    }), Win.setMinimumSize(nw.App.manifest.window.width, nw.App.manifest.window.height), startProxy(function(t) {
        init(), log.info("index.js init proxy with " + t + " success!!");
        var s = function() {
            windowAction.resize(document.body.offsetHeight), reactDom.render(react.createElement(Controller, null), document.querySelector("#container"))
        };
        "complete" === document.readyState ? s() : window.addEventListener("load", s)
    })
}
var tools = require("../dist/utils/tools.js"),
    Win = nw.Window.get();
global.Win = Win, global.appConfig = tools.getAppConfig(), global.contentDocument = document, global.contentDocumentBody = document.body, global.contentWindow = window, tools.up(init);