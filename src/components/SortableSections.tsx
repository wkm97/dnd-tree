import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Section } from "../types"
import { SortableSectionItem } from "./SortableSectionItem"
import { UniqueIdentifier } from "@dnd-kit/core"
import { Accordion } from "@chakra-ui/react"
import { memo } from "react"

interface SortableSectionsProps {
  sections: Section[]
  activeId: UniqueIdentifier
  parentId?: UniqueIdentifier
}

export const SortableSections = memo(({ sections, activeId, parentId }: SortableSectionsProps) => {

  return (
    <SortableContext items={sections.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
      <Accordion defaultIndex={[]} index={sections.map((s, i) => i)} allowMultiple>
        {sections.map(section => <SortableSectionItem
          key={section.id}
          section={section}
          activeId={activeId}
          parentId={parentId}
        />
        )}
      </Accordion>
    </SortableContext>
  )
})