var OssRootPjax = {

    instance: null,

    changeAddressTo: function ( url, title) {
        var state = this.instance.osspjax("state");
        if (url)
            state.url = url;
        if (title)
            state.title = title;
        this.instance.osspjax("state", "pushState" , state);
    },

    events: {
        beforeRemote: OssPjaxEvents.beforeRemote,
        resultFilter: OssPjaxEvents.resultFilter,
        remoteError: OssPjaxEvents.remoteError,
        beforeFormat: function ($html, con) {
            con.subcss = $html.find("#oss-header").remove();
            con.subscripts = $html.find("#oss-scripts").remove();
        },
        cssLoading: function (con) {
            OssTips.hide(); //  关闭加载框

            OssPjaxEvents.pageReplace(con);
            OssPjaxEvents.reset();

            $("#oss-root-header").empty().append(con.css).append(con.subcss);
            con.css = con.subcss = [];
        },
        scriptLoading: function (con) {
            var vueTemp = con.content.find("template[oss-vue]").remove();
            $("#oss-root-scripts").empty().append(vueTemp);

            con.scripts.each(function (i, s) {
                $("#oss-root-scripts").append(s);
            });
            con.subscripts.each(function (i, s) {
                $("#oss-root-scripts").append(s);
            });
            con.scripts = con.subscripts = [];
        },

        trans: function ($new, $old, done) { OssPjaxEvents.trans($new, $old, done); },
        complete: function (newState) {
            OssPjaxEvents.pageLoaded(newState);
        }
    },

    start: function (isDev) {
        var ossRootPjax = this;

        // 初始化实例
        ossRootPjax.instance = $(document).osspjax({
            wraper: "#oss-root-wraper",
            noQuery: OssPjaxEvents.getPjaxUrl,
            nameSpc: "oss-root-container",
            method: ossRootPjax.events
        });

        // 定义全局goTo方法
        window.goToRoot = function (url, title) {
            ossRootPjax.instance.osspjax("goTo", { url: url, title: title });
        };

        if (!isDev) { //  自动获取版本
            OssApi.isDebug = false;
            var url = "/api/sys/opv";
            ossRootPjax.instance.osspjax("sysVer", { checkVer: true, serverUrl: url });
        }

        // 执行第一次页面事件
        var curState = ossRootPjax.instance.osspjax("state");
        OssPjaxEvents.firstPageLoad(curState);
    }
};