import { UniqueIdentifier } from "@dnd-kit/core"
import { Section } from "../types"
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable"
import { Box } from "@chakra-ui/react";
import { SectionItem } from "./SectionItem";
import { SortableSections } from "./SortableSections";

interface SortableSectionItemProps {
  section: Section
  activeId: UniqueIdentifier
  parentId?: UniqueIdentifier
  sections: Section[]
}

export const SortableSectionItem = ({ section, activeId, parentId, sections }: SortableSectionItemProps) => {
  const { id } = section;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: {
      id: id,
      type: "section",
      parent: parentId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: activeId !== null && id === activeId ? 0.3 : 1,
    backgroundColor: activeId !== null && id === activeId ? "green" : ""
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <SectionItem
        section={section}
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
      >
        {!isDragging &&
          <SortableSections activeId={activeId} sections={section.sections || []} allSections={sections} />
        }
      </SectionItem>
    </Box>
  )
}