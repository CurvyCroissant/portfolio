import type { MessageKey } from './messages';

export const site = {
  name: 'Aaron Nathanael',
  origin: 'https://curvycroissant.github.io',
  base: '/portfolio',
  email: 'aaronnathanaelishakleman@gmail.com',
  github: 'https://github.com/CurvyCroissant',
  linkedin: 'https://www.linkedin.com/in/aaron-nathanael',
  facts: { gpa: 3.90, sicParticipants: 1898, sicSemiFinalists: 80 },
} as const;

export interface TimelineEntry {
  title: string;
  titleKey?: MessageKey;
  subtitle?: string;
  subtitleKey?: MessageKey;
  descriptionKey: MessageKey;
  start: string;
  end?: string;
  certificate?: string;
  rotation?: number;
}

export const education: TimelineEntry[] = [
  { title: 'BINUS University', titleKey: 'inst-binus', subtitleKey: 'edu-binus-sub', descriptionKey: 'edu-binus-desc', start: '2023-09' },
  { title: 'Shibaura Institute of Technology', titleKey: 'inst-sit', subtitleKey: 'edu-sit-sub', descriptionKey: 'edu-sit-desc', start: '2026-04', end: '2026-07', certificate: 'certificates/sit-matriculation.jpg', rotation: 90 },
  { title: 'SMAK 1 BPK PENABUR Jakarta', subtitleKey: 'edu-smak-sub', descriptionKey: 'edu-smak-desc', start: '2020-07', end: '2023-06' },
];

export const experience: TimelineEntry[] = [
  { title: '', titleKey: 'exp-bca', subtitle: 'PT Bank Central Asia Tbk', descriptionKey: 'exp-bca-desc', start: '2026-08' },
  { title: '', titleKey: 'exp-guide', subtitle: 'Yummy Guide', descriptionKey: 'exp-guide-desc', start: '2026-06', end: '2026-07' },
  { title: '', titleKey: 'exp-aca', subtitle: 'Himpunan Mahasiswa Teknik Informatika (HIMTI), BINUS University', descriptionKey: 'exp-aca-desc', start: '2025-03', end: '2025-12' },
  { title: '', titleKey: 'exp-web', subtitle: 'Himpunan Mahasiswa Teknik Informatika (HIMTI), BINUS University', descriptionKey: 'exp-web-desc', start: '2024-03', end: '2024-12', certificate: 'certificates/himti-web-development-activist.jpg' },
  { title: '', titleKey: 'exp-bncc', subtitle: 'Bina Nusantara Computer Club (BNCC), BINUS University', descriptionKey: 'exp-bncc-desc', start: '2024-01', end: '2024-06' },
  { title: '', titleKey: 'exp-sic', subtitle: 'Samsung Innovation Campus by Skilvul', descriptionKey: 'exp-sic-desc', start: '2024-02', end: '2024-10', certificate: 'certificates/sic5-semi-final.jpg' },
  { title: '', titleKey: 'exp-ios', subtitle: 'iOS Foundation by Apple Developer Academy', descriptionKey: 'exp-ios-desc', start: '2023-07', end: '2023-08', certificate: 'certificates/ios-foundation.jpg' },
];

export const achievements: { titleKey: MessageKey; descriptionKey?: MessageKey; description?: string; image: string }[] = [
  { titleKey: 'ach-dl', descriptionKey: 'ach-dl-desc', image: 'certificates/deans-list.jpg' },
  { titleKey: 'ach-gj', description: 'COMPFEST 17 by Indie Game Ignite', image: 'certificates/game-jam.jpg' },
  { titleKey: 'ach-sic', descriptionKey: 'ach-sic-desc', image: 'certificates/sic5-semi-final.jpg' },
];

export interface Skill { label: string; category: MessageKey; featured?: boolean; translation?: MessageKey }
export const skills: Skill[] = [
  ...['Python', 'C', 'PHP', 'JavaScript', 'Swift', 'HTML', 'CSS'].map(label => ({ label, category: 'skill-languages' as const, featured: true })),
  ...['MySQL', 'Laravel', 'Streamlit', 'Firebase', 'React', 'Astro'].map(label => ({ label, category: 'skill-web' as const, featured: ['MySQL', 'Laravel'].includes(label) })),
  ...['PyTorch', 'Scikit-Learn', 'YOLOv8', 'HuggingFace', 'MediaPipe', 'OpenCV'].map(label => ({ label, category: 'skill-ai' as const })),
  ...['Git', 'NLTK', 'Pandas', 'NumPy'].map(label => ({ label, category: 'skill-tools' as const })),
  { label: 'Data Analytics', translation: 'skill-data', category: 'skill-tools' },
  { label: 'Machine Learning', translation: 'skill-ml', category: 'skill-specialties', featured: true },
  { label: 'Computer Vision', translation: 'skill-cv', category: 'skill-specialties', featured: true },
  { label: 'Web Development', translation: 'skill-wd', category: 'skill-specialties', featured: true },
];
