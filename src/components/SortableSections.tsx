import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Section } from "../types"
import { SortableSectionItem } from "./SortableSectionItem"
import { UniqueIdentifier } from "@dnd-kit/core"

interface SortableSectionsProps {
  sections: Section[]
  activeId: UniqueIdentifier
  parentId?: UniqueIdentifier
  allSections: Section[]
}

export const SortableSections = ({ sections, activeId, parentId, allSections }: SortableSectionsProps) => {

  return (
    <SortableContext items={sections} strategy={verticalListSortingStrategy}>
      {sections.map(section => <SortableSectionItem
            key={section.id}
            section={section}
            activeId={activeId}
            parentId={parentId}
            sections={allSections}
          />
      )}
    </SortableContext>
  )
}