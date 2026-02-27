export function getPlaybookEmailHtml(recipientEmail) {
  const baseUrl = process.env.SITE_URL || 'http://localhost:5173';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your EEC Playbook is Ready!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif; color: #ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <div style="font-size: 32px; font-weight: 800; letter-spacing: -1px;">
                <span style="color: #00ff88;">EEC</span>
                <span style="color: #ffffff;"> Gaming</span>
              </div>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #222222 100%); border-radius: 16px; border: 1px solid rgba(0, 255, 136, 0.2); padding: 40px 30px; text-align: center;">
              
              <!-- Emoji Icon -->
              <div style="font-size: 48px; margin-bottom: 20px;">🎮📧</div>
              
              <!-- Title -->
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; line-height: 1.3; color: #ffffff;">
                Your Free EEC Playbook<br>
                <span style="color: #00ff88;">Is Ready to Download!</span>
              </h1>
              
              <!-- Subtitle -->
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #a0a0a0;">
                You're joining a growing community of gaming creators who are taking 
                ownership of their audience. This playbook contains the exact framework 
                we use to help creators build 6-figure email lists.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #00ff88, #00d4aa);">
                    <a href="${baseUrl}/success?email=${encodeURIComponent(recipientEmail)}" 
                       target="_blank"
                       style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 700; color: #0a0a0a; text-decoration: none; border-radius: 10px;">
                      📥 Download Your Playbook
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Inside -->
          <tr>
            <td style="padding: 30px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a1a1a; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
                      📖 What's Inside the Playbook:
                    </h2>
                    
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #d0d0d0;">
                          <span style="color: #00ff88; margin-right: 8px;">✓</span>
                          The exact email-first framework for gaming creators
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #d0d0d0;">
                          <span style="color: #00ff88; margin-right: 8px;">✓</span>
                          How to convert YouTube viewers into email subscribers
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #d0d0d0;">
                          <span style="color: #00ff88; margin-right: 8px;">✓</span>
                          Proven templates that get 40%+ open rates
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #d0d0d0;">
                          <span style="color: #00ff88; margin-right: 8px;">✓</span>
                          Monetization strategies beyond AdSense
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #d0d0d0;">
                          <span style="color: #00ff88; margin-right: 8px;">✓</span>
                          Case studies from top gaming creators
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #d0d0d0;">
                          <span style="color: #00ff88; margin-right: 8px;">✓</span>
                          12 pages of actionable strategies you can implement today
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pro Tip -->
          <tr>
            <td style="padding-bottom: 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(0, 255, 136, 0.05); border-radius: 12px; border: 1px solid rgba(0, 255, 136, 0.15);">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #a0a0a0;">
                      <span style="color: #00ff88; font-weight: 700;">💡 Pro Tip:</span> 
                      Don't just read it — implement one strategy this week. The creators 
                      who see the fastest results are the ones who take immediate action.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Secondary CTA -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #a0a0a0;">
                Ready to go further? Book a free 15-minute strategy call.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 10px; border: 2px solid #00ff88;">
                    <a href="https://eecyoutube-f2ca3821d0db.herokuapp.com/book" 
                       target="_blank"
                       style="display: inline-block; padding: 12px 30px; font-size: 14px; font-weight: 600; color: #00ff88; text-decoration: none;">
                      📞 Book Your Free Call
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 10px 0;">
              <div style="height: 1px; background-color: rgba(255, 255, 255, 0.1);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">
                EEC Gaming — Own Your Fans. Don't Rent Them.
              </p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #555;">
                You're receiving this because you requested the EEC Playbook.
              </p>
              <p style="margin: 0; font-size: 12px; color: #555;">
                <a href="#" style="color: #00ff88; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
