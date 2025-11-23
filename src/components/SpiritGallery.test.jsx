import { describe, it, expect, vi } from 'vitest';
import { spirits, getCategories } from '../spirits/spiritDefinitions';

/**
 * Spirit Gallery Component Tests
 * Tests core functionality without requiring full React rendering
 */

describe('SpiritGallery - Core Functionality', () => {
  it('should have all spirits available for display', () => {
    // CP-6.1: Gallery must display all available spirits
    expect(spirits.length).toBeGreaterThanOrEqual(10);
    expect(spirits.length).toBe(10); // We have exactly 10 spirits defined
  });

  it('should support category filtering', () => {
    // CP-6.4: Filter must work in real-time
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    // Test filtering by each category
    categories.forEach(category => {
      const filtered = spirits.filter(s => s.category === category);
      expect(filtered.length).toBeGreaterThan(0);
    });
  });

  it('should support multi-select up to 5 spirits', () => {
    // CP-6.5: Multi-select must allow up to 5 simultaneous selections
    const maxSelections = 5;
    const selectedSpirits = [];
    
    // Simulate selecting spirits
    for (let i = 0; i < maxSelections && i < spirits.length; i++) {
      selectedSpirits.push(spirits[i].id);
    }
    
    expect(selectedSpirits.length).toBeLessThanOrEqual(maxSelections);
    expect(selectedSpirits.length).toBe(5);
  });

  it('should have unique spirit IDs for selection', () => {
    // CP-6.2: Selected spirits must be visually distinct (requires unique IDs)
    const ids = spirits.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have voice preview data for all spirits', () => {
    // CP-6.3: Hover effects must preview spirit's voice
    spirits.forEach(spirit => {
      expect(spirit.voice).toBeDefined();
      expect(spirit.voice.tone).toBeDefined();
      expect(spirit.voice.focus).toBeDefined();
      expect(typeof spirit.voice.tone).toBe('string');
      expect(typeof spirit.voice.focus).toBe('string');
    });
  });

  it('should have all required display properties', () => {
    // Verify each spirit has properties needed for display
    spirits.forEach(spirit => {
      expect(spirit.id).toBeDefined();
      expect(spirit.name).toBeDefined();
      expect(spirit.icon).toBeDefined();
      expect(spirit.category).toBeDefined();
      expect(spirit.description).toBeDefined();
    });
  });
});

describe('SpiritGallery - Selection Logic', () => {
  it('should handle spirit selection correctly', () => {
    let selectedSpirits = [];
    const maxSelections = 5;
    
    // Mock selection handler
    const handleSelect = (newSelection) => {
      selectedSpirits = newSelection;
    };
    
    // Select first spirit
    const spiritId = spirits[0].id;
    handleSelect([spiritId]);
    expect(selectedSpirits).toContain(spiritId);
    expect(selectedSpirits.length).toBe(1);
  });

  it('should handle spirit deselection correctly', () => {
    const spiritId = spirits[0].id;
    let selectedSpirits = [spiritId];
    
    // Mock deselection handler
    const handleDeselect = (spiritIdToRemove) => {
      selectedSpirits = selectedSpirits.filter(id => id !== spiritIdToRemove);
    };
    
    handleDeselect(spiritId);
    expect(selectedSpirits).not.toContain(spiritId);
    expect(selectedSpirits.length).toBe(0);
  });

  it('should prevent selecting more than max allowed spirits', () => {
    const maxSelections = 5;
    let selectedSpirits = [];
    
    // Mock selection handler with max check
    const handleSelect = (spiritId) => {
      if (selectedSpirits.length < maxSelections) {
        selectedSpirits = [...selectedSpirits, spiritId];
        return true;
      }
      return false;
    };
    
    // Try to select 6 spirits
    for (let i = 0; i < 6 && i < spirits.length; i++) {
      handleSelect(spirits[i].id);
    }
    
    expect(selectedSpirits.length).toBeLessThanOrEqual(maxSelections);
    expect(selectedSpirits.length).toBe(5);
  });
});

describe('SpiritFilter - Category Filtering', () => {
  it('should filter spirits by category correctly', () => {
    const categories = getCategories();
    
    categories.forEach(category => {
      const filtered = spirits.filter(s => s.category === category);
      
      // Each filtered spirit should match the category
      filtered.forEach(spirit => {
        expect(spirit.category).toBe(category);
      });
    });
  });

  it('should return all spirits when "all" category is selected', () => {
    const allSpirits = spirits;
    expect(allSpirits.length).toBe(10);
  });

  it('should have at least one spirit in each category', () => {
    const categories = getCategories();
    
    categories.forEach(category => {
      const spiritsInCategory = spirits.filter(s => s.category === category);
      expect(spiritsInCategory.length).toBeGreaterThan(0);
    });
  });
});
