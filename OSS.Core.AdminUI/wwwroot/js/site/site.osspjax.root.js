var OssPjaxRoot = {
    instance: null,
    events: {
        beforeRemote: OssPjaxEvents.beforeRemote,
        resultFilter: OssPjaxEvents.resultFilter,
        remoteError: OssPjaxEvents.remoteError,

        beforeFormat: function ($html, con) {
            con.mainCss = $html.find("#oss-main-header").remove();
            con.mainScripts = $html.find("#oss-main-scripts").remove();
        },
        cssLoading: function(con) {
            OssTips.hide(); //  关闭加载框

            OssPageMethods.pageReplace(con);
            OssPjaxEvents.resetPageMethods();

            $("#oss-root-header").empty().append(con.css).append(con.mainCss);
            con.css = con.mainCss = [];
        },
        scriptLoading: function(con) {
            con.scripts.each(function(i, s) {
                $("#oss-root-scripts").append(s);
            });
            con.mainScripts.each(function(i, s) {
                $("#oss-root-scripts").append(s);
            });
            con.scripts = con.mainScripts = [];
        },

        trans: function($new, $old, done) { OssPageMethods.trans($new, $old, done); },
        complete: function(newState) {
            OssPageMethods.pageLoaded(newState);
        }
    },
    changeAddressTo: function (url, title) {
        var state = this.instance.osspjax("state");
        if (url)
            state.url = url;
        if (title)
            state.title = title;
        this.instance.osspjax("state", "pushState", state);
    },

    start: function(isDev) {
        var ossRootPjax = this;

        // 初始化实例
        ossRootPjax.instance = $(document).osspjax({
            wraper: "#oss-root-wraper",
            nameSpc: "oss-root-pjax",
            fragment: "oss-root-container",

            noQuery: OssPjaxEvents.getPjaxUrl,
            method: ossRootPjax.events
        });

        // 定义全局goTo方法
        window.goToRoot = function(url, title) {
            ossRootPjax.instance.osspjax("goTo", { url: url, title: title });
        };

        if (!isDev) { //  自动获取版本
            var url = "/api/sys/opv";
            ossRootPjax.instance.osspjax("sysVer", { checkVer: true, serverUrl: url });
        }

        // 执行第一次页面事件
        var curState = ossRootPjax.instance.osspjax("state");
        OssPjaxEvents.firstPageLoad(curState);
    }
};

