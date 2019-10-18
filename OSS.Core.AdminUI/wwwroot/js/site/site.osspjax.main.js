var OssPjaxMain = {

    instance: null,
    events: {
        beforeRemote: OssPjaxBase.beforeRemote,
        resultFilter: OssPjaxBase.resultFilter,
        remoteError: OssPjaxBase.remoteError,

        removeOld: function ($oldContainer) {
            $oldContainer.hide(380).remove();
            OssPjaxBase.resetPageMethods();
            // 清理直接通过浏览器打开 指定页面js内容
            $("#oss-main-scripts").remove();
        },
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
        ossPjaxMain.instance = $("#oss-main-page").osspjax({
            wraper: "#oss-main-wraper",
            nameSpc: "oss-main-pjax",
            fragment: "oss-main-container",

            noQuery: OssPjaxBase.getPjaxUrl,
            methods: ossPjaxMain.events
        });

        // 定义全局goTo方法
        window.goToMain = function (url, title) {
            ossPjaxMain.instance.osspjax("goTo", { url: url, title: title });
        };

        // 执行第一次页面事件
        var curState = ossPjaxMain.instance.osspjax("state");
        OssPjaxBase.firstPageLoad(curState);
    }
};

$(function() {
    OssPjaxMain.start();
});