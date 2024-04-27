import { useCallback, useEffect, useState } from 'react'
import { Accordion, Box, ChakraProvider, Container } from '@chakra-ui/react'
import { exampleSections } from './data'
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, UniqueIdentifier, closestCenter, closestCorners, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { SortableSections } from './components/SortableSections';
import { createPortal } from 'react-dom';
import { sectionNodeMapper, convertRemToPixels, getDragDepth, getSection, getProjection, sectionMapper, moveNode } from './components/utilities';

function App() {
  const [sections, setSections] = useState(() => exampleSections)
  const [activeId, setActiveId] = useState<UniqueIdentifier>('');
  const [overId, setOverId] = useState<UniqueIdentifier>('');
  const [offsetLeft, setOffsetLeft] = useState(0);
  const activeSection = getSection(activeId, sections)
  const dragOffset = getDragDepth(offsetLeft, convertRemToPixels(2))
  const nodes = sectionNodeMapper(sections)

  const projected =
    activeId && overId
      ? getProjection(
        sections,
        activeId,
        overId,
        offsetLeft
      )
      : null;

  function handleDragMove({active, over, delta }: DragMoveEvent) {
    if (!over || !active) {
      return;
    }

    setSections(sections => {
      const nodes = sectionNodeMapper(sections)
      const result = moveNode(nodes, active.id, over.id, delta.x)
      return sectionMapper(result)
    })
  }

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
  }

  function handleDragOver({active, over, delta }: DragOverEvent) {
    // if (!over || !active) {
    //   return;
    // }

    // setSections(sections => {
    //   const nodes = sectionNodeMapper(sections)
    //   const result = moveNode(nodes, active.id, over.id, delta.x)
    //   return sectionMapper(result)
    // })
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId('')
    setOffsetLeft(0)
  }

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  return (
    <ChakraProvider>
      <Container mt={8}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          collisionDetection={rectIntersection}
        >
          <SortableSections sections={sections} activeId={activeId} allSections={sections} />
          {activeSection && createPortal(<DragOverlay>
            <Box as='span' flex='1' textAlign='left' paddingX={2}>
              {activeSection.title}
            </Box>
          </DragOverlay>, document.body)}
        </DndContext>
      </Container>
    </ChakraProvider>
  )
}

export default App
