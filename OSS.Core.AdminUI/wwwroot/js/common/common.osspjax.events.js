var OssPjaxEvents = {
    // ======= 可扩展事件 ======
    pageReplace: function(con) {},
    pageLoaded: function (newState) { },
    trans: function ($new, $old, done) { },
    // ======= 可扩展事件 end ======


    reset: function () {
        var defaultmethods = {
            pageReplace: function () { },
            pageLoaded: function () { },
            trans: function ($new, $old, done) {
                $old.hide(400);
                $new.fadeIn(1200, done);
            }
        };
        $.extend(this, defaultmethods);
    },
    // 页面初始化，第一次执行页面加载事件，同时过滤多个控件干扰
    firstPageLoad: function (state) {
        if (!this.firstLoaded) {
            this.firstLoaded = true;
            this.pageLoaded(state);
        }
    },
    //  请求开始前弹窗提示
    beforeRemote: function (ajaxOpt) {
        OssTips.showLoading(); //  开启加载框
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
