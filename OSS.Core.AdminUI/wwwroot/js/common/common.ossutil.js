var OssUtil = {
   
    //转到404页
    go404: function() {
        goToRoot("/un/notfound");
    },

    /**
     * 检查结果是否存在，如果不存在转到404页
     * @param {any} res 接口响应结果
     */
    checkRes404: function (res) {
        if (res.ret === 1404) {
            this.go404();
        }
    },

    getQuery: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r && r[2]) {
            return unescape(r[2]);
        }
        return null;
    },

    getQueryId: function() {
        var id = OssUtil.getQuery("id");
        if (id)
            return id;

        var url = window.location.pathname;
        var reg = new RegExp("/[a-zA-Z]+/[a-zA-Z]+/(\\d+)/?$");
        var rs = url.match(reg);

        if (rs && rs.length === 2)
           id = rs[1];   //id = parseFloat(rs[1]);

        return id;// isNaN(id) ? 0 : id;
    },
    //getQueryFloat: function(name) {
    //    var val = parseFloat(this.getQuery(name));
    //    return isNaN(val) ? 0 : val;
    //},
 
 
    getDateFromUTCSecs: function(nS) {
        return new Date(parseInt(nS) * 1000);
    },

    getStateTxt: function(state) {
        if (!state) { //  接口默认值时不返回数据
            return "正常";
        }
        switch (state) {
        case -1000:
            return "已删除";
        case -100:
            return "已取消";
        case -10:
            return "失败";
        case 0:
            return "正常";
        case 10:
            return "待确认";
        case 20:
            return "通过";
        case 100:
            return "结束";
        default:
            return "未知";
        }
    }
};