using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OSS.Infrastructure.Web.Middlewares;
using OSS.Infrastructure.Web.Middlewares.Web.Auth;
using OSS.Infrastructure.Web.PageFilters;
using OSS.Tools.Config;

namespace OSS.Core.AdminUI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            ConfigUtil.Configuration = Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 因为需要全站校验是否登录，所以这里是全局处理
            // 否则接口Controller基类处理即可，所有ajax请求统一处理，授权登录跳转，纯页面元素本身无需校验 
            services.AddControllers(opt => { opt.Filters.Add(new WebAdminAuthAttribute()); });
            services.AddRazorPages(opt =>
            {
                opt.Conventions.ConfigureFilter(new PageETageFilter());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.UseWebExceptionMiddleware(); // 初始哈全局错误
            app.UseWebInitialAppInfoMiddleware();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
            });
        }
    }
}
