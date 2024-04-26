import { DragHandleIcon } from "@chakra-ui/icons"
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, HStack, IconButton } from "@chakra-ui/react"
import { Section } from "../types"
import { forwardRef } from "react";

interface SectionComponentProps {
  section: Section
}

// export const SectionItemV1 = ({ section }: SectionComponentProps) => {
//   const { sections } = section
//   return (
//     <AccordionItem border='none'>
//       <h2>
//         <AccordionButton bg="gray.50">
//           <DragHandleIcon cursor="grab" />
//           <Box as='span' flex='1' textAlign='left' paddingX={2}>
//             {section.title}
//           </Box>
//           <AccordionIcon />
//         </AccordionButton>
//       </h2>
//       {sections &&
//         <AccordionPanel pb={0} ml={5} pr={0} pt={0} borderLeft="none">
//           {sections.map(s => <SectionItem key={s.id} section={s} />)}
//         </AccordionPanel>
//       }
//     </AccordionItem>
//   )
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SectionItem = forwardRef<any, React.PropsWithChildren<SectionComponentProps>>(
  ({ section, children, ...others }: React.PropsWithChildren<SectionComponentProps>, ref) => {

    const { sections } = section;
    return (
      <AccordionItem border='none'>
        <AccordionButton bg="gray.50">
          <IconButton aria-label="drag-icon" as="span" variant="transparent" icon={<DragHandleIcon />} ref={ref} {...others} />
          {/* <DragHandleIcon cursor="grab" ref={ref} {...others}/> */}
          <Box as='span' flex='1' textAlign='left' paddingX={2}>
            {section.title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        {sections &&
          <AccordionPanel pb={0} ml={4} pr={0} pt={0} borderLeft="none">
            {children}
          </AccordionPanel>
        }
      </AccordionItem>
    );
  }
);