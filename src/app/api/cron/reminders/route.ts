import { NextRequest, NextResponse } from 'next/server';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/cloud-api';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // If a cron secret is set, verify authorization
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron caller' }, { status: 401 });
    }

    const data = getInitialData();
    const now = new Date();

    // Find pending jobs that are due
    const dueJobs = data.reminderJobs.filter(
      (job) => job.status === 'pending' && new Date(job.scheduled_for) <= now
    );

    let processedCount = 0;
    let sentCount = 0;
    let skippedCount = 0;

    let updatedJobs = [...data.reminderJobs];

    for (const job of dueJobs) {
      processedCount++;
      const customer = data.customers.find((c) => c.id === job.customer_id);

      // Recheck customer consent and opt-out
      if (!customer || !customer.whatsapp_consent || customer.whatsapp_opt_out) {
        skippedCount++;
        updatedJobs = updatedJobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: 'skipped' as const,
                last_error: 'Customer opted out or did not consent',
                updated_at: new Date().toISOString(),
              }
            : j
        );
        continue;
      }

      // Dispatch template message
      const result = await sendWhatsAppTemplateMessage({
        toPhone: customer.phone,
        templateName: job.template_name,
        parameters: job.template_parameters,
      });

      if (result.success) {
        sentCount++;
        updatedJobs = updatedJobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: 'sent' as const,
                attempts: j.attempts + 1,
                last_attempt_at: new Date().toISOString(),
                provider_message_id: result.messageId,
                updated_at: new Date().toISOString(),
              }
            : j
        );
      } else {
        updatedJobs = updatedJobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                status: j.attempts + 1 >= j.max_attempts ? ('failed' as const) : ('pending' as const),
                attempts: j.attempts + 1,
                last_attempt_at: new Date().toISOString(),
                last_error: result.error,
                updated_at: new Date().toISOString(),
              }
            : j
        );
      }
    }

    if (processedCount > 0) {
      saveDataState({ reminderJobs: updatedJobs });
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        totalDue: dueJobs.length,
        processed: processedCount,
        sent: sentCount,
        skipped: skippedCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error processing reminder cron';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
