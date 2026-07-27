'use client';

import { ReactNode } from 'react';
import { GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function DragHandle(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
      aria-label="Reordenar"
      {...props}
    >
      <GripVertical className="size-5" />
    </button>
  );
}

export function SortableSectionItem({
  id,
  children,
}: {
  id: string;
  children: (props: {
    dragHandleProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
    isDragging: boolean;
  }) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  } as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragHandleProps, isDragging })}
    </div>
  );
}

export function SeccionItemsSortableList({
  itemIds,
  disabled,
  onReorder,
  children,
}: {
  itemIds: string[];
  disabled?: boolean;
  onReorder: (orderedIds: string[]) => void;
  children: ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(itemIds, oldIndex, newIndex));
  }

  if (disabled) {
    return <div className="space-y-2">{children}</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">{children}</div>
      </SortableContext>
    </DndContext>
  );
}
