import type { Inquiry, UserRole } from "@/lib/types";

// ─── Mock User Inquiries (Batch 2 / Spec 32) ───────────────────────────────

export interface MockDashboardInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  agentName: string;
  agentAvatar: string;
  submittedDate: string;
  message: string;
  status: "pending" | "replied" | "closed";
  replyMessage?: string;
  replyDate?: string;
}

export const mockUserInquiries: MockDashboardInquiry[] = [
  {
    id: "inq-101",
    propertyId: "apt-nyc-buy",
    propertyTitle: "The Grand Penthouse at Central Park",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
    agentName: "Sophia Chen",
    agentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    submittedDate: "2026-06-12",
    message: "Hi Sophia, I would love to schedule a virtual video walkthrough of this penthouse next Tuesday afternoon. Let me know if that works for you.",
    status: "replied",
    replyMessage: "Hello Alex! Tuesday afternoon works perfectly. I will send you a calendar invite with the Zoom link shortly. Looking forward to showing you the penthouse!",
    replyDate: "2026-06-13",
  },
  {
    id: "inq-102",
    propertyId: "house-malibu-buy",
    propertyTitle: "Pacific Horizon Villa",
    propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    agentName: "James Okafor",
    agentAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    submittedDate: "2026-06-14",
    message: "Hello James, what is the current HOA fee and annual property tax rate for Pacific Horizon Villa?",
    status: "pending",
  },
  {
    id: "inq-103",
    propertyId: "apt-tokyo-rent",
    propertyTitle: "Shibuya Skyloft Residence",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
    agentName: "Kenji Sato",
    agentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    submittedDate: "2026-05-28",
    message: "Is the lease period for this skyloft negotiable down to 6 months instead of 1 year? Let me know.",
    status: "closed",
    replyMessage: "Unfortunately, the owner strictly requires a minimum 12-month lease agreement. Let me know if you would like to explore similar rental options.",
    replyDate: "2026-05-29",
  }
];

// ─── Mock Admin Reports (Batch 4 / Spec 53) ──────────────────────────────────

export interface MockPlatformReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  entityType: "listing" | "user";
  reportedEntityName: string;
  reportedEntityId: string;
  reason: "Spam / Duplicate" | "Fraud / Scam" | "Inappropriate content" | "Harassment";
  details: string;
  status: "open" | "reviewing" | "resolved";
  submittedDate: string;
}

export const mockPlatformReports: MockPlatformReport[] = [
  {
    id: "rep-201",
    reporterName: "Michael Chang",
    reporterEmail: "michael.c@gmail.com",
    entityType: "listing",
    reportedEntityName: "Downtown Creative Co-Working Hub",
    reportedEntityId: "comm-london-rent",
    reason: "Fraud / Scam",
    details: "The price listed is misleading. When contacting the lister, they asked for a wire deposit upfront before checking the premises.",
    status: "open",
    submittedDate: "2026-06-13",
  },
  {
    id: "rep-202",
    reporterName: "Sarah Connor",
    reporterEmail: "sarah.c@sky.net",
    entityType: "user",
    reportedEntityName: "David Miller (Agent)",
    reportedEntityId: "agent-david-miller",
    reason: "Harassment",
    details: "Agent was sending unsolicited sales pitches repeatedly through personal SMS even after being asked to stop communicating.",
    status: "reviewing",
    submittedDate: "2026-06-11",
  },
  {
    id: "rep-203",
    reporterName: "Jessica Alba",
    reporterEmail: "j.alba@gmail.com",
    entityType: "listing",
    reportedEntityName: "Cozy Bedroom in Shared Flat",
    reportedEntityId: "room-london-share",
    reason: "Spam / Duplicate",
    details: "This property listing is active under two different lister profiles with slightly different titles.",
    status: "resolved",
    submittedDate: "2026-06-05",
  }
];

// ─── Mock Audit Logs (Batch 5 / Spec 60) ─────────────────────────────────────

export interface MockAuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export const mockAuditLogs: MockAuditLog[] = [
  {
    id: "aud-301",
    actorName: "Elena Rodriguez",
    actorRole: "super_admin",
    action: "Assigned Role (Agent)",
    target: "Alex Johnson (alex@brandestate.com)",
    timestamp: "2026-06-14T15:23:00Z",
    ipAddress: "192.168.1.45"
  },
  {
    id: "aud-302",
    actorName: "David Chen",
    actorRole: "admin",
    action: "Approved Listing",
    target: "The Grand Penthouse at Central Park",
    timestamp: "2026-06-14T10:12:00Z",
    ipAddress: "192.168.1.12"
  },
  {
    id: "aud-303",
    actorName: "Elena Rodriguez",
    actorRole: "super_admin",
    action: "Updated Feature Flag",
    target: "Enable Google OAuth (Disabled → Enabled)",
    timestamp: "2026-06-13T18:45:00Z",
    ipAddress: "192.168.1.45"
  },
  {
    id: "aud-304",
    actorName: "David Chen",
    actorRole: "admin",
    action: "Suspended User Account",
    target: "John Rogue (john.rogue@scam.com)",
    timestamp: "2026-06-12T09:30:00Z",
    ipAddress: "192.168.1.12"
  },
  {
    id: "aud-305",
    actorName: "System Daemon",
    actorRole: "super_admin",
    action: "Flushed Redis Cache",
    target: "All cache keys (global)",
    timestamp: "2026-06-11T00:00:00Z",
    ipAddress: "127.0.0.1"
  }
];

// ─── Analytics Mock Data ───────────────────────────────────────────────────

export const mockViewsHistory = [
  { name: "Week 1", views: 240, leads: 18, sales: 2 },
  { name: "Week 2", views: 350, leads: 28, sales: 3 },
  { name: "Week 3", views: 300, leads: 22, sales: 4 },
  { name: "Week 4", views: 480, leads: 38, sales: 5 },
  { name: "Week 5", views: 560, leads: 45, sales: 7 },
];

export const mockSavedPriceTrends = [
  { month: "Jan", "Average Price ($)": 850000 },
  { month: "Feb", "Average Price ($)": 870000 },
  { month: "Mar", "Average Price ($)": 860000 },
  { month: "Apr", "Average Price ($)": 890000 },
  { month: "May", "Average Price ($)": 920000 },
  { month: "Jun", "Average Price ($)": 940000 },
];

export const mockSignupsHistory = [
  { month: "Jan", Users: 120, Agents: 15 },
  { month: "Feb", Users: 180, Agents: 24 },
  { month: "Mar", Users: 240, Agents: 35 },
  { month: "Apr", Users: 310, Agents: 42 },
  { month: "May", Users: 450, Agents: 58 },
  { month: "Jun", Users: 520, Agents: 72 },
];
