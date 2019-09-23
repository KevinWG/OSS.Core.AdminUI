var OsTenant = {
    getWebRoute: function () {
        var url = window.location.pathname;
        var reg = new RegExp("/t/[a-zA-Z0-9]+");
        var rs = url.match(reg);

        if (rs.length > 0) {
            return rs[0];
        }
        return "";
    }
};



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
