function app_start(isDev) {
    OssPjax.start(isDev);
}

Vue.use(VeeValidate, { events: "blur", locale: "zh_CN" });
