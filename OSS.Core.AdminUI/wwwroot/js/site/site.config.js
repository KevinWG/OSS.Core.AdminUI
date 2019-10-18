function app_start(isDev) {
    OssPjaxRoot.start(isDev);
    OssApi.isDebug = isDev;
}

Vue.use(VeeValidate, { events: "blur", locale: "zh_CN" });
