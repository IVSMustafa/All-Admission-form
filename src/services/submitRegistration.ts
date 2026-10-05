import type { FormData } from '../../types';
import { buildSubmissionId } from '../utils/submissionPayloads';
import { formatPhoneForWhatsApp } from '../utils/validation';

type SubmitRegistrationResult = {
  success: boolean;
  error?: string;
  details?: {
    webhook?: unknown;
  };
};

const buildSubmissionPayload = (data: FormData) => {
  const resolvedResidenceCountry =
    data.countryOfResidence === 'Other'
      ? data.otherCountryOfResidence || 'Other'
      : data.countryOfResidence;

  const quranCountry =
    (data.quranStudentCountry === 'Other'
      ? resolvedResidenceCountry
      : data.quranStudentCountry) ||
    data.quranStudents?.find((student) => student.country)?.country ||
    data.upsellQuranStudents?.find((student) => student.country)?.country ||
    resolvedResidenceCountry ||
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
    whatsapp: formatPhoneForWhatsApp(data.country || 'Other', data.whatsapp),
    country: data.country,
    other_country: data.otherCountryName,
    country_of_residence: resolvedResidenceCountry,
    other_country_of_residence: data.otherCountryOfResidence || null,
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
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    const payload = buildSubmissionPayload(data);

    if (!webhookUrl) {
      return {
        success: false,
        error: 'Missing webhook configuration',
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
          webhook: webhookResult,
        },
      };
    }

    return {
      success: true,
      details: {
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
