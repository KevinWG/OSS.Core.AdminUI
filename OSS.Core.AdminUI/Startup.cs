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
            // ��Ϊ��ҪȫվУ���Ƿ��¼������������ȫ�ִ���
            // ����ӿ�Controller���ദ���ɣ�����ajax����ͳһ������Ȩ��¼��ת����ҳ��Ԫ�ر�������У�� 
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

            app.UseWebExceptionMiddleware(); // ��ʼ��ȫ�ִ���
            app.UseWebInitialAppInfoMiddleware();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
            });
        }
    }
}
