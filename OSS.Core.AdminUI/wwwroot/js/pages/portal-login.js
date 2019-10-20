var portal_pag_Vue;

$(function() {
    initailLogin();
    OssPageMethods.beforeRemove = function ($btn) {
        portal_pag_Vue.$destroy();
    };
});
//初始化页面验证
function initailLogin() {
    portal_pag_Vue = new Vue({
        el: "#login-component",
        data: {
            login: {
                user_name: "",
                password: ""
            }
        },
        methods:
        {
            submit: function (event) {
                var self = this;
                this.$validator.validateAll().then(function (vr) {
                    if (!vr)
                        return;

                    const data = self.login;
                    const url = "/api/portal/codelogin";

                    OssApi.postBtn($(event.target), url, data, true)
                        .done(function (res) {
                            if (res.isOK) {
                                var rUrl = OssUtil.getQuery("rurl") || "/";
                                goToRoot(rUrl); 
                            } else {
                                OssTips.showTipError(res.msg);
                            }
                        });

                });
            }
        }
    });
}
