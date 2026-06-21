import { FormData } from '../../types';

type AppliedCoupon = NonNullable<FormData['appliedCoupon']>;

export const normalizeEnvKey = (value: string) =>
  value.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

export const validateCouponFromEnv = (code: string): AppliedCoupon | null => {
  try {
    const env = import.meta.env as Record<string, string | undefined>;
    const raw = env[`VITE_COUPON_${normalizeEnvKey(code)}`];

    if (!raw) return null;

    const [referrerName = '', discountType = '', discountValue = '', message = ''] = raw.split('|');
    const parsedDiscountValue = parseInt(discountValue, 10);

    if (!referrerName || !discountType || Number.isNaN(parsedDiscountValue)) {
      return null;
    }

    return {
      referrerName,
      discountType,
      discountValue: parsedDiscountValue,
      message,
    };
  } catch {
    return null;
  }
};

export const getUrlBasedCouponState = (): Pick<FormData, 'couponCode' | 'appliedCoupon'> => {
  if (typeof window === 'undefined') {
    return {
      couponCode: '',
      appliedCoupon: null,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const env = import.meta.env as Record<string, string | undefined>;

  const rawCoupon = params.get('coupon')?.trim() || '';
  const rawClient = params.get('client')?.trim() || '';

  let resolvedCouponCode = rawCoupon;

  if (!resolvedCouponCode && rawClient) {
    const clientMappedCoupon = env[`VITE_CLIENT_${normalizeEnvKey(rawClient)}`];
    if (clientMappedCoupon) {
      resolvedCouponCode = clientMappedCoupon.trim();
    }
  }

  if (!resolvedCouponCode) {
    return {
      couponCode: '',
      appliedCoupon: null,
    };
  }

  const normalizedCouponCode = normalizeEnvKey(resolvedCouponCode);
  const appliedCoupon = validateCouponFromEnv(normalizedCouponCode);

  if (!appliedCoupon) {
    return {
      couponCode: '',
      appliedCoupon: null,
    };
  }

  return {
    couponCode: normalizedCouponCode,
    appliedCoupon,
  };
};
