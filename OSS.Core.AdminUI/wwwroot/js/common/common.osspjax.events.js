var OssPageMethods = {
    // ======= 可扩展事件 ======
    beforeRemote: function (ajaxOpt) { },
    beforeRemove: function ($old) { }
    // ======= 可扩展事件 end ======
};

var OssPjaxBase = {
    resetPageMethods: function () {
        var defaultmethods = {
            beforeRemote: function (ajaxOpt) { },
            beforeRemove: function ($old) { }
        };
        $.extend(OssPageMethods, defaultmethods);
    },
  
    //  远程请求错误处理，如果是系统全局json错误相关，这里处理错误展示
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
                window.goToRoot(eMsg.msg);
                return;
            }

            OssTips.showTipError(eMsg.msg);
            return;
        }
        OssTips.showTipError("当前请求超时,请稍后重试");
    },
    getPjaxUrl: function (fullUrl) {

        let url = fullUrl;
        const index = url.indexOf("?");

        if (index > 0)
            url = url.substring(0, index);

        return url;
    },
    // 结果过滤处理,防止json格式的数据进入渲染模块（进入错误处理）
    resultFilter: function (resData, textState, xhr) {
        if (typeof resData === "object" || xhr.getResponseHeader("Content-Type").startWith("application/json"))
            return false;
        return resData;
    }
};
