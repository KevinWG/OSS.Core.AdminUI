using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OSS.Common.Authrization;
using OSS.Common.Resp;
using OSS.Core.AdminUI.Apis.Mem.Reqs;
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

            return new AuthResp()
            {
                data = new MemberIdentity()
                {
                    Id   = "1",
                    Name = "TestName",
                    MemberInfo = new
                    {
                        id   = "1",
                        name = "TestName",
                        img  = "/lib/coreui/img/avatars/6.jpg"
                    }
                }
            };
        }

        [HttpPost]
        public AuthResp GetAuthIndentity()
        {
            string token = MemberShiper.AppAuthorize?.Token;

            if (string.IsNullOrEmpty(token))
            {
                return new AuthResp().WithResp(RespTypes.ObjectNull, "未能获取登录信息!");
            }

            return new AuthResp()
            {
                data = new MemberIdentity()
                {
                    Id   = "1",
                    Name = "TestName",
                    MemberInfo = new
                    {
                        id   = "1",
                        name = "TestName",
                        img  = "/lib/coreui/img/avatars/6.jpg"
                    }
                }
            };
        }

        [HttpGet]
        public Resp Quit()
        {
            Response.Cookies.Delete(GlobalKeysUtil.AdminCookieName);
            return new Resp(RespTypes.UnLogin,"/portal/login");
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
