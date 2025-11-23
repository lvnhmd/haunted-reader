# Interpretation Viewer Components

A comprehensive set of React components for displaying and comparing spirit interpretations of text.

## Components

### InterpretationViewer (Main Component)

The primary component that orchestrates the viewing experience with multiple view modes.

**Features:**
- Three view modes: Original Text, Single View, Comparison
- View mode toggle with responsive design
- Export all functionality
- Loading state tracking
- Statistics display

**Props:**
```typescript
{
  originalText: string;              // The original uploaded text
  interpretations: Interpretation[]; // Array of generated interpretations
  onExport: (interpretation: Interpretation) => void;
  onRegenerate: (spiritId: string) => void;
  onExportAll?: () => void;         // Optional: export all interpretations
  loadingSpirits?: string[];        // Optional: spirits currently generating
}
```

**Interpretation Type:**
```typescript
{
  spiritId: string;      // Must match a spirit ID from spiritDefinitions
  content: string;       // The generated interpretation text
  generatedAt: Date;     // Timestamp of generation
  wordCount: number;     // Word count of the interpretation
}
```

### InterpretationPanel

Displays a single interpretation with spirit information and controls.

**Features:**
- Spirit-specific loading messages
- Expandable/collapsible design
- Metadata display (timestamp, word count, category)
- Category-based color coding
- Independent scrolling
- Export and regenerate buttons

**Props:**
```typescript
{
  interpretation: Interpretation | null;
  onExport: (interpretation: Interpretation) => void;
  onRegenerate: (spiritId: string) => void;
  isLoading?: boolean;
  className?: string;
}
```

### ComparisonView

Side-by-side comparison of multiple interpretations.

**Features:**
- Supports up to 3 interpretations simultaneously
- Responsive grid layout
- Selection UI for choosing interpretations
- Independent scrolling per panel
- Comparison tips

**Props:**
```typescript
{
  interpretations: Interpretation[];
  onExport: (interpretation: Interpretation) => void;
  onRegenerate: (spiritId: string) => void;
  loadingSpirits?: string[];
  maxComparisons?: number;  // Default: 3
}
```

## Usage Examples

### Basic Usage

```jsx
import InterpretationViewer from './components/InterpretationViewer';

function App() {
  const [interpretations, setInterpretations] = useState([]);
  const [originalText, setOriginalText] = useState('');

  const handleExport = (interpretation) => {
    // Export single interpretation
    exportService.exportAsText({
      originalText,
      interpretations: [interpretation],
      metadata: {
        exportDate: new Date(),
        spiritsUsed: [interpretation.spiritId]
      }
    });
  };

  const handleRegenerate = async (spiritId) => {
    // Regenerate interpretation
    const newInterpretation = await interpretationEngine.generateSummary(
      originalText,
      spiritId
    );
    setInterpretations(prev => 
      prev.map(i => i.spiritId === spiritId ? newInterpretation : i)
    );
  };

  return (
    <InterpretationViewer
      originalText={originalText}
      interpretations={interpretations}
      onExport={handleExport}
      onRegenerate={handleRegenerate}
    />
  );
}
```

### With Loading States

```jsx
function App() {
  const [interpretations, setInterpretations] = useState([]);
  const [loadingSpirits, setLoadingSpirits] = useState([]);

  const generateInterpretations = async (spiritIds) => {
    setLoadingSpirits(spiritIds);
    
    const results = await Promise.all(
      spiritIds.map(id => interpretationEngine.generateSummary(text, id))
    );
    
    setInterpretations(results);
    setLoadingSpirits([]);
  };

  return (
    <InterpretationViewer
      originalText={text}
      interpretations={interpretations}
      loadingSpirits={loadingSpirits}
      onExport={handleExport}
      onRegenerate={handleRegenerate}
    />
  );
}
```

### With Export All

```jsx
function App() {
  const handleExportAll = () => {
    exportService.exportAll({
      originalText,
      interpretations,
      metadata: {
        exportDate: new Date(),
        spiritsUsed: interpretations.map(i => i.spiritId)
      }
    });
  };

  return (
    <InterpretationViewer
      originalText={originalText}
      interpretations={interpretations}
      onExport={handleExport}
      onRegenerate={handleRegenerate}
      onExportAll={handleExportAll}
    />
  );
}
```

## Styling

All components use Tailwind CSS with the spooky theme:
- Dark backgrounds (gray-900, gray-950)
- Category-based colors:
  - Purple: Authors (Poe, Dickens, Austen, etc.)
  - Red: Characters (Villain, Monster)
  - Blue: Perspectives (Child, Scholar)
  - Orange: Abstract (Prophet of Doom)
- Smooth transitions and hover effects
- Responsive design with mobile-first approach

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure
- Screen reader friendly
- Color contrast meets WCAG AA standards

## Integration with Other Services

### InterpretationEngine
```jsx
import { interpretationEngine } from './services/interpretationEngine';

const interpretation = await interpretationEngine.generateSummary(text, spiritId);
// Returns: { spiritId, content, generatedAt, wordCount }
```

### ExportService
```jsx
import { exportService } from './services/exportService';

await exportService.exportAsText({
  originalText,
  interpretations: [interpretation],
  metadata: { exportDate: new Date(), spiritsUsed: ['poe'] }
});
```

### Spirit Definitions
```jsx
import { getSpiritById } from './spirits/spiritDefinitions';

const spirit = getSpiritById('poe');
// Returns: { id, name, icon, category, description, voice, prompts }
```

## Performance Considerations

- Fixed height containers (600px) with internal scrolling
- Efficient rendering with conditional display
- No unnecessary re-renders
- Optimized for up to 10 interpretations
- Lazy evaluation of spirit data

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support
- Tailwind CSS v3+

## Future Enhancements

- Timeline view mode (mentioned in design)
- Keyboard shortcuts for view switching
- Print-friendly styling
- Interpretation comparison highlighting
- Annotation/note-taking features
- Diff view for comparing interpretations
- Search within interpretations
- Bookmarking favorite interpretations

## Troubleshooting

### Interpretations not displaying
- Verify interpretation objects have all required fields
- Check that spiritId matches a valid spirit in spiritDefinitions
- Ensure content is a non-empty string

### Loading states not showing
- Verify loadingSpirits array contains valid spirit IDs
- Check that loading states are cleared after generation completes

### Export not working
- Ensure onExport callback is provided
- Verify ExportService is properly configured
- Check browser console for errors

### Styling issues
- Verify Tailwind CSS is properly configured
- Check that all required Tailwind classes are included in build
- Ensure dark mode is enabled in Tailwind config

## Testing

See `InterpretationViewer.example.jsx` for a complete working example with sample data.

Run tests:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## License

MIT
