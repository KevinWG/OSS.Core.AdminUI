using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OSS.Common.Authrization;
using OSS.Common.Resp;
using OSS.Infrastructure.Utils;

namespace OSS.Core.AdminUI.Apis.Mem
{
    [AllowAnonymous]
    public class PortalController:BaseApiController
    {

        [HttpPost]
        public Resp<MemberIdentity> CodeLogin()
        {
            //  todo  完成实际的授权相关处理
            Response.Cookies.Append(GlobalKeysUtil.AdminCookieName, "token",
                new CookieOptions() {HttpOnly = true, Expires = DateTimeOffset.Now.AddDays(30)});
            
            return new Resp<MemberIdentity>(new MemberIdentity()
            {
                Id="1",Name = "TestName",
            });
        }

        [HttpPost]
        public Resp<MemberIdentity> GetAuthIndentity()
        {
            string token = MemberShiper.AppAuthorize?.Token;

            if (string.IsNullOrEmpty(token))
            {
                return new Resp<MemberIdentity>().WithResp(RespTypes.ObjectNull,"未能获取登录信息!");
            }
            return new Resp<MemberIdentity>(new MemberIdentity()
            {
                Id   = "1",
                Name = "TestName",
            });
        }




        [HttpGet]
        public Resp Logout()
        {
            return new Resp();
        }

    }



    [AllowAnonymous]
    public class AnonymousModel : PageModel
    {
        public void OnGet()
        {
        }

    }
}
