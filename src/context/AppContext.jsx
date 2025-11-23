import { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * AppContext - Global state management for The Haunted Reader
 * Manages parsed text, spirit selections, interpretations, and loading states
 */

// Action types
export const ActionTypes = {
  SET_PARSED_TEXT: 'SET_PARSED_TEXT',
  CLEAR_PARSED_TEXT: 'CLEAR_PARSED_TEXT',
  SELECT_SPIRIT: 'SELECT_SPIRIT',
  DESELECT_SPIRIT: 'DESELECT_SPIRIT',
  SET_SELECTED_SPIRITS: 'SET_SELECTED_SPIRITS',
  ADD_INTERPRETATION: 'ADD_INTERPRETATION',
  REMOVE_INTERPRETATION: 'REMOVE_INTERPRETATION',
  CLEAR_INTERPRETATIONS: 'CLEAR_INTERPRETATIONS',
  SET_GENERATING: 'SET_GENERATING',
  ADD_LOADING_SPIRIT: 'ADD_LOADING_SPIRIT',
  REMOVE_LOADING_SPIRIT: 'REMOVE_LOADING_SPIRIT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  // Parsed text from file upload
  parsedText: null, // { content, structure, metadata }
  
  // Selected spirits for interpretation
  selectedSpirits: [], // Array of spirit IDs
  
  // Generated interpretations
  interpretations: new Map(), // Map<spiritId, Interpretation>
  
  // Loading states
  isGenerating: false,
  loadingSpirits: [], // Array of spirit IDs currently generating
  
  // Error state
  error: null, // { message, type, details }
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_PARSED_TEXT:
      return {
        ...state,
        parsedText: action.payload,
        error: null,
      };

    case ActionTypes.CLEAR_PARSED_TEXT:
      return {
        ...state,
        parsedText: null,
        interpretations: new Map(),
        selectedSpirits: [],
        loadingSpirits: [],
        isGenerating: false,
      };

    case ActionTypes.SELECT_SPIRIT:
      if (state.selectedSpirits.includes(action.payload)) {
        return state; // Already selected
      }
      return {
        ...state,
        selectedSpirits: [...state.selectedSpirits, action.payload],
      };

    case ActionTypes.DESELECT_SPIRIT:
      return {
        ...state,
        selectedSpirits: state.selectedSpirits.filter(id => id !== action.payload),
      };

    case ActionTypes.SET_SELECTED_SPIRITS:
      return {
        ...state,
        selectedSpirits: action.payload,
      };

    case ActionTypes.ADD_INTERPRETATION: {
      const newInterpretations = new Map(state.interpretations);
      newInterpretations.set(action.payload.spiritId, action.payload);
      return {
        ...state,
        interpretations: newInterpretations,
      };
    }

    case ActionTypes.REMOVE_INTERPRETATION: {
      const newInterpretations = new Map(state.interpretations);
      newInterpretations.delete(action.payload);
      return {
        ...state,
        interpretations: newInterpretations,
      };
    }

    case ActionTypes.CLEAR_INTERPRETATIONS:
      return {
        ...state,
        interpretations: new Map(),
        loadingSpirits: [],
        isGenerating: false,
      };

    case ActionTypes.SET_GENERATING:
      return {
        ...state,
        isGenerating: action.payload,
      };

    case ActionTypes.ADD_LOADING_SPIRIT:
      if (state.loadingSpirits.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        loadingSpirits: [...state.loadingSpirits, action.payload],
        isGenerating: true,
      };

    case ActionTypes.REMOVE_LOADING_SPIRIT:
      const newLoadingSpirits = state.loadingSpirits.filter(id => id !== action.payload);
      return {
        ...state,
        loadingSpirits: newLoadingSpirits,
        isGenerating: newLoadingSpirits.length > 0,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext(null);

/**
 * AppProvider - Wraps the app with global state
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setParsedText: useCallback((parsedText) => {
      dispatch({ type: ActionTypes.SET_PARSED_TEXT, payload: parsedText });
    }, []),

    clearParsedText: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_PARSED_TEXT });
    }, []),

    selectSpirit: useCallback((spiritId) => {
      dispatch({ type: ActionTypes.SELECT_SPIRIT, payload: spiritId });
    }, []),

    deselectSpirit: useCallback((spiritId) => {
      dispatch({ type: ActionTypes.DESELECT_SPIRIT, payload: spiritId });
    }, []),

    setSelectedSpirits: useCallback((spiritIds) => {
      dispatch({ type: ActionTypes.SET_SELECTED_SPIRITS, payload: spiritIds });
    }, []),

    addInterpretation: useCallback((interpretation) => {
      dispatch({ type: ActionTypes.ADD_INTERPRETATION, payload: interpretation });
    }, []),

    removeInterpretation: useCallback((spiritId) => {
      dispatch({ type: ActionTypes.REMOVE_INTERPRETATION, payload: spiritId });
    }, []),

    clearInterpretations: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_INTERPRETATIONS });
    }, []),

    setGenerating: useCallback((isGenerating) => {
      dispatch({ type: ActionTypes.SET_GENERATING, payload: isGenerating });
    }, []),

    addLoadingSpirit: useCallback((spiritId) => {
      dispatch({ type: ActionTypes.ADD_LOADING_SPIRIT, payload: spiritId });
    }, []),

    removeLoadingSpirit: useCallback((spiritId) => {
      dispatch({ type: ActionTypes.REMOVE_LOADING_SPIRIT, payload: spiritId });
    }, []),

    setError: useCallback((error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    }, []),

    clearError: useCallback(() => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    }, []),
  };

  const value = {
    state,
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useAppContext - Access global state and actions
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

/**
 * useAppState - Access just the state (read-only)
 */
export function useAppState() {
  const { state } = useAppContext();
  return state;
}

/**
 * useSpirits - Access spirit-related state and actions
 */
export function useSpirits() {
  const { state, actions } = useAppContext();
  
  return {
    selectedSpirits: state.selectedSpirits,
    selectSpirit: actions.selectSpirit,
    deselectSpirit: actions.deselectSpirit,
    setSelectedSpirits: actions.setSelectedSpirits,
  };
}

/**
 * useInterpretations - Access interpretation-related state and actions
 */
export function useInterpretations() {
  const { state, actions } = useAppContext();
  
  // Convert Map to Array for easier consumption
  const interpretationsArray = Array.from(state.interpretations.values());
  
  return {
    interpretations: interpretationsArray,
    interpretationsMap: state.interpretations,
    loadingSpirits: state.loadingSpirits,
    isGenerating: state.isGenerating,
    addInterpretation: actions.addInterpretation,
    removeInterpretation: actions.removeInterpretation,
    clearInterpretations: actions.clearInterpretations,
    addLoadingSpirit: actions.addLoadingSpirit,
    removeLoadingSpirit: actions.removeLoadingSpirit,
  };
}

/**
 * useParsedText - Access parsed text state and actions
 */
export function useParsedText() {
  const { state, actions } = useAppContext();
  
  return {
    parsedText: state.parsedText,
    setParsedText: actions.setParsedText,
    clearParsedText: actions.clearParsedText,
  };
}

/**
 * useError - Access error state and actions
 */
export function useError() {
  const { state, actions } = useAppContext();
  
  return {
    error: state.error,
    setError: actions.setError,
    clearError: actions.clearError,
  };
}

export default AppContext;
