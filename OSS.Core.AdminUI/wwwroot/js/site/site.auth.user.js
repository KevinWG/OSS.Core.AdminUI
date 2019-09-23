var OsUser = {
    userinfo: { id: 0 },
    auth_url: "/api/portal/getauthuser",
    //**
    // *  获取当前用户信息
    // * 先从缓存拿出使用，如果超期同时执行更新操作
    // * @returns {} 
    // */
    get: function() {
        var user = OsStorage.getLocal("cur_user_info");
        if (user && user.id ) {
            var curTimespan = new Date().getTime();

            if (!this.userinfo.id)
                this._updateProps(user);

            if (curTimespan - 1000 * 60 * 30 > user.getTimespan)
                this.getRemote();

            var defer = $.Deferred();
            defer.resolve(user);
            return defer.promise();
        }
        return this.getRemote();
    },

    getRemote: function() {
        var defer = $.Deferred();
        OsApi.get(OsUser.auth_url, null, true).done(function(res) {
            if (res.isOK) {
                var user = res.data.MemberInfo;
                OsUser.UpdateUser(user);
                defer.resolve(user);
            } else {
                OsUser.UpdateUser({ id: 0 }); //  已成功请求，可能用户状态出现问题，清空
                defer.reject(res);
            }
        });
    },
    UpdateUser: function(user) {
        this._updateProps(user);

        if (!user || user.id ) {
            OsStorage.delLocal("cur_user_info");
            return;
        }
        user.getTimespan = new Date().getTime();
        OsStorage.setLocal("cur_user_info", user);
    },
    _updateProps: function(curU) {
        if (!curU)
            return;

        for (let p in curU) {
            if (curU.hasOwnProperty(p)) {
                Vue.set(this.userinfo, p, curU[p]);
            }
        }
    }
};

//var userInfoVue = new Vue({
//    el: "#navbar-menu",
//    data: {
//        user: OsUser.userinfo
//    },
//    methods: {
//        quit: function(e) {
//            e.preventDefault();
//            OsApi.get("/portal/quit").done(function() {
//                OsUser.UpdateUser({ id: 0 });
//                window.goTo("/");
//            });
//        }
//    },
//    created: function () {
//        OsUser.get();
//    }
//});
