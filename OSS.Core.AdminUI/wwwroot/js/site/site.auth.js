var OssAuth = {

    auth_info: { id: 0 },

    auth_key: "cur_auth_info",
    auth_url: "/api/portal/GetAuthIndentity",
    auth_quit_url: "/api/portal/quit",

    quit: function() {
        OssApi.get(this.auth_quit_url, null, true).done(function (res) {
            if (!res.isOK) {
                OssTips.showTipError(res.msg);
            }
        });
    },
    //**
    // *  获取当前用户信息
    // * 先从缓存拿出使用，如果超期同时执行更新操作
    // * @returns {} 
    // */
    get: function() {

        var authInfo = OssStorage.getLocal(this.auth_key);

        if (authInfo && authInfo.id > 0) {
            var curTimespan = new Date().getTime();

            if (!this.auth_info.id)
                this._updateProps(authInfo);

            if (curTimespan - 1000 * 60 * 30 > authInfo.getTimespan)
                this.getRemote();
        }
        this.getRemote();
    },

    getRemote: function() {

        OssApi.get(this.auth_url).done(function (res) {
            var authInfo = res.isOK ? res.data.MemberInfo : { id: 0 };

            OssAuth.UpdateAuth(authInfo);
        });
    },


    UpdateAuth: function(authInfo) {
        this._updateProps(authInfo);

        if (!authInfo || authInfo.id) {
            OssStorage.delLocal(this.auth_key);
            return;
        }

        authInfo.getTimespan = new Date().getTime();
        OssStorage.setLocal(this.auth_key, authInfo);
    },


    _updateProps: function (authInfo) {
        if (!authInfo)
            return;

        for (let p in authInfo) {
            if (authInfo.hasOwnProperty(p)) {
                Vue.set(this.auth_info, p, authInfo[p]);
            }
        }
    }
};

var adminInfoVue = new Vue({
    el: "#oss-page-header",
    data: {
        auth_info: OssAuth.auth_info
    },
    methods: {
        quit: function(e) {
            e.preventDefault();
            OssAuth.quit();
        }
    },
    created: function () {
        OssAuth.get();
    }
});
