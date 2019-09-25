using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace OSS.Core.AdminUI.Pages.Portal
{
    [AllowAnonymous]
    public class RegisterModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}