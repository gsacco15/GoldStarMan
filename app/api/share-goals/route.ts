import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { to, toName, fromName, note, goals, year } = body;

    if (!to || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailHtml = generateGoalsEmail({
      toName,
      fromName,
      note,
      goals,
      year: year || new Date().getFullYear().toString(),
    });

    const { data, error } = await resend.emails.send({
      from: 'Gold Star Man <onboarding@resend.dev>',
      to: [to],
      subject: `${fromName}'s ${year || new Date().getFullYear()} Goals`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Share goals error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface GoalEmailData {
  toName?: string;
  fromName: string;
  note?: string;
  goals: Array<{
    bucket: string;
    title: string;
    description?: string;
    weeklyMinimum: number;
    targetDate: string;
    startDate?: string;
  }>;
  year: string;
}

function generateGoalsEmail(data: GoalEmailData): string {
  const greeting = data.toName ? `Hi ${escapeHtml(data.toName)}` : 'Hi';

  const goalsHtml = data.goals
    .map(
      (goal) => `
        <div style="background: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 20px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 24px;">⭐</span>
            <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight: 600; font-size: 18px; color: #1c1917;">
              ${escapeHtml(goal.title)}
            </div>
          </div>
          ${
            goal.description
              ? `<div style="font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #57534e; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
                  ${escapeHtml(goal.description)}
                </div>`
              : ''
          }
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <div style="background: #fef3c7; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #92400e;">
              ${goal.weeklyMinimum}x per week
            </div>
            ${
              goal.startDate
                ? `<div style="background: #f5f5f4; padding: 6px 12px; border-radius: 8px; font-size: 13px; color: #57534e;">
                    ${formatDateRange(goal.startDate, goal.targetDate)}
                  </div>`
                : `<div style="background: #f5f5f4; padding: 6px 12px; border-radius: 8px; font-size: 13px; color: #57534e;">
                    Target: ${formatDate(goal.targetDate)}
                  </div>`
            }
          </div>
        </div>
      `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #fffbeb 0%, #fafaf9 50%, #ffedd5 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1c1917 0%, #292524 100%); border-radius: 24px; padding: 32px; text-align: center; margin-bottom: 24px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);">
      <div style="font-size: 48px; margin-bottom: 12px;">⭐</div>
      <h1 style="margin: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
        ${escapeHtml(data.fromName)}'s ${data.year} Goals
      </h1>
      <p style="margin: 12px 0 0 0; font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; color: #d6d3d1; font-weight: 300;">
        Sharing my journey with you
      </p>
    </div>

    <!-- Greeting Card -->
    <div style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(231, 229, 228, 0.5); border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
      <p style="margin: 0; font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; color: #1c1917; line-height: 1.6;">
        ${greeting},
      </p>
      ${
        data.note
          ? `<p style="margin: 16px 0 0 0; font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; color: #57534e; line-height: 1.6;">
              ${escapeHtml(data.note)}
            </p>`
          : `<p style="margin: 16px 0 0 0; font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; color: #57534e; line-height: 1.6;">
              I wanted to share my goals for ${data.year} with you. These are the areas I'm focusing on this year.
            </p>`
      }
    </div>

    <!-- Goals Section -->
    <div style="margin-bottom: 24px;">
      <h2 style="margin: 0 0 16px 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600; color: #1c1917;">
        My Goals
      </h2>
      ${goalsHtml}
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px; color: #78716c; font-size: 13px; font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <p style="margin: 0;">Shared from Gold Star Man</p>
      <p style="margin: 8px 0 0 0;">Turn your yearly goals into daily wins</p>
    </div>
  </div>
</body>
</html>
  `;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}
