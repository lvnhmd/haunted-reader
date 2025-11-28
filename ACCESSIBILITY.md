# Accessibility Features

The Haunted Reader implements comprehensive accessibility features to ensure the application is usable by everyone, including users with disabilities.

## Implemented Features

### Semantic HTML Structure
- **Landmark regions**: Proper use of `<header>`, `<main>`, `<nav>`, `<section>`, and `<article>` elements
- **Heading hierarchy**: Logical h1-h6 structure throughout the application
- **Skip link**: "Skip to main content" link for keyboard users (visible on focus)

### ARIA Attributes
- **ARIA labels**: Descriptive labels on all interactive elements
- **ARIA live regions**: Dynamic content updates announced to screen readers
  - Upload progress announcements
  - Spirit generation status updates
  - Error messages with `aria-live="assertive"`
- **ARIA roles**: Proper roles for custom components (tabs, buttons, status indicators)
- **ARIA states**: `aria-pressed`, `aria-selected`, `aria-current` for interactive elements
- **ARIA hidden**: Decorative emojis and icons marked as `aria-hidden="true"`

### Keyboard Navigation
- **Tab order**: Logical tab order through all interactive elements
- **Keyboard shortcuts**: Enter and Space keys work on custom buttons
- **Focus management**: Disabled elements removed from tab order with `tabIndex={-1}`
- **Skip navigation**: Skip link allows keyboard users to bypass navigation

### Focus Indicators
- **Enhanced focus styles**: 3px solid outline with 2px offset on all focusable elements
- **High contrast**: Focus indicators use primary theme color for visibility
- **Consistent styling**: Focus styles applied to buttons, links, inputs, and custom components

### Screen Reader Support
- **Descriptive labels**: All form inputs have associated labels
- **Status updates**: Loading states and progress announced via `aria-live`
- **Context information**: Statistics and counts include full descriptions
- **Error handling**: Errors announced immediately with `aria-live="assertive"`

### Color and Contrast
- **DaisyUI themes**: Built-in theme system ensures WCAG AA contrast ratios
- **Semantic colors**: Uses theme-aware colors that adapt to user preferences
- **Not color-dependent**: Information conveyed through text, not just color

### Text and Typography
- **Readable fonts**: Clear, legible font choices
- **Scalable text**: All text sizes use relative units (rem, em)
- **Line height**: Adequate spacing for readability
- **Text alternatives**: Emojis supplemented with text labels

## Testing Recommendations

### Keyboard Testing
1. Navigate entire app using only Tab, Shift+Tab, Enter, and Space
2. Verify skip link appears on first Tab press
3. Ensure all interactive elements are reachable
4. Check focus indicators are visible on all elements

### Screen Reader Testing
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA or JAWS
- **Linux**: Orca

Test scenarios:
1. Upload a file and verify progress announcements
2. Select spirits and verify selection states
3. Navigate interpretations and verify content structure
4. Check error messages are announced

### Browser DevTools
- Chrome Lighthouse accessibility audit
- Firefox Accessibility Inspector
- axe DevTools browser extension

## Known Limitations

1. **PDF parsing**: Complex PDFs may not preserve all structure
2. **Large files**: Progress updates may be delayed for very large files
3. **AI generation**: Long-running AI operations show loading state but no incremental progress

## Future Improvements

- [ ] Add keyboard shortcuts documentation (? key)
- [ ] Implement focus trap for modal dialogs
- [ ] Add high contrast mode toggle
- [ ] Support for reduced motion preferences
- [ ] Add ARIA descriptions for complex visualizations
- [ ] Implement breadcrumb navigation for multi-step flows

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [DaisyUI Accessibility](https://daisyui.com/docs/accessibility/)

## Compliance

This application aims to meet **WCAG 2.1 Level AA** standards. Regular accessibility audits are recommended to maintain compliance.
