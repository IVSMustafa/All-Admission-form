import { COUNTRY_PHONE_DATA } from '../../constants';

export const formatPhoneForWhatsApp = (country: string, phone: string): string => {
  const data = COUNTRY_PHONE_DATA[country] || COUNTRY_PHONE_DATA["Other"];
  const clean = String(phone || "").replace(/\D/g, "");

  if (country === "Other") return `+${clean}`;

  return `${data.code}${clean}`;
};

export const validatePhoneLength = (country: string, phone: string): boolean => {
  const clean = String(phone || "").replace(/\D/g, "");

  if (country === "Other") return clean.length >= 7 && clean.length <= 15;

  const data = COUNTRY_PHONE_DATA[country] || COUNTRY_PHONE_DATA["Other"];
  const digits = data.digits || 0;
  return digits > 0 ? clean.length === digits : clean.length >= 7;
};
