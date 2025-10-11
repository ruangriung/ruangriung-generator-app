import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type NormalizedEmail = {
  address: string;
  formatted: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export const normalizeEmailAddress = (value: unknown): NormalizedEmail | null => {
  if (typeof value !== 'string') {
    return null;
  }

  let input = value.trim();

  if (!input) {
    return null;
  }

  if (input.toLowerCase().startsWith('mailto:')) {
    input = input.slice(7);
  }

  const angleBracketMatch = input.match(/^(.*)<([^>]+)>$/);
  let address = input;
  let displayName: string | undefined;

  if (angleBracketMatch) {
    displayName = angleBracketMatch[1]?.trim().replace(/^["']|["']$/g, '').replace(/[\r\n]+/g, ' ');
    address = angleBracketMatch[2]?.trim() ?? '';
  }

  if (!EMAIL_REGEX.test(address)) {
    return null;
  }

  const formatted = displayName ? `${displayName} <${address}>` : address;

  return { address, formatted };
};

export const sanitizeEmail = (value: unknown): string => {
  const normalized = normalizeEmailAddress(value);
  return normalized?.address ?? '';
};

export const sanitizeSenderAddress = (value: unknown, fallback: string): string => {
  const normalized = normalizeEmailAddress(value);
  if (normalized) {
    return normalized.formatted;
  }

  const fallbackNormalized = normalizeEmailAddress(fallback);
  return fallbackNormalized?.formatted ?? fallback;
};

export const sanitizeEmailAddresses = (values: Array<string | undefined | null>) => {
  const seen = new Set<string>();
  const recipients: string[] = [];

  const addNormalized = (normalized: NormalizedEmail | null) => {
    if (!normalized) {
      return;
    }

    const key = normalized.address.toLowerCase();

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    recipients.push(normalized.formatted);
  };

  values.forEach(value => {
    if (typeof value !== 'string') {
      addNormalized(normalizeEmailAddress(value));
      return;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    const normalized = normalizeEmailAddress(trimmed);

    if (normalized) {
      addNormalized(normalized);
      return;
    }

    if (trimmed.includes(',')) {
      trimmed
        .split(',')
        .map(part => part.trim())
        .forEach(part => addNormalized(normalizeEmailAddress(part)));
    }
  });

  return recipients;
};

export const createTransportOptions = (user: string, pass: string): SMTPTransport.Options => {
  const configuredService = sanitizeString(process.env.NODEMAILER_SERVICE);

  if (configuredService) {
    return {
      service: configuredService,
      auth: {
        user,
        pass,
      },
    } satisfies SMTPTransport.Options;
  }

  const host = sanitizeString(process.env.NODEMAILER_SMTP_HOST) || 'smtp.gmail.com';
  const parsedPort = process.env.NODEMAILER_SMTP_PORT ? Number(process.env.NODEMAILER_SMTP_PORT) : NaN;
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 465;
  const secureSetting = sanitizeString(process.env.NODEMAILER_SMTP_SECURE).toLowerCase();
  const secure = secureSetting
    ? ['true', '1', 'yes', 'on'].includes(secureSetting)
    : true;

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  } satisfies SMTPTransport.Options;
};

export const createEmailTransporter = () => {
  const nodemailerUser = sanitizeEmail(process.env.NODEMAILER_EMAIL);
  const nodemailerPass = sanitizeString(process.env.NODEMAILER_APP_PASSWORD);

  if (!nodemailerUser || !nodemailerPass) {
    throw new Error('NODEMAILER_EMAIL atau NODEMAILER_APP_PASSWORD belum dikonfigurasi dengan benar.');
  }

  const transportOptions = createTransportOptions(nodemailerUser, nodemailerPass);
  const transporter = nodemailer.createTransport(transportOptions);

  return { transporter, nodemailerUser };
};
