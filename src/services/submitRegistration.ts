import { createClient } from '@supabase/supabase-js';
import type { FormData } from '../../types';
import { buildSubmissionId } from '../utils/submissionPayloads';

type SubmitRegistrationResult = {
  success: boolean;
  error?: string;
  details?: {
    supabase?: unknown;
    webhook?: unknown;
  };
};

const getSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

const buildSubmissionPayload = (data: FormData) => {
  const quranCountry =
    data.quranStudentCountry ||
    data.quranStudents?.find((student) => student.country)?.country ||
    data.upsellQuranStudents?.find((student) => student.country)?.country ||
    '';

  const quranStudents = (data.quranStudents || []).map((student) => ({
    ...student,
    country: student.country || quranCountry,
  }));

  const upsellQuranStudents = (data.upsellQuranStudents || []).map((student) => ({
    ...student,
    country: student.country || quranCountry,
  }));

  return {
    submission_id: buildSubmissionId(Date.now()),
    source: 'website',
    status: 'submitted',
    lead_type: data.leadType,
    parent_name: data.parentName,
    email: data.email,
    whatsapp: data.whatsapp,
    country: data.country,
    other_country: data.otherCountryName,
    quran_student_country: quranCountry || null,
    student_name: data.studentName,
    age: data.age,
    grade: data.grade,
    curriculum: data.curriculum,
    quran_interest: data.quranInterest || false,
    tuition_interest: data.tuitionInterest || false,
    school_interest: data.fullTimeInterest || false,
    coupon_code: data.couponCode || null,
    discount_type: data.appliedCoupon?.discountType || null,
    discount_value: data.appliedCoupon?.discountValue || null,
    referrer_name: data.appliedCoupon?.referrerName || null,
    students: data.students || [],
    quran_students: quranStudents,
    upsell_tuition: data.upsellTuitionStudents || [],
    upsell_school: data.upsellSchoolStudents || [],
    upsell_quran: upsellQuranStudents,
    raw_data: {
      ...data,
      quranStudentCountry: data.quranStudentCountry || quranCountry,
      quranStudents,
      upsellQuranStudents,
    },
  };
};

const buildWebhookHeaders = () => {
  const submissionToken = import.meta.env.VITE_SUBMISSION_TOKEN;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (submissionToken) {
    headers.Authorization = `Bearer ${submissionToken}`;
  }

  return headers;
};

export const submitRegistration = async (
  data: FormData
): Promise<SubmitRegistrationResult> => {
  try {
    const supabase = getSupabaseClient();
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    const payload = buildSubmissionPayload(data);

    const supabaseResult = await supabase.from('registrations').insert([payload]);

    if (supabaseResult.error) {
      return {
        success: false,
        error: supabaseResult.error.message || 'Supabase submission failed',
        details: {
          supabase: supabaseResult,
        },
      };
    }

    if (!webhookUrl) {
      return {
        success: true,
        details: {
          supabase: supabaseResult,
        },
      };
    }

    const webhookResult = await fetch(webhookUrl, {
      method: 'POST',
      headers: buildWebhookHeaders(),
      body: JSON.stringify(payload),
    });

    if (!webhookResult.ok) {
      return {
        success: false,
        error: `Webhook submission failed with status ${webhookResult.status}`,
        details: {
          supabase: supabaseResult,
          webhook: webhookResult,
        },
      };
    }

    return {
      success: true,
      details: {
        supabase: supabaseResult,
        webhook: webhookResult,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected submission error',
    };
  }
};

export default submitRegistration;
