var OssPjaxEvents = {
   // /**
   //* 加载远程内容之前事件
   //* @param {} ajaxOpt  ajax请求相关参数，可以更改
   //*/
    beforeRemote: function(ajaxOpt) {},
    //**
    // * 内容替换或者页面执行前事件
    // * @param {} con {title内容,content,scripts}
    // * @returns {} 
    // */
    pageReplace: function(con) {},

    pageLoaded: function(newState) {},
    trans: function($new, $old, done) {},
    resultFilter: function(resData, textState, xhr) {
        if (typeof resData === "object" || xhr.getResponseHeader("Content-Type").startWith("application/json"))
            return false;
        return resData;
    },
    remoteError: function(eMsg, textState, xhr) {

        var contentType = xhr.getResponseHeader("Content-Type");
        if (textState === 'error') {
            OssTips.showTipError('当前请求出错，请检查网络或稍后再试!');
            return;
        }
        if ( contentType && contentType.startWith("application/json")) {
            if (typeof eMsg !== "object")
                eMsg = JSON.parse(eMsg);

            if (eMsg.ret === 1425) {
                window.goTo(eMsg.msg);
                return;
            }
            OssTips.showTipError(eMsg.msg);
            return;
        }
        OssTips.showTipError("当前请求超时,请稍后重试");
    },
    reset: function() {

        var defaultmethods = {
            beforeRemote: function() {},
            pageReplace: function() {},
            pageLoaded: function() {},
            trans: function($new, $old, done) {
                $old.hide(400);
                $new.fadeIn(1200, done);
            }
        };
        $.extend(this, defaultmethods);
    },
    firstPageLoad: function(stae) {
        if (!this.firstLoaded) {
            this.firstLoaded = true;
            this.pageLoaded(stae);
        }
    }
};

var OssPjax = {
    instance: null,

    changeState: function (action, url, title) {

        var state = this.instance.osspjax("state");
        if (url)
            state.url = url;

        if (title)
            state.title = title;

        this.instance.osspjax("state", action, state);
    },

    methods: {
        beforeRemote: function(ajaxOpt) {
            OssTips.showLoading(); //  开启加载框
            OssPjaxEvents.beforeRemote(ajaxOpt);
        },
        resultFilter: OssPjaxEvents.resultFilter,
        remoteError: OssPjaxEvents.remoteError,
        beforeFormat: function($html, con) {
            con.subcss = $html.find("#oss-sub-header").remove();
            con.subscripts = $html.find("#oss-sub-scripts").remove();
        },
        cssLoading: function(con) {
            OssTips.hide(); //  关闭加载框

            OssPjaxEvents.pageReplace(con);
            OssPjaxEvents.reset();

            $("#oss-header").empty().append(con.css).append(con.subcss);
            con.css = con.subcss = [];
        },
        scriptLoading: function(con) {
            var vueTemp = con.content.find("template[oss-vue]").remove();
            $("#oss-scripts").empty().append(vueTemp);

            con.scripts.each(function(i, s) {
                $("#oss-scripts").append(s);
            });
            con.subscripts.each(function(i, s) {
                $("#oss-scripts").append(s);
            });
            con.scripts = con.subscripts = [];
        },

        trans: function($new, $old, done) { OssPjaxEvents.trans($new, $old, done) },
        complete: function(newState) {
            OssTips.hide();
            OssPjaxEvents.pageLoaded(newState);
        }
    },

    start: function(isDev) {
        var ossPjax = this;
        // 初始化实例
        ossPjax.instance = $(document).osspjax({
            wraper: "#oss-page-wraper",
            noQuery: ossPjax._getViewUrl,
            nameSpc: "oss-pjax",
            method: ossPjax.methods
        });
        // 定义全局goTo方法
        window.goTo = function (url, title) {
            ossPjax.instance.osspjax("goTo", { url: url, title: title });
        };

        if (!isDev) { //  自动获取版本
            OssApi.isDebug = false;
            var url = "/api/sys/opv";
            ossPjax.instance.osspjax("sysVer", { checkVer: true, serverUrl: url });
        }

        // 执行第一次页面事件
        var curState = ossPjax.instance.osspjax("state");
        OssPjaxEvents.firstPageLoad(curState);
    },

    _getViewUrl: function (fullUrl) {

        let url = fullUrl;
        const index = url.indexOf("?");

        if (index > 0)
            url = url.substring(0, index);

        //if (url.indexOf("/t/") < 0) {
        //    url = OsTenant.getWebRoute() + url;
        //}

        return url;
    }
};