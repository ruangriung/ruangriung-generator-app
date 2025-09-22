import type { LucideIcon } from 'lucide-react';
import {
  Facebook,
  Globe,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
} from 'lucide-react';

export type SocialKey =
  | 'facebook'
  | 'youtube'
  | 'instagram'
  | 'threads'
  | 'x'
  | 'website';

export type SocialPlatform = {
  key: SocialKey;
  label: string;
  icon: LucideIcon;
};

export const socialPlatforms: SocialPlatform[] = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'threads', label: 'Threads', icon: MessageCircle },
  { key: 'x', label: 'X (d/h Twitter)', icon: Twitter },
  { key: 'website', label: 'Website', icon: Globe },
];
