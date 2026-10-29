'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Scissors,
  Check,
  Zap,
} from 'lucide-react';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { WHATSAPP_TEMPLATES } from '@/lib/whatsapp/templates';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/cloud-api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ReminderJob } from '@/types';

export default function WhatsAppAutomationPage() {
  const [data, setData] = useState(getInitialData);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(
    'glama_haircut_30d_reminder'
  );
  const [isProcessingJob, setIsProcessingJob] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  useEffect(() => {
    const handleUpdate = () => setData(getInitialData());
    window.addEventListener('glama_data_updated', handleUpdate);
    return () => window.removeEventListener('glama_data_updated', handleUpdate);
  }, []);

  const selectedTemplate = WHATSAPP_TEMPLATES[selectedTemplateKey];

  // Execute a scheduled reminder job immediately
  const handleExecuteJob = async (job: ReminderJob) => {
    setIsProcessingJob(job.id);
    setStatusMessage(null);

    const customer = data.customers.find((c) => c.id === job.customer_id);

    // Recheck consent and opt-out immediately before sending
    if (!customer || !customer.whatsapp_consent || customer.whatsapp_opt_out) {
      const updatedJobs = data.reminderJobs.map((j) =>
        j.id === job.id
          ? {
              ...j,
              status: 'skipped' as const,
              last_error: 'Customer opted out or did not grant consent.',
              updated_at: new Date().toISOString(),
            }
          : j
      );
      saveDataState({ reminderJobs: updatedJobs });
      setStatusMessage({
        text: `Job ${job.id} skipped: Customer ${customer?.full_name || 'Unknown'} has opted out.`,
        type: 'info',
      });
      setIsProcessingJob(null);
      return;
    }

    try {
      const result = await sendWhatsAppTemplateMessage({
        toPhone: customer.phone,
        templateName: job.template_name,
        parameters: job.template_parameters,
      });

      const updatedJobs = data.reminderJobs.map((j) =>
        j.id === job.id
          ? {
              ...j,
              status: result.success ? ('sent' as const) : ('failed' as const),
              attempts: j.attempts + 1,
              last_attempt_at: new Date().toISOString(),
              provider_message_id: result.messageId,
              last_error: result.error,
              updated_at: new Date().toISOString(),
            }
          : j
      );

      saveDataState({ reminderJobs: updatedJobs });

      if (result.isSimulated) {
        setStatusMessage({
          text: `[Test Mode Simulation] Message dispatched for ${customer.full_name} (${customer.phone}). Simulated Message ID: ${result.messageId}`,
          type: 'info',
        });
      } else if (result.success) {
        setStatusMessage({
          text: `WhatsApp message delivered via Meta Cloud API to ${customer.phone}! Message ID: ${result.messageId}`,
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: `Failed to deliver message: ${result.error}`,
          type: 'error',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing reminder job';
      setStatusMessage({ text: msg, type: 'error' });
    } finally {
      setIsProcessingJob(null);
    }
  };

  // Trigger test 30-day haircut reminder for demo
  const handleCreateTestHaircutReminder = () => {
    const customer = data.customers[0];
    if (!customer) return;

    const newJob: ReminderJob = {
      id: `rem-test-${Date.now()}`,
      idempotency_key: `haircut_30d_demo_${Date.now()}`,
      customer_id: customer.id,
      job_type: 'haircut_30d_followup',
      scheduled_for: new Date().toISOString(), // due now for testing
      status: 'pending',
      attempts: 0,
      max_attempts: 3,
      template_name: 'glama_haircut_30d_reminder',
      template_parameters: {
        customer_name: customer.full_name,
        service_name: 'Signature Haircut & Blowdry',
        salon_name: data.settings.salon_name,
        booking_url: 'https://glamasalon.com/book',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveDataState({ reminderJobs: [newJob, ...data.reminderJobs] });
    setStatusMessage({
      text: `Created new 30-day haircut reminder job for ${customer.full_name}. You can click "Send Now" to test!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F6E6E2]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B96F73] font-semibold">
            OFFICIAL WHATSAPP BUSINESS CLOUD API
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#201817] mt-1">
            Automated WhatsApp CRM &amp; Reminders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Compliant server-side triggers for 30-day haircut follow-ups, booking receipts, and 24h reminders.
          </p>
        </div>

        <button
          onClick={handleCreateTestHaircutReminder}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Queue 30-Day Haircut Test</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
          {statusMessage.type === 'info' && <MessageSquare className="w-4 h-4 text-blue-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Cloud API Integration Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F6E6E2] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            API Gateway Status
          </span>
          <p className="font-serif text-lg font-bold text-[#201817]">
            Meta Cloud Platform v21.0
          </p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sandbox / Simulation Mode Ready
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            30-Day Haircut Automation
          </span>
          <p className="font-serif text-lg font-bold text-[#201817]">
            Active ({data.settings.haircut_reminder_days || 30} Day Interval)
          </p>
          <p className="text-[11px] text-gray-500">
            Auto-queues when any haircut appointment is marked completed.
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Opt-Out Suppression
          </span>
          <p className="font-serif text-lg font-bold text-[#201817]">
            Zero-Tolerance Compliance
          </p>
          <p className="text-[11px] text-gray-500">
            Checks consent &amp; STOP requests immediately prior to dispatch.
          </p>
        </div>
      </div>

      {/* Scheduled Reminder Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F6E6E2]">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#201817]">
              Scheduled Reminder Queue (`reminder_jobs`)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Idempotent database jobs waiting for or processed by the automated worker.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#B96F73]">
            {data.reminderJobs.length} Jobs Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F6E6E2] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Job ID &amp; Type</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Scheduled For</th>
                <th className="py-3 px-3">Template</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6E6E2]">
              {data.reminderJobs.map((job) => {
                const customer = data.customers.find((c) => c.id === job.customer_id);
                const isHaircut = job.job_type === 'haircut_30d_followup';

                return (
                  <tr key={job.id} className="hover:bg-[#FFF9F6] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {isHaircut ? (
                          <div className="w-7 h-7 rounded-lg bg-[#F6E6E2] text-[#B96F73] flex items-center justify-center shrink-0">
                            <Scissors className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#201817]">
                            {isHaircut ? '30-Day Haircut Followup' : job.job_type}
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 truncate max-w-[120px]">
                            {job.idempotency_key}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#201817]">
                        {customer?.full_name || 'Guest'}
                      </p>
                      <p className="text-[11px] text-gray-400">{customer?.phone}</p>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">
                      {formatDate(job.scheduled_for.split('T')[0])}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-gray-600">
                      {job.template_name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          job.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700'
                            : job.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : job.status === 'skipped'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleExecuteJob(job)}
                        disabled={isProcessingJob === job.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2D1B1A] text-white text-[11px] font-semibold hover:bg-[#3D2524] transition-colors disabled:opacity-50"
                      >
                        {isProcessingJob === job.id ? (
                          <RotateCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3 text-[#EAA0A5]" />
                        )}
                        <span>{job.status === 'sent' ? 'Resend' : 'Send Now'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Template Inspector & Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F6E6E2] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#201817]">
              Pre-Approved WhatsApp Templates
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Review message body templates registered with Meta WhatsApp Business.
            </p>
          </div>

          <select
            value={selectedTemplateKey}
            onChange={(e) => setSelectedTemplateKey(e.target.value)}
            className="text-xs px-3.5 py-2 rounded-xl border border-[#D8C6C0] bg-white font-medium focus:outline-none"
          >
            {Object.keys(WHATSAPP_TEMPLATES).map((key) => (
              <option key={key} value={key}>
                {WHATSAPP_TEMPLATES[key].description} ({key})
              </option>
            ))}
          </select>
        </div>

        {selectedTemplate && (
          <div className="p-6 rounded-2xl bg-[#FFF9F6] border border-[#F6E6E2] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#B96F73]">
                Template: {selectedTemplate.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAA0A5]/20 text-[#B96F73] uppercase">
                {selectedTemplate.category}
              </span>
            </div>

            {/* Simulated WhatsApp Chat Bubble */}
            <div className="max-w-md bg-white p-4 rounded-2xl shadow-sm border border-[#F6E6E2] relative text-xs leading-relaxed text-[#201817] space-y-2">
              <p className="whitespace-pre-line">{selectedTemplate.body}</p>
              <div className="text-[10px] text-right text-gray-400 flex items-center justify-end gap-1">
                <span>11:00 AM</span>
                <Check className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
            </div>

            <div className="text-[11px] text-gray-500">
              <strong>Parameters:</strong> {selectedTemplate.parameters.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
