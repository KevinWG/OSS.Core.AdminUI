var OssPjaxMain = {

    instance: null,
    events: {
        beforeRemote: OssPjaxEvents.beforeRemote,
        resultFilter: OssPjaxEvents.resultFilter,
        remoteError: OssPjaxEvents.remoteError,
      
        cssLoading: function (con) {
            OssTips.hide(); //  关闭加载框

            OssPageMethods.pageReplace(con);
            OssPjaxEvents.resetPageMethods();

            $("#oss-main-header").empty().append(con.mainCss);
            con.css = [];
        },
        scriptLoading: function (con) {
            $("#oss-main-scripts").empty().append(con.scripts);
            con.scripts =  [];
        },

        trans: function ($new, $old, done) { OssPageMethods.trans($new, $old, done); },
        complete: function (newState) {
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

    start: function () {
        var ossPjaxMain = this;

        // 初始化实例
        ossPjaxMain.instance = $("#oss-root-wraper").osspjax({
            wraper: "#oss-main-wraper",
            nameSpc: "oss-main-pjax",
            fragment: "oss-main-container",

            noQuery: OssPjaxEvents.getPjaxUrl,
            method: ossPjaxMain.events
        });

        // 定义全局goTo方法
        window.goToMain = function (url, title) {
            ossPjaxMain.instance.osspjax("goTo", { url: url, title: title });
        };

        // 执行第一次页面事件
        var curState = ossPjaxMain.instance.osspjax("state");
        OssPjaxEvents.firstPageLoad(curState);
    }
};

$(function() {
    OssPjaxMain.start();
});