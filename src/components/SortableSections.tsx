import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Section } from "../types"
import { SortableSectionItem } from "./SortableSectionItem"
import { UniqueIdentifier } from "@dnd-kit/core"
import { Accordion } from "@chakra-ui/react"

interface SortableSectionsProps {
  sections: Section[]
  activeId: UniqueIdentifier
  parentId?: UniqueIdentifier
  allSections: Section[]
}

export const SortableSections = ({ sections, activeId, parentId, allSections }: SortableSectionsProps) => {

  return (
    <SortableContext items={sections.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
      <Accordion defaultIndex={[]} index={sections.map((s, i) => i)} allowMultiple>
        {sections.map(section => <SortableSectionItem
          key={section.id}
          section={section}
          activeId={activeId}
          parentId={parentId}
          sections={allSections}
        />
        )}
      </Accordion>
    </SortableContext>
  )
}