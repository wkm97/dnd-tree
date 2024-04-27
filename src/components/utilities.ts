import { UniqueIdentifier } from "@dnd-kit/core";
import { Section, SectionNode } from "../types";
import _ from "lodash";

export const getSection = (id: UniqueIdentifier, sections: Section[]) => {
  const searchSection = (sections: Section[], id: UniqueIdentifier): Section | null => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      if (section.id === id) {
        return section;
      }

      const foundSection = searchSection(section.sections || [], id);

      if (foundSection) {
        return foundSection;
      }
    }

    return null;
  };

  return searchSection(sections, id);
};

export const getSectionNode = (id: UniqueIdentifier, sections: SectionNode[]) => {
  const searchSectionNode = (sectionNodes: SectionNode[], id: UniqueIdentifier): SectionNode | null => {
    for (let i = 0; i < sectionNodes.length; i++) {
      const section = sectionNodes[i];

      if (section.id === id) {
        return section;
      }

      const foundSection = searchSectionNode(section.sections || [], id);

      if (foundSection) {
        return foundSection;
      }
    }

    return null;
  };

  return searchSectionNode(sections, id);
};

export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function sectionNodeMapper(sections: Section[], depth = 0, parentId?: UniqueIdentifier): SectionNode[] {
  return sections.map((section, idx) => ({
    ...section,
    depth: depth,
    index: idx,
    parentId: parentId,
    sections: section.sections ? sectionNodeMapper(section.sections, depth + 1, section.id) : []
  }));
}

export function sectionMapper(nodes: SectionNode[]): Section[] {
  return nodes.map((node) => {
    const { sections, ...section } = _.omit(node, ['depth', 'index', 'parentId'])
    if (sections && sections.length > 0) {
      return {
        ...section,
        sections: sectionMapper(sections)
      }
    }
    return section
  })
}


const INDENTATION_WITDH = convertRemToPixels(2)

export function getProjection(
  sections: Section[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number
) {
  const nodes = sectionNodeMapper(sections)
  const activeSection = getSectionNode(activeId, nodes)
  const overSection = getSectionNode(overId, nodes)
  const dragDepth = getDragDepth(dragOffset, INDENTATION_WITDH)
  const projectedDepth = activeSection ? activeSection.depth + dragDepth : 0

  const minDepth = overSection ? overSection.depth : 0
  const maxDepth = overSection ? overSection.depth + 1 : 0
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: overSection?.parentId };
}

export function moveNode(
  sections: SectionNode[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number
): SectionNode[] {
  if (!activeId || !overId) {
    return sections;
  }

  if (overId === activeId) {
    return sections
  }

  const { depth, parentId } = getProjection(sections, activeId, overId, dragOffset)

  const activeSection = getSectionNode(activeId, sections)
  const overSection = getSectionNode(overId, sections)
  const newSection = removeSection(activeId, sections)
  if (activeSection && overSection && depth === overSection.depth) {
    return insertAfter(activeSection, overId, newSection) as SectionNode[]
  }
  if (activeSection && overSection && depth > overSection.depth) {
    return insertSubSession(activeSection, overId, newSection) as SectionNode[]
  }
  return sections
}

function removeSection(id: UniqueIdentifier, sections: Section[]) {
  return sections.reduce<Section[]>((updatedSections, section) => {
    if (section.id !== id) {
      updatedSections.push({
        ...section,
        sections: section.sections ? removeSection(id, section.sections) : []
      });
    }
    return updatedSections;
  }, []);
}

function insertSubSession(sectionInsert: Section, parentId: UniqueIdentifier, sections: Section[]): Section[] {
  return sections.reduce<Section[]>((updatedSections, section) => {
    if (section.id === parentId) {
      // Found the parent section, update its sections
      return [...updatedSections, { ...section, sections: [...(section.sections || []), sectionInsert] }];
    } else if (section.sections) {
      // Recursively search for overId in child sections
      const updatedChildSections = insertSubSession(sectionInsert, parentId, section.sections);
      return [...updatedSections, { ...section, sections: updatedChildSections }];
    }
    // Add the section as is if not the parent or doesn't have child sections
    return [...updatedSections, section];
  }, []);
}

function insertBefore(sectionInsert: Section, beforeId: UniqueIdentifier, sections: Section[]): Section[] {
  return sections.reduce<Section[]>((updatedSections, section) => {
    if (section.id === beforeId) {
      // Insert the new section before the current section
      return [...updatedSections, sectionInsert, section];
    } else if (section.sections) {
      // Recursively insert into child sections if overId exists there
      const updatedChildSections = insertBefore(sectionInsert, beforeId, section.sections);
      return [...updatedSections, { ...section, sections: updatedChildSections }];
    }
    // Add the section as is if not the overId or doesn't have child sections
    return [...updatedSections, section];
  }, []);
}

function insertAfter(sectionInsert: Section, afterId: UniqueIdentifier, sections: Section[]): Section[] {
  return sections.reduce<Section[]>((updatedSections, section) => {
    if (section.id === afterId) {
      // Insert the new section before the current section
      return [...updatedSections, section, sectionInsert];
    } else if (section.sections) {
      // Recursively insert into child sections if overId exists there
      const updatedChildSections = insertAfter(sectionInsert, afterId, section.sections);
      return [...updatedSections, { ...section, sections: updatedChildSections }];
    }
    // Add the section as is if not the overId or doesn't have child sections
    return [...updatedSections, section];
  }, []);
}