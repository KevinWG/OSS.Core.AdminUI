using Microsoft.AspNetCore.Mvc;
using OSS.Infrastructure.Utils;

namespace OSS.Core.AdminUI.Apis
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class SysController : ControllerBase
    {
        public string Opv()
        {
            return AppInfoUtil.AppVersion;
        }
    }
}