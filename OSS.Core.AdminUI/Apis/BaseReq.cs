using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace OSS.Core.AdminUI.Apis
{

    [AllowAnonymous]
    public class AnonymousReq : PageModel
    {
        public void OnGet()
        {
        }
    }

}
