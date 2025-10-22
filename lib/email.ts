import nodemailer from 'nodemailer';
import type { TestAccount, Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type NormalizedEmail = {
  address: string;
  formatted: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export const resolveMailEnvValue = (baseName: string): string | undefined => {
  const direct = process.env[baseName];

  if (typeof direct === 'string' && direct.length > 0) {
    return direct;
  }

  const prefix = `${baseName}_`;
  const fallbackKey = Object.keys(process.env)
    .filter(key => key.startsWith(prefix))
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .find(key => {
      const value = process.env[key];
      return typeof value === 'string' && value.length > 0;
    });

  if (!fallbackKey) {
    return undefined;
  }

  const fallback = process.env[fallbackKey];
  return typeof fallback === 'string' && fallback.length > 0 ? fallback : undefined;
};

const collapseWhitespace = (value: string) => value.replace(/\s+/g, '');

export const sanitizeAppPassword = (value: unknown): string => {
  const trimmed = sanitizeString(value);

  if (!trimmed) {
    return '';
  }

  const collapsed = collapseWhitespace(trimmed);

  if (collapsed === trimmed) {
    return trimmed;
  }

  const looksLikeGmailAppPassword =
    /^[a-zA-Z0-9\s]+$/.test(trimmed) && collapsed.length === 16 && trimmed.length > collapsed.length;

  if (looksLikeGmailAppPassword) {
    return collapsed;
  }

  const shouldStripWhitespace = sanitizeString(process.env.NODEMAILER_STRIP_PASSWORD_WHITESPACE);

  if (shouldStripWhitespace && ['true', '1', 'yes', 'on'].includes(shouldStripWhitespace.toLowerCase())) {
    return collapsed;
  }

  return trimmed;
};

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

const splitEmailCandidates = (value: string) =>
  value
    .split(/[;,\n]+/)
    .map(part => part.trim())
    .filter(part => part.length > 0);

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

    splitEmailCandidates(trimmed).forEach(candidate => {
      addNormalized(normalizeEmailAddress(candidate));
    });
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
    : port === 465;

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

type EmailTransporterResult = {
  transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  nodemailerUser: string;
  getTestMessageUrl?: typeof nodemailer.getTestMessageUrl;
  testAccount?: TestAccount;
};

const resolveBooleanEnv = (value: string) => ['true', '1', 'yes', 'on'].includes(value.toLowerCase());

const shouldUseEthereal = () => {
  const override = sanitizeString(resolveMailEnvValue('NODEMAILER_USE_ETHEREAL'));

  if (override) {
    return resolveBooleanEnv(override);
  }

  const nodeEnv = sanitizeString(process.env.NODE_ENV).toLowerCase();
  return nodeEnv === 'test';
};

const createStreamPreviewTransporter = (reason: unknown): EmailTransporterResult => {
  console.warn(
    'Gagal membuat akun Ethereal untuk pengujian email. Menggunakan transporter buffer lokal.',
    reason,
  );

  const transporter = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
  });

  return {
    transporter,
    nodemailerUser: 'dev-inbox@localhost',
    getTestMessageUrl: info => {
      const message = (info as { message?: Buffer }).message;
      if (message instanceof Buffer) {
        return `data:message/rfc822;base64,${message.toString('base64')}`;
      }
      return `stream:${info.messageId}`;
    },
  } satisfies EmailTransporterResult;
};

const createEtherealTransporter = async (): Promise<EmailTransporterResult> => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    return {
      transporter,
      nodemailerUser: testAccount.user,
      getTestMessageUrl: nodemailer.getTestMessageUrl,
      testAccount,
    } satisfies EmailTransporterResult;
  } catch (error) {
    return createStreamPreviewTransporter(error);
  }
};

export const createEmailTransporter = async (): Promise<EmailTransporterResult> => {
  const nodemailerUser = sanitizeEmail(resolveMailEnvValue('NODEMAILER_EMAIL'));
  const nodemailerPass = sanitizeString(resolveMailEnvValue('NODEMAILER_APP_PASSWORD'));

  if (nodemailerUser && nodemailerPass) {
    const transportOptions = createTransportOptions(nodemailerUser, nodemailerPass);
    const transporter = nodemailer.createTransport(transportOptions);

    return { transporter, nodemailerUser } satisfies EmailTransporterResult;
  }

  if (shouldUseEthereal()) {
    return createEtherealTransporter();
  }

  throw new Error('NODEMAILER_EMAIL atau NODEMAILER_APP_PASSWORD belum dikonfigurasi dengan benar.');
};

export type { EmailTransporterResult };

