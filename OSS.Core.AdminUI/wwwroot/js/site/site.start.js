// IE兼容
if (/msie|trident/g.test(window.navigator.userAgent.toLowerCase())) {
    var domain = OssConfig.css_domain || "/";

    var es6_promise_min_js = document.createElement("script");
    es6_promise_min_js.src = domain + "lib/es6-promise/es6-promise.min.js";
    document.head.appendChild(es6_promise_min_js);

    var es6_promise_auto_min_js = document.createElement("script");
    es6_promise_auto_min_js.src = domain + "lib/es6-promise/es6-promise.auto.min.js";
    document.head.appendChild(es6_promise_auto_min_js);
}

Vue.use(VeeValidate, { events: "blur", locale: "zh_CN" });

function app_start(isDev) {
    OssPjaxRoot.start(isDev);
    OssApi.isDebug = isDev;
}
