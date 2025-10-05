export type SubmissionType = 'prompt' | 'profile' | 'umkm';

export type SubmissionStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export type SubmissionPriority = 'low' | 'medium' | 'high';

export interface ModerationItem {
  id: string;
  type: SubmissionType;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: SubmissionStatus;
  priority: SubmissionPriority;
  channel: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  notes?: string;
  tags?: string[];
  relatedLink?: string;
  assignee?: string;
  lastUpdated?: string;
}

export interface PublishedResource {
  id: string;
  type: SubmissionType;
  title: string;
  url: string;
  status: 'published';
  owner?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface DashboardSummary {
  promptsPublished: number;
  profilesPublished: number;
  umkmPublished: number;
}

export interface DashboardSnapshot {
  summary: DashboardSummary;
  publishedResources: PublishedResource[];
}
