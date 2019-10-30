var OssPjaxMain = {

    instance: null,
    events: {
        beforeRemote: OssPjaxBase.beforeRemote,
        resultFilter: OssPjaxBase.resultFilter,
        remoteError: OssPjaxBase.remoteError,

        removeOld: function ($oldContainer) {
            OssPageMethods.beforeRemove($oldContainer);
            $oldContainer.remove();
            OssPjaxBase.resetPageMethods();
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
    }
};

$(function() {
    OssPjaxMain.start();
    $(".sidebar-toggler").on("click.oss", function() {
        const tName = $(this).attr("data-toggle");
        $(this).parents(".app.sidebar-fixed").toggleClass(tName);
    });
    $(".sidebar-minimizer").on("click.oss", function () {
        const $appSider = $(this).parents(".app.sidebar-fixed");
        $appSider.toggleClass("sidebar-minimized").toggleClass("sidebar-lg-show").toggleClass("sidebar-show");//.toggleClass();
    });
});