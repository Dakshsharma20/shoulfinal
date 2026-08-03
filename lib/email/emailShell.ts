const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://soulhues.example.com";

/**
 * Plain inline-styled HTML — email clients don't reliably support
 * external stylesheets or modern CSS, so everything here is intentionally
 * simple and inlined rather than trying to reuse the site's Tailwind
 * classes.
 */
export function emailShell(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#F5F2EC;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F2EC;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background-color:#FAF8F3;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:#2E3B2F;padding:28px 32px;text-align:center;">
                <span style="font-size:22px;color:#FAF8F3;letter-spacing:0.5px;">Soul&nbsp;Hues</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#2E3B2F;font-weight:500;">${title}</h1>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#2E3B2F;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #E8E2D8;text-align:center;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6A756B;">
                  Soul Hues &mdash; Handcrafted jewellery, by Shivani<br/>
                  <a href="${SITE_URL}" style="color:#4F6B52;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function formatINR(amount: number): string {
  return `\u20b9${amount.toLocaleString("en-IN")}`;
}
