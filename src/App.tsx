import { useState } from 'react'
import { Box, ChakraProvider, Container } from '@chakra-ui/react'
import { exampleSections } from './data'
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, UniqueIdentifier, closestCenter, closestCorners, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { SortableSections } from './components/SortableSections';
import { createPortal } from 'react-dom';
import { getSection } from './components/utilities';
import { buildTree, flattenTree, getProjection } from './components/flat-utilities';
import { FlattenSection } from './types';
import { arrayMove } from '@dnd-kit/sortable';

function App() {
  const [sections, setSections] = useState(() => exampleSections)
  const [activeId, setActiveId] = useState<UniqueIdentifier>('');
  const [offsetLeft, setOffsetLeft] = useState(0);
  const flattenedSections = flattenTree(sections)
  const activeSection = getSection(activeId, sections)

  function handleDragMove({ active, over, delta }: DragMoveEvent) {
    const projected = active && over
      ? getProjection(
        flattenedSections,
        active.id,
        over.id,
        delta.x
      )
      : null;

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenSection[] = JSON.parse(
        JSON.stringify(flattenedSections)
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId: parentId ? parentId : undefined };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);
      setSections(newItems);
    }
  }

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
  }

  function handleDragOver({ over }: DragOverEvent) {
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()
  }

  function resetState() {
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
          onDragCancel={() => resetState()}
          collisionDetection={closestCorners}
        >
          <SortableSections sections={sections} activeId={activeId} />
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
