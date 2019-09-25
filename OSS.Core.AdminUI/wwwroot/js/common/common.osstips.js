var OssTips = {
    showTipInfo: function(message, secs) {
        secs = secs || 5;
        this.showTips(message, secs);
    },
    showTipError: function(message, secs) {
        secs = secs || 6;
        this.showTips(message, secs);
    },
    showTipSuccess: function(message, secs) {
        secs = secs || 6;
        this.showTips(message, secs);
    },
    showTips: function(htm, secs) {
        if (!htm)
            return;
        secs = secs || 5;

        var $tip = $("#oss-tips");
        $tip.find(".loading").hide();

        var $text = $tip.find(".text");
        $text.html(htm);
        $text.show();
        $tip.show();

        $tip.find(".container").fadeIn(300);
        if (secs && secs > 0) {
            setTimeout(function() {
                    OssTips.hide(400);
                },
                secs * 1000);
        }
    },
    showLoading: function() {
        $("#oss-tips").find(".text").hide();
        $("#oss-tips").find(".loading").show();

        $("#oss-tips").show();
        // 内部慢慢显示
        $("#oss-tips>div").fadeIn(500);
    },
    hide: function(milSecs) {
        milSecs = milSecs || 0;
        if (milSecs === 0)
            $("#oss-tips").hide();
        else
            $("#oss-tips").fadeOut(milSecs);

        // 确保内容隐藏掉
        $("#oss-tips>div").fadeOut(milSecs);
    }
};