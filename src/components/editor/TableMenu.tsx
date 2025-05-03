import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  RowsIcon,
  ColumnsIcon,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Lock,
  Filter,
  Type,
  ArrowUpDown,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TableMenuProps {
  editor: Editor | null;
}

const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  if (!editor || !editor.isActive('table')) return null;

  const buttonClass =
    'p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200 flex items-center gap-1 text-sm';
  const dropdownItemClass =
    'w-full px-3 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-sm';

  const handleDropdownToggle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setClickPosition({ x: event.clientX, y: event.clientY });
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setClickPosition(null);
  };

  const confirmAction = (action: () => void, message: string) => {
    if (window.confirm(message)) {
      action();
      closeDropdowns();
    }
  };

  const getPopoverStyle = () => {
    if (!clickPosition) return {};
    // Adjust position to prevent overflow and ensure visibility
    const offset = 10; // Small offset from cursor
    let top = clickPosition.y + offset;
    let left = clickPosition.x + offset;

    // Basic viewport boundary checks
    const menuWidth = 160; // Approximate menu width
    const menuHeight = 200; // Approximate menu height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - offset;
    }
    if (top + menuHeight > viewportHeight) {
      top = clickPosition.y - menuHeight - offset;
    }

    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <div
      className="sticky bottom-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg max-w-fit mx-auto flex flex-wrap items-center gap-1"
      onClick={() => closeDropdowns()}
    >
      {/* Column Operations */}
      <Popover
        open={activeDropdown === 'column'}
        onOpenChange={(open) => setActiveDropdown(open ? 'column' : null)}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => handleDropdownToggle('column', e)}
            className={buttonClass}
            aria-label="Column Operations"
          >
            <ColumnsIcon size={16} />
            <MoreVertical size={14} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
          style={getPopoverStyle()}
          align="start"
          side="top"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className={dropdownItemClass}
          >
            <ArrowLeft size={14} /> Insert Left
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className={dropdownItemClass}
          >
            <ArrowRight size={14} /> Insert Right
          </button>

          <button
            type="button"
            onClick={() => {
              const newName = window.prompt('Enter column name:');
              if (newName) {
                console.log('Rename column to:', newName);
              }
            }}
            className={dropdownItemClass}
          >
            <Type size={14} /> Rename
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Sort ascending');
            }}
            className={dropdownItemClass}
          >
            <ArrowUpDown size={14} /> Sort
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Filter column');
            }}
            className={dropdownItemClass}
          >
            <Filter size={14} /> Filter
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Freeze column');
            }}
            className={dropdownItemClass}
          >
            <Lock size={14} /> Freeze
          </button>

          <hr className="my-1 border-gray-200 dark:border-gray-700" />

          <button
            type="button"
            onClick={() =>
              confirmAction(
                () => editor.chain().focus().deleteColumn().run(),
                'Are you sure you want to delete this column?',
              )
            }
            className={`${dropdownItemClass} text-red-600 dark:text-red-400`}
          >
            <Trash2 size={14} /> Delete
          </button>
        </PopoverContent>
      </Popover>

      {/* Row Operations */}
      <Popover
        open={activeDropdown === 'row'}
        onOpenChange={(open) => setActiveDropdown(open ? 'row' : null)}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => handleDropdownToggle('row', e)}
            className={buttonClass}
            aria-label="Row Operations"
          >
            <RowsIcon size={16} />
            <MoreVertical size={14} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
          style={getPopoverStyle()}
          align="start"
          side="top"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className={dropdownItemClass}
          >
            <ChevronUp size={14} /> Insert Above
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className={dropdownItemClass}
          >
            <ChevronDown size={14} /> Insert Below
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Duplicate row');
            }}
            className={dropdownItemClass}
          >
            <Copy size={14} /> Duplicate
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Freeze row');
            }}
            className={dropdownItemClass}
          >
            <Lock size={14} /> Freeze
          </button>

          <hr className="my-1 border-gray-200 dark:border-gray-700" />

          <button
            type="button"
            onClick={() =>
              confirmAction(
                () => editor.chain().focus().deleteRow().run(),
                'Are you sure you want to delete this row?',
              )
            }
            className={`${dropdownItemClass} text-red-600 dark:text-red-400`}
          >
            <Trash2 size={14} /> Delete
          </button>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

      {/* Text Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={buttonClass}
        aria-label="Align Left"
      >
        <AlignLeft size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={buttonClass}
        aria-label="Align Center"
      >
        <AlignCenter size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={buttonClass}
        aria-label="Align Right"
      >
        <AlignRight size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={buttonClass}
        aria-label="Justify"
      >
        <AlignJustify size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

      <button
        type="button"
        onClick={() =>
          confirmAction(
            () => editor.chain().focus().deleteTable().run(),
            'Are you sure you want to delete the entire table?',
          )
        }
        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200"
        aria-label="Delete Table"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TableMenu;
