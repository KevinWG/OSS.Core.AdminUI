function app_start(isDev) {
    OssPjax.start(isDev);
}
//Vue.use(VeeValidate, { events: "blur", locale: "zh_CN" });
//Vue.component('ValidationProvider', ValidationProvider);
 
VeeValidate.extend('required', VeeValidateRules.required);
VeeValidate.extend('email', VeeValidateRules.email);

// Register the component globally.
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);