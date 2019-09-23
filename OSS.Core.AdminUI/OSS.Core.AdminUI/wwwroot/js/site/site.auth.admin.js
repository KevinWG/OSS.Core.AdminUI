var OsAdmin = {

    admininfo: { id: 0 },
    auth_url: "/portal/getauthadmin",

    //**
    // *  获取当前用户信息
    // * 先从缓存拿出使用，如果超期同时执行更新操作
    // * @returns {} 
    // */
    get: function() {
        var admin = OsStorage.getLocal("cur_admin_info");
        if (admin && admin.id > 0) {
            var curTimespan = new Date().getTime();

            if (!this.admininfo.id)
                this._updateProps(admin);

            if (curTimespan - 1000 * 60 * 30 > admin.getTimespan)
                this.getRemote();

            var defer = $.Deferred();
            defer.resolve(admin);
            return defer.promise();
        }
        return this.getRemote();
    },

    getRemote: function() {
        var defer = $.Deferred();
        OsApi.get(OsAdmin.auth_url, null, true).done(function(res) {
            if (res.isOK) {

                var admin = res.data.MemberInfo;
                OsAdmin.UpdateAdmin(admin);

                defer.resolve(admin);
            } else {
                OsAdmin.UpdateAdmin({ id: 0 }); //  已成功请求，可能用户状态出现问题，清空
                defer.reject(res);
            }
        });
    },


    UpdateAdmin: function(admin) {
        this._updateProps(admin);

        if (!admin || admin.id) {
            OsStorage.delLocal("cur_admin_info");
            return;
        }

        admin.getTimespan = new Date().getTime();
        OsStorage.setLocal("cur_admin_info", admin);
    },


    _updateProps: function(curU) {
        if (!curU)
            return;

        for (let p in curU) {
            if (curU.hasOwnProperty(p)) {
                Vue.set(this.admininfo, p, curU[p]);
            }
        }
    }
};


OsAdmin.get();

//var adminInfoVue = new Vue({
//    el: "#navbar-menu",
//    data: {
//        admin: OsAdmin.admininfo
//    },
//    methods: {
//        quit: function(e) {
//            e.preventDefault();
//            OsApi.get("/portal/quit").done(function() {
//                OsAdmin.UpdateAdmin({ id: 0 });
//                window.goTo("/");
//            });
//        }
//    },
//    created: function () {
//        OsAdmin.get();
//    }
//});
