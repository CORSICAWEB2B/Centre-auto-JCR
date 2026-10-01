import React, { useRef, useEffect } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'a';
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Component = 'span',
  className = '',
  style,
  multiline = false,
  href,
  onClick,
}) => {
  const { isEditing } = useSiteContent();
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value;
    }
  }, [value]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const text = e.currentTarget.innerText.trim();
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const editStyles = isEditing
    ? 'outline-dashed outline-1 outline-white/60 bg-white/10 hover:bg-white/15 px-1 py-0.5 rounded cursor-text'
    : '';

  const dynamicProps: any = {
    ref: elementRef,
    className: `${className} ${editStyles}`.trim(),
    style,
    contentEditable: isEditing,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    title: isEditing ? 'Cliquez pour modifier ce texte' : undefined,
  };

  if (!isEditing && href) {
    dynamicProps.href = href;
  }
  if (!isEditing && onClick) {
    dynamicProps.onClick = onClick;
  }

  return React.createElement(Component, dynamicProps, value);
};
