const normalize = (value: string) => value.trim().toLowerCase();

const parseAdminEmails = () => {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) {
    return [] as string[];
  }

  return raw
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
};

const adminEmails = parseAdminEmails();

export const hasConfiguredAdminEmails = adminEmails.length > 0;

export const getAdminEmails = () => adminEmails.slice();

export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) {
    return false;
  }

  if (!hasConfiguredAdminEmails) {
    return true;
  }

  const target = normalize(email);
  return adminEmails.map(normalize).includes(target);
};
