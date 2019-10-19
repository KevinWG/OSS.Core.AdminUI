var pagVue;
OssPageMethods.pageLoaded = initailLogin;
OssPageMethods.pageReplace = function() {
    pagVue.$destroy();
};
//初始化页面验证
function initailLogin() {
    pagVue = new Vue({
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

                    var data = self.login;
                    var url = "/api/portal/codelogin";

                    OssApi.postBtn($(event.target), url, data, true)
                        .done(function (res) {
                            if (res.isOK) {
                                var rUrl = OssUtil.getQuery("rurl") || "/";
                               // goToRoot(rUrl); 主菜单无法出现效果
                               location.href = rUrl;
                            } else {
                                OssTips.showTipError(res.msg);
                            }
                        });

                });
            }
        },
        created: function () {
        }
    });

    return pagVue;
}
