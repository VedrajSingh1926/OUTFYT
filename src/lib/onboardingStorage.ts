const DRAFT_KEY = 'stylesync_onboarding_draft';
const PAUSED_KEY = 'stylesync_onboarding_paused';

export interface OnboardingDraft {
  currentStep: number;
  uploadedImages: string[];
  manualText: string;
  wardrobeMode: 'upload' | 'manual';
  pendingItems: { name: string; category: string; color: string; colors: string[] }[];
  selectedOccasions: string[];
  selectedMood: string;
  selectedStyles: string[];
  location: string;
  hasWeatherPreview: boolean;
}

export function saveOnboardingDraft(draft: OnboardingDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadOnboardingDraft(): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearOnboardingDraft() {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(PAUSED_KEY);
}

export function setOnboardingPaused(paused: boolean) {
  if (paused) localStorage.setItem(PAUSED_KEY, '1');
  else localStorage.removeItem(PAUSED_KEY);
}

export function isOnboardingPaused(): boolean {
  return localStorage.getItem(PAUSED_KEY) === '1';
}
