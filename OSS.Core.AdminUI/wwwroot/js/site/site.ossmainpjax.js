var OssMainPjax = {

    instance: null,

    changeAddressTo: function (url, title) {
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
      
        cssLoading: function (con) {
            OssTips.hide(); //  关闭加载框

            OssPjaxEvents.pageReplace(con);
            OssPjaxEvents.reset();

            $("#oss-header").empty().append(con.subcss);
            con.css = [];
        },
        scriptLoading: function (con) {
            var vueTemp = con.content.find("template[oss-vue]").remove();

            $("#oss-scripts").empty().append(vueTemp).append(con.scripts);
            con.scripts =  [];
        },

        trans: function ($new, $old, done) { OssPjaxEvents.trans($new, $old, done); },
        complete: function (newState) {
            OssPjaxEvents.pageLoaded(newState);
        }
    },

    start: function () {
        var ossMainPjax = this;

        // 初始化实例
        ossMainPjax.instance = $("#oss-wraper").osspjax({
            wraper: "#oss-wraper",
            noQuery: OssPjaxEvents.getPjaxUrl,
            nameSpc: "oss-container",
            method: ossMainPjax.events
        });

        // 定义全局goTo方法
        window.goToMain = function (url, title) {
            ossMainPjax.instance.osspjax("goTo", { url: url, title: title });
        };

        // 执行第一次页面事件
        var curState = ossMainPjax.instance.osspjax("state");
        OssPjaxEvents.firstPageLoad(curState);
    }
};