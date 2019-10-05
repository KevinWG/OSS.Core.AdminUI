$(function () {
    initailUser();
});

//初始化页面验证
function initailUser() {
    return new Vue({
        el: "#login-component",
        data: {
            login: {
                name: "",
                code: "",
                type: 20
            },
            user: OsUser.userinfo
        },
        methods: {
            submit: function(event) {
                var self = this;

                this.$validator.validateAll().then(function(vr) {
                    if (!vr)
                        return;

                    var data = self.login;
                    var url = "/portal/codeadminlogin";

                    OssApi.postBtn($(event.target), url, data, true)
                        .done(function(res) {

                            if (res.isOK) {
                                OsUser.UpdateUser(res.user);

                                goTo(!res.r_url ? "/" : res.r_url);
                            } else {
                                OssTips.showTipError(res.msg);
                            }

                        });
                });
            },
         
            countBack: function (count, $btn) {
                if (count === 0) {
                    $btn.removeAttr("disabled");
                    $btn.text("发送");
                } else {
                    count -= 1;
                    $btn.text("(" + count + ")");

                    var self = this;
                    setTimeout(function () { self.countBack(count, $btn); }, 1000);
                }
            }
        },
        created: function () {
            var data = this.login;
            this.$validator.extend("emailandphone",
                {
                    getMessage: function (field, params, data) {
                        return "手机号/邮箱必填";
                    },
                    validate: function (value) {
                        if (/^1\d{10}$/.test(value)) {
                            data.type = 20;
                        } else if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
                            data.type = 30;
                        } else {
                            return false;
                        }
                        return true;
                    }
                });
        }
    });
}