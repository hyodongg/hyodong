export type TroubleItem = {
  title: string;
  situation: string[];
  cause: string[];
  solution: string[];
  learned: string[];
};

export type StackReason = {
  name: string;
  reason: string;
};

export type OtherProject = {
  name: string;
  emoji: string;
  period: string;
  description: string;
  stack: string;
  links: { label: string; href: string }[];
};

export type ExperienceItem = {
  title: string;
  period: string;
  desc: string;
};

export type ExperienceGroup = {
  category: string;
  color: string;
  items: ExperienceItem[];
};

export type PortfolioData = {
  troubles: Record<string, TroubleItem[]>;
  stackReasons: Record<string, StackReason[]>;
  otherProjects: OtherProject[];
  experiences: ExperienceGroup[];
};
