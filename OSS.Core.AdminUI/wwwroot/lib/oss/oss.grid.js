+function ($) {

    var defaultTemplate = "<table id=\"simple-table\"  class=\"table table-striped table-border table-bordered table-hover\"><thead class=\"page-list-header\"></thead><tbody class=\"page-list-content\"></tbody></table><div class=\"page-list-footer\"></div>";
    var defaultFormatMotheds = {
        // 行格式化   tr里的内容
        rowFormat : function (row, headers) {
            var contentHtml = "<tr>";
            for (let i = 0; i < headers.length; i++) {
                var header = headers[i];

                var isFormat = !!header.contentFormat
                    && (typeof (header.contentFormat) == "function"
                        || typeof (header.contentFormat = eval(header.contentFormat)) == "function");

                let itemValue = row[header.col_name];
                (itemValue === null || itemValue === undefined) && (itemValue = '');

                contentHtml += "<td>" + (isFormat ? header.contentFormat(itemValue, row) : itemValue) + "</td>";
            }
            return contentHtml + "</tr>";
        },
        
        //  头部html格式化
        headerFormat :function (headers) {
            var headerHtml = "<tr>";
            for (var i = 0; i < headers.length; i++) {
                var header = headers[i];
                var width = "style='width:" + header.Width + "'";
                headerHtml += "<th class='text-center' " + (!!header.Width ? width : "''") + ">" + header.Title + "</th>";
            }
            return headerHtml + "</tr>";
        },

        //  分页信息格式化部分
        footerFormat :function (page) {
            // 1.  分页
            var numSidCount = 4;
            var pageHtml="" ;
            if (page.total_page > 0) {
                pageHtml = "<ul class=\"pagination\">";
                if (page.cur_page > 1) {
                    pageHtml += "<li><a data-osgrid-goto=\"1\" href=\"javascript:void(0);\">首页</a></li>";
                }
                if (page.cur_page > numSidCount + 1) {
                    pageHtml += "<li class=\"disabled\"><a href=\"#\">...</a></li>";
                }
                for (var i = page.cur_page - numSidCount > 0 ? page.cur_page - numSidCount : 1; i < page.cur_page; i++) {
                    pageHtml += "<li><a  data-osgrid-goto=\"" + i + "\" href=\"javascript:void(0);\">" + i + "</a></li>";
                }

                pageHtml += "<li class=\"active\"><a href=\"javascript:void(0);\">" + page.cur_page + "</a></li>";

                for (var j = page.cur_page + 1; j <= page.total_page && j <= page.cur_page + numSidCount; j++) {
                    pageHtml += " <li><a data-osgrid-goto=\"" + j + "\" href=\"javascript:void(0);\">" + j + "</a></li>";
                }
                if (page.cur_page + numSidCount < page.total_page) {
                    pageHtml += " <li class=\"disabled\"><a href=\"#\">...</a></li>";
                }
                if (page.cur_page < page.total_page) {
                    pageHtml += "<li><a data-osgrid-goto=\"" + page.total_page + "\" href=\"javascript:void(0);\">末页</a></li>";
                }
                pageHtml += " </ul>";
            }
            // 2.  下拉框

            //// 3.  显示总数
            //var countHtml = "<div class=\"col-xs-12 col-md-6\"><span style=\"line-height: 2.5\">第 " + page.cur_page + " 页，总 " + page.total_page + " 页，总 " + page.total + " 条记录 </span></div>";

            return pageHtml; //+ countHtml;
        }
    }
    var OSGrid = function (element, option) {
        this.opt = option;
        this.element = $(element);

        //方法部分
        this.opt.methods.extSendParas = this.convertToFunc(this.opt.methods.extSendParas, function () { });
        this.opt.methods.dataBound = this.convertToFunc(this.opt.methods.dataBound, function () { });
        this.opt.methods.getDataFunc = this.convertToFunc(this.opt.methods.getDataFunc);
        
        this.opt.methods.headerFormat = this.convertToFunc(this.opt.methods.headerFormat, defaultFormatMotheds.headerFormat);
        this.opt.methods.rowFormat = this.convertToFunc(this.opt.methods.rowFormat, defaultFormatMotheds.rowFormat);
        this.opt.methods.footerFormat = this.convertToFunc(this.opt.methods.footerFormat, defaultFormatMotheds.footerFormat);

        //   如果不存在templateid  说明使用默认模板
        var templateId = this.element.attr("data-grid-template");
        var templateHtml = !!templateId ? $(templateId).html() : "";
        templateHtml = templateHtml || defaultTemplate;

        this.element.prepend(templateHtml);
    };

    OSGrid.prototype = {
        constructor: OSGrid,

        reload: function () {
            this.opt.page.cur_page = 1;
            this.opt.page.total_page =0;
            this.render();
        },

        refresh: function () {
            this.render();
        },

        //  执行控件渲染
        render: function render() {

            var os = this;
            var page = os.opt.page;
            var sendData = os.opt.methods.extSendParas();
            sendData = $.extend(true, sendData, page);

            this.opt.methods.getDataFunc(sendData, function (data) {

                //初始化行数据
                os.initailContent(data);

                // 初始化页脚
                os.initailFooter(data);
            });
            //初始化头部
            os.initailHeader();
        },

        //初始化加载头部
        initailHeader: function () {

            if (this.opt.headers && this.opt.headers.length>0
                && !this.element.hasInitialHeader) {

                var headerContainer = this.opt.container.header;
                var html = this.opt.methods.headerFormat(this.opt.headers);

                if (!!html) {
                    this.element.find(headerContainer).html(html);
                }
                this.element.hasInitialHeader = true;
            }
        },

        //初始化加载内容
        initailContent: function (data) {

            var dataList = data.data;

            var contentContainer = this.opt.container.content;
            var $content = this.element.find(contentContainer);
            $content.html("");

            if (!!dataList) {
                for (var d = 0; d < dataList.length; d++) {
                    var dataItem = dataList[d];
                    var html = this.opt.methods.rowFormat(dataItem, this.opt.headers);
                    $content.append(html);
                }
            } 
        },

        //初始化加载页尾分页等信息
        initailFooter: function (data) {
            var os = this;
            var footerContainer = os.opt.container.footer;
            var $footer = os.element.find(footerContainer);

            if (this.opt.page.use_page) {
                $footer.show();

                //   前端根据  data-osgrid-goto  确定跳转页面 
                os.opt.page.total = data.total;
                os.opt.page.total_page = Math.ceil(data.total / os.opt.page.size );

                var html = os.opt.methods.footerFormat(os.opt.page);
                $footer.html(html);

                $footer.find("[data-osgrid-goto]").unbind("click").bind("click",
                    function () {
                        os.goToPage($(this), os);
                    });
            } else {
                $footer.hide();
            }
            this.opt.methods.dataBound(os.element);
        },
        goToPage: function ($a, os) {

            var page = parseInt($a.attr("data-osgrid-goto"));
            page = page != 'NaN' ? page : 1;
            os.opt.page.cur_page = page;

            os.render();
        },
        // 字符串转化为方法
        convertToFunc: function (strFunc, defautFun) {
            var func = null;
            if (!!strFunc
                && (typeof (strFunc) == "function"
                    || typeof (func = eval(strFunc)) == "function")) {
                return func || strFunc;
            }
            return defautFun || null;
        }
    };
    
    var defaultOption = {

        show_header: true,
        page: { use_page: true, size: 8, cur_page: 1 },

        headers : [],
        container: {
            Header: ".page-list-header",
            Content: ".page-list-content",
            Footer: ".page-list-footer"
        },
        methods: {

            // 扩展post之前的参数
            extSendParas: function () { return {}; },

            //  获取数据源方法
            getDataFunc: function (pageData, loadDataFunc) { },

            //数据绑定完成之后
            dataBound: function (ele) { }
        }
    }

    //  避免其他地方已经定义，作为避免冲突保留项
    var old = $.fn.osgrid;



    //  设置jQuery插件对象
    $.fn.osgrid = function (option) {

        var args = Array.apply(null, arguments);
        args.shift();

        var internalReturn;

        this.each(function () {

            var $this = $(this);

            var cacheData = $this.data('os.grid');
            var options = typeof option == 'object' && option;

            if (!cacheData) {
                options = $.extend(true, {}, defaultOption, options);
                $this.data('os.grid', (cacheData = new OSGrid(this, options)));
                cacheData.render();
            }

            if (typeof option == 'string' && typeof cacheData[option] == 'function') {
                internalReturn = cacheData[option].apply(cacheData, args);
            }
        });

        if (internalReturn !== undefined)
            return internalReturn;
        else
            return this;

    };

    //设置初始值
    $.fn.osgrid.constructor = OSGrid;

    // 表格冲突处理
    $.fn.osgrid.noConflict = function () {
        $.fn.osgrid = old;
        return this;
    };

}(window.jQuery);