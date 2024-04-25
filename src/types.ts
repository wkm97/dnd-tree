export type Section = {
  id: string;
  title: string;
  sections?: Section[]
  content?: string
};