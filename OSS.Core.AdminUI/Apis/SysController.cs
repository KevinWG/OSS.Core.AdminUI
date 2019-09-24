using Microsoft.AspNetCore.Mvc;
using OSS.Infrastructure.Utils;

namespace OSS.Core.AdminUI.Apis
{ 
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SysController : ControllerBase
    {
        public string Opv()
        {
            return AppInfoUtil.AppVersion;
        }
    }
}