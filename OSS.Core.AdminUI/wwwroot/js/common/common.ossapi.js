//**
// *  获取当前应用版本
// */
function findVersion() {
    return $("meta").filter(function () {
        var name = $(this).attr("http-equiv");
        return name && name.toLowerCase() === "app-version";
    }).attr("content");
}
var OssApi = {
    isDebug: true,
    //**
    // *  请求接口post请求
    // * @param {any} $btn   触发按钮
    // * @param {any} url    请求地址
    // * @param {any} data   请求数据对象
    // * @returns {}  返回 Promise 对象
    // */
    postBtn: function($btn, url, data) {

        var btnText = $btn.text();
        var loadingText = $btn.attr("loading-text");

        $btn.attr("disabled", "disabled");
        $btn.text(loadingText);

        return this.post(url, data, true).always(function() {

            $btn.text(btnText);
            $btn.removeAttr("disabled");

        });
    },
    //**
    // *   post请求
    // * @param {} url    请求地址
    // * @param {} data  请求数据对象     *
    // * @param {} closeLoading  是否关闭Loading状态栏，默认是开启状态
    // * @returns {}  返回 Promise 对象
    // */
    post: function(url, data, closeLoading) {
        var jsonData = data && JSON.stringify(data);
        var opt = {
            type: "POST",
            url: url,
            data: jsonData
        };
        return this._ajax(opt, closeLoading);
    },
    //**
    // *  get请求
    // * @param {} url
    // * @param {} closeLoading  是否关闭Loading状态栏，默认是开启状态
    // * @returns {} 
    // */
    get: function(url, closeLoading) {
        var opt = {
            type: "GET",
            url: url
        };
        return this._ajax(opt, closeLoading);
    },
    //**
    // *   远程Ajax请求发起
    // *      请求中会附带 X-App-OsVer 版本号
    // * @param {} opt    ajax参数
    // * @param {} closeLoading  是否关闭Loading状态栏，默认是开启状态
    // * @returns {} 
    // */
    _ajax: function(opt, closeLoading) {
        var ajaxSetting = $.extend({
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            opt);

        ajaxSetting.beforeSend = function(x) {
            x.setRequestHeader("X-App-OsVer", findVersion());
        };

        //if (ajaxSetting.url.indexOf("/t/")<0) {
        //    ajaxSetting.url = OsTenant.getWebRoute() + ajaxSetting.url;
        //}

        if (!closeLoading)
            OssTips.showLoading();

        var defer = $.Deferred();
        $.ajax(ajaxSetting)
            .done(function(res, txt, xhr) {

                if (OssApi.isDebug) {
                    console.info("请求地址：" + ajaxSetting.url);
                    console.info(res);
                }

                if (!closeLoading)
                    OssTips.hide();

                res.isOK = !res.ret ? true : false;

                // 全局错误码，跳转授权页
                if (res.ret === 1425 && res.msg.indexOf("/") >= 0) {
                    defer.reject(xhr, txt, res);
                    location.href =  res.msg ;
                } else
                    defer.resolve(res);

            }).fail(function(xhr, err, msg) {

                if (!closeLoading)
                    OssTips.hide();

                OssTips.showTipError("请求出错啦,网络可能出现问题");
                defer.reject(xhr, err, msg);

            });
        return defer.promise();
    }
};