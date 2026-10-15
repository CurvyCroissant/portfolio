import type { MessageKey } from './messages';

export interface GalleryImage { image: string; captionKey: MessageKey; position?: string }
export interface Project {
  slug: string;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
  contextKey?: MessageKey;
  context?: string;
  technologies: string[];
  problemKey: MessageKey;
  solutionKey: MessageKey;
  impactKey: MessageKey;
  repository?: string;
  gallery: GalleryImage[];
}

export const projects: Project[] = [
  {
    slug: 'posture-alert', titleKey: 'proj-pa-title', descriptionKey: 'proj-pa-desc', contextKey: 'ctx-pe',
    technologies: ['Python', 'MediaPipe', 'OpenCV', 'Pandas'], problemKey: 'pa-prob', solutionKey: 'pa-sol', impactKey: 'pa-imp',
    repository: 'https://github.com/CurvyCroissant/Posture-Alert',
    gallery: [
      { image: 'projects/posture-alert/when-slouching.jpg', captionKey: 'pa-gal-1', position: 'top' },
      { image: 'projects/posture-alert/when-using-headphones.jpg', captionKey: 'pa-gal-2', position: 'top' },
      { image: 'projects/posture-alert/with-background-noise.jpg', captionKey: 'pa-gal-3', position: 'top' },
      { image: 'projects/posture-alert/when-looking-down.jpg', captionKey: 'pa-gal-4', position: 'top' },
    ],
  },
  {
    slug: 'code-doc-gen', titleKey: 'proj-cd-title', descriptionKey: 'proj-cd-desc', contextKey: 'ctx-pe',
    technologies: ['Python', 'Qwen2.5', 'HuggingFace', 'AST'], problemKey: 'cd-prob', solutionKey: 'cd-sol', impactKey: 'cd-imp',
    repository: 'https://github.com/CurvyCroissant/Code-Documentation-Generator',
    gallery: [
      { image: 'projects/code-documentation-generator/website.jpg', captionKey: 'cd-gal-1' },
      { image: 'projects/code-documentation-generator/outputted-documentation.jpg', captionKey: 'cd-gal-2', position: 'left' },
    ],
  },
  {
    slug: 'safefall', titleKey: 'proj-sf-title', descriptionKey: 'proj-sf-desc', context: 'Samsung Innovation Campus',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'Streamlit'], problemKey: 'sf-prob', solutionKey: 'sf-sol', impactKey: 'sf-imp',
    repository: 'https://github.com/CurvyCroissant/SafeFall',
    gallery: [
      { image: 'projects/safefall/website.jpg', captionKey: 'cd-gal-1' },
      { image: 'projects/safefall/fall-detected.jpg', captionKey: 'sf-gal-1', position: 'top' },
      { image: 'projects/safefall/no-fall-detected.jpg', captionKey: 'sf-gal-2', position: 'top' },
      { image: 'projects/safefall/fall-detection-summary.jpg', captionKey: 'sf-gal-3', position: 'left' },
    ],
  },
  {
    slug: 'route-planner', titleKey: 'proj-rp-title', descriptionKey: 'proj-rp-desc', contextKey: 'ctx-ac',
    technologies: ['Laravel', 'MySQL', 'Leaflet.js', 'Firebase'], problemKey: 'rp-prob', solutionKey: 'rp-sol', impactKey: 'rp-imp',
    gallery: [
      { image: 'projects/public-transport-route-planner/main-feature.jpg', captionKey: 'rp-gal-1', position: 'left' },
      { image: 'projects/public-transport-route-planner/account-registration.jpg', captionKey: 'rp-gal-2', position: 'top' },
    ],
  },
  {
    slug: 'crop-yield-predictor', titleKey: 'proj-cy-title', descriptionKey: 'proj-cy-desc', contextKey: 'ctx-pe',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'], problemKey: 'cy-prob', solutionKey: 'cy-sol', impactKey: 'cy-imp',
    gallery: [
      { image: 'projects/crop-yield-predictor/model-benchmarking.jpg', captionKey: 'cy-gal-1' },
      { image: 'projects/crop-yield-predictor/anomaly-detection.jpg', captionKey: 'cy-gal-2' },
      { image: 'projects/crop-yield-predictor/business-simulation.jpg', captionKey: 'cy-gal-3' },
    ],
  },
  {
    slug: 'personality-predictor', titleKey: 'proj-pp-title', descriptionKey: 'proj-pp-desc', contextKey: 'ctx-ac',
    technologies: ['Python', 'PyTorch', 'Flask'], problemKey: 'pp-prob', solutionKey: 'pp-sol', impactKey: 'pp-imp',
    gallery: [
      { image: 'projects/personality-predictor/1.jpg', captionKey: 'pp-gal-1', position: 'top' },
      { image: 'projects/personality-predictor/2.jpg', captionKey: 'pp-gal-2', position: 'top' },
      { image: 'projects/personality-predictor/3.jpg', captionKey: 'pp-gal-3', position: 'top' },
    ],
  },
];
