import { Section } from "./types";

export const exampleSections: Section[] = [
  {
    id: 'section_1',
    title: 'Section 1'
  },
  {
    id: 'section_2',
    title: 'Section 2',
    sections: [
      {
        id: 'section_2a',
        title: 'Section 2A',
      },
      {
        id: 'section_2b',
        title: 'Section 2B',
      }
    ]
  },
  {
    id: 'section_3',
    title: 'Section 3'
  },
]