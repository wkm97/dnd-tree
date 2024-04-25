import { useState } from 'react'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, ChakraProvider, Container } from '@chakra-ui/react'
import { exampleSections } from './data'
import { Section } from './types'
import { DragHandleIcon } from '@chakra-ui/icons';

interface SectionComponentProps {
  section: Section
}

const SectionComponent = ({ section }: SectionComponentProps) => {
  const { sections } = section
  return (
    <AccordionItem border='none'>
      <h2>
        <AccordionButton bg="gray.50">
          <DragHandleIcon cursor="grab" />
          <Box as='span' flex='1' textAlign='left' paddingX={2}>
            {section.title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      {sections &&
        <AccordionPanel pb={0} ml={5} pr={0} pt={0} borderLeft="none">
          {sections.map(s => <SectionComponent key={s.id} section={s} />)}
        </AccordionPanel>
      }
    </AccordionItem>
  )
}

function App() {
  const [sections, setSections] = useState(() => exampleSections)

  return (
    <ChakraProvider>
      <Container mt={8}>
        <Accordion defaultIndex={[0]} allowMultiple>
          {sections.map(s => <SectionComponent key={s.id} section={s} />)}
        </Accordion>
      </Container>
    </ChakraProvider>
  )
}

export default App
