export type TroubleItem = {
  title: string;
  situation: string[];
  cause: string[];
  solution: string[];
  learned: string[];
  hidden?: boolean;
};

export type StackReason = {
  name: string;
  reason: string;
  hidden?: boolean;
};

export type OtherProject = {
  name: string;
  emoji: string;
  period: string;
  description: string;
  stack: string;
  links: { label: string; href: string }[];
  hidden?: boolean;
};

export type ExperienceItem = {
  title: string;
  period: string;
  desc: string;
  hidden?: boolean;
};

export type ExperienceGroup = {
  category: string;
  color: string;
  items: ExperienceItem[];
  hidden?: boolean;
};

export type Profile = {
  name: string;
  title: string;
  footerYear: string;
  githubUrl: string;
  blogUrl: string;
  notionUrl: string;
  notionLabel: string;
  email: string;
};

export type HeroData = {
  roleTitle: string;
  description: string;
};

export type AboutBlock = {
  heading: string;
  body: string;
  hidden?: boolean;
};

export type AboutData = {
  blocks: AboutBlock[];
};

export type RoleHighlightItem = {
  title: string;
  desc: string;
  hidden?: boolean;
};

export type ContribGroupItem = {
  category: string;
  items: string[];
  hidden?: boolean;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectCore = {
  name: string;
  badgeLabel: string;
  badgeColor: string;
  badgeBg: string;
  period: string;
  tagline: string;
  links: ProjectLink[];
  roleSummary: string;
  roleHighlights: RoleHighlightItem[];
  contribGroups: ContribGroupItem[];
  hidden?: boolean;
};

export type SkillItem = {
  name: string;
  comment: string;
  bullets: string[];
  hidden?: boolean;
};

export type SkillGroup = {
  category: string;
  skills: SkillItem[];
  hidden?: boolean;
};

export type SkillsData = {
  intro: string;
  groups: SkillGroup[];
};

export type PortfolioData = {
  profile: Profile;
  hero: HeroData;
  about: AboutData;
  projects: Record<string, ProjectCore>;
  skills: SkillsData;
  troubles: Record<string, TroubleItem[]>;
  stackReasons: Record<string, StackReason[]>;
  otherProjects: OtherProject[];
  experiences: ExperienceGroup[];
  projectImages: Record<string, string>;
};
