var OssPjaxRoot = {
    instance: null,
    events: {
        beforeRemote: OssPjaxBase.beforeRemote,
        resultFilter: OssPjaxBase.resultFilter,
        remoteError: OssPjaxBase.remoteError,

        removeOld: function ($oldContainer) {
            OssPageMethods.beforeRemove($oldContainer);

            $oldContainer.remove();
            OssPjaxBase.resetPageMethods();

            // 清理非pjax加载的局部js文件
            $("#oss-root-scripts").remove();
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

            noQuery: OssPjaxBase.getPjaxUrl,
            methods: ossRootPjax.events
        });

        // 定义全局goTo方法
        window.goToRoot = function(url, title) {
            ossRootPjax.instance.osspjax("goTo", { url: url, title: title });
        };

        if (!isDev) { //  自动获取版本
            var url = "/api/sys/opv";
            ossRootPjax.instance.osspjax("sysVer", { checkVer: true, serverUrl: url });
        }
    }
};

