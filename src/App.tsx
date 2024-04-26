import { useEffect, useState } from 'react'
import { Accordion, Box, ChakraProvider, Container } from '@chakra-ui/react'
import { exampleSections } from './data'
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, UniqueIdentifier, closestCenter, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
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
  
  useEffect(()=> {
    if (!activeId || !overId) {
      return;
    }

    const result = moveNode(nodes, activeId, overId, offsetLeft)
    setSections(sectionMapper(result))

  }, [activeId, overId, nodes, offsetLeft])

  function handleDragMove({delta}: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
  }

  function handleDragOver({over}: DragOverEvent) {
    setOverId(over?.id ?? '');
  }

  function handleDragEnd({active, over}: DragEndEvent) {
    setActiveId('')
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
          <Accordion defaultIndex={[0]} allowMultiple>
            <SortableSections sections={sections} activeId={activeId} allSections={sections} />
          </Accordion>
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
