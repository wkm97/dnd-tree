import { UniqueIdentifier } from "@dnd-kit/core";

export type Section = {
  id: string;
  title: string;
  sections?: Section[]
  content?: string
};

export interface SectionNode extends Section{
  depth: number
  index: number
  sections?: SectionNode[]
  parentId?: UniqueIdentifier
}

export interface FlattenSection extends Section {
  parentId?: UniqueIdentifier
  depth: number
  index: number
}