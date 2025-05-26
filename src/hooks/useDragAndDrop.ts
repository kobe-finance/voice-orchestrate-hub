
import { useState, useCallback, useRef } from 'react';

interface DragItem {
  id: string;
  type: string;
  data: any;
}

interface DragState {
  isDragging: boolean;
  draggedItem: DragItem | null;
  dropTarget: string | null;
}

interface UseDragAndDropOptions {
  onDrop?: (item: DragItem, target: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onFilesDrop?: (files: FileList) => void;
  acceptedTypes?: string[];
}

export const useDragAndDrop = ({
  onDrop,
  onReorder,
  onFilesDrop,
  acceptedTypes = []
}: UseDragAndDropOptions = {}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dropTarget: null
  });

  const dragCounter = useRef(0);

  const handleDragStart = useCallback((item: DragItem) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      dropTarget: null
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dropTarget: null
    });
    dragCounter.current = 0;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragState(prev => ({
      ...prev,
      dropTarget: targetId
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragState(prev => ({
        ...prev,
        dropTarget: null
      }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current = 0;

    // Handle file drops
    if (e.dataTransfer.files.length > 0 && onFilesDrop) {
      const files = e.dataTransfer.files;
      onFilesDrop(files);
      setDragState({
        isDragging: false,
        draggedItem: null,
        dropTarget: null
      });
      return;
    }

    // Handle item drops
    if (dragState.draggedItem && onDrop) {
      onDrop(dragState.draggedItem, targetId);
    }

    setDragState({
      isDragging: false,
      draggedItem: null,
      dropTarget: null
    });
  }, [dragState.draggedItem, onDrop, onFilesDrop]);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (onReorder) {
      onReorder(fromIndex, toIndex);
    }
  }, [onReorder]);

  const getDragProps = useCallback((item: DragItem) => ({
    draggable: true,
    onDragStart: () => handleDragStart(item),
    onDragEnd: handleDragEnd,
    className: dragState.draggedItem?.id === item.id ? 'opacity-50 scale-95' : ''
  }), [dragState.draggedItem, handleDragStart, handleDragEnd]);

  const getDropProps = useCallback((targetId: string) => ({
    onDragOver: handleDragOver,
    onDragEnter: (e: React.DragEvent) => handleDragEnter(e, targetId),
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => handleDrop(e, targetId),
    className: dragState.dropTarget === targetId ? 'ring-2 ring-primary bg-primary/10' : ''
  }), [dragState.dropTarget, handleDragOver, handleDragEnter, handleDragLeave, handleDrop]);

  return {
    dragState,
    getDragProps,
    getDropProps,
    handleReorder
  };
};
