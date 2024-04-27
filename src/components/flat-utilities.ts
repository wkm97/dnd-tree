import { UniqueIdentifier } from "@dnd-kit/core";
import { FlattenSection, Section } from "../types";
import _ from "lodash";
import { arrayMove } from "@dnd-kit/sortable";

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const INDENTATION_WITDH = convertRemToPixels(2)

export function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenSection[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number
) {
  const overItemIndex = items.findIndex(({id}) => id === overId);
  const activeItemIndex = items.findIndex(({id}) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, INDENTATION_WITDH);
  const projectedDepth = activeItem.depth + dragDepth;
  
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({nextItem});
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return {depth, maxDepth, minDepth, parentId: getParentId()};

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({previousItem}: {previousItem: FlattenSection}) {
  if (previousItem) {
    return previousItem.depth + 1;
  }

  return 0;
}

function getMinDepth({nextItem}: {nextItem: FlattenSection}) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  sections: Section[],
  parentId?: UniqueIdentifier,
  depth = 0
): FlattenSection[] {
  return sections.reduce<FlattenSection[]>((acc, section, index) => {
    return [
      ...acc,
      { ...section, parentId, depth, index },
      ...(section.sections ? flatten(section.sections, section.id, depth + 1) : []),
    ];
  }, []);
}

export function flattenTree(items: Section[]): FlattenSection[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenSection[]): Section[] {
  const root: Section = { id: 'root', sections: [], title: 'root' };
  const nodes: Record<string, Section> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, sections: [] }));

  for (const item of items) {
    const { id, ...others } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? items.find(({ id }) => id === parentId);

    nodes[id] = { id, ...others };
    parent.sections?.push(_.omit(item, ['depth', 'index', 'parentId']));
  }

  return root.sections || [];
}

export function removeChildrenOf(
  items: FlattenSection[],
  ids: UniqueIdentifier[]
) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.sections?.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}