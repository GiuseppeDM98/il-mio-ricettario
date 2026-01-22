/**
 * Global Toast Notification System
 *
 * Architecture: Custom pub-sub pattern (inspired by react-hot-toast)
 * - memoryState: Single source of truth (outside React)
 * - listeners: Array of React setState functions subscribed to state
 * - dispatch: Updates memoryState and notifies all listeners
 *
 * Why Custom Implementation (not react-hot-toast):
 * - Allows tight integration with shadcn/ui Toast components
 * - Full control over TOAST_LIMIT and dismiss behavior
 * - No external dependency with similar complexity
 *
 * Trade-offs:
 * - Side effects in reducer (lines 89-96) - violates React principles
 *   but necessary for auto-dismiss timing
 * - Memory state outside React - requires manual listener management
 */
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

// Limit to 1 visible toast at a time to prevent notification spam
// Multiple toasts stack in memory but only latest is shown
const TOAST_LIMIT = 1;

// 1000 seconds delay before removing toast from DOM
// Long delay allows smooth exit animations and prevents premature unmounting
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

/**
 * Generate sequential toast IDs
 *
 * Uses modulo to prevent overflow after Number.MAX_VALUE increments.
 * Simple counter is sufficient since IDs only need to be unique within
 * current session, not globally unique.
 */
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

// Store timeout handles outside React state to allow cleanup in reducer
// Map<toastId, timeout> enables canceling scheduled removals on early dismiss
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedule toast removal after TOAST_REMOVE_DELAY
 *
 * @param toastId - ID of toast to remove
 *
 * Used by DISMISS_TOAST reducer to schedule DOM removal after exit animation.
 * Prevents re-adding if toast is already scheduled (e.g., re-dismiss clicked).
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // KNOWN ISSUE: Side-effect in reducer violates React principles
      //
      // Why it's here: Auto-dismiss requires setTimeout, which is a side-effect.
      // Alternatives considered:
      // 1. useEffect in useToast hook - causes timing issues with multiple listeners
      // 2. Middleware pattern - adds complexity without solving core issue
      //
      // This works reliably in practice. Future: Consider moving to middleware
      // if more side-effects are added.
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Global listeners array: All useToast hooks subscribe to state changes
// This enables any component to trigger toasts that all listeners receive
const listeners: Array<(state: State) => void> = [];

// Memory state: Single source of truth outside React lifecycle
// Required because toast() function must be callable outside components
let memoryState: State = { toasts: [] };

/**
 * Dispatch action to update state and notify all subscribers
 *
 * Pattern: Pub-sub with manual listener management. All subscribed
 * components (via useToast) receive state updates.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

/**
 * Create and display a toast notification
 *
 * @param props - Toast properties (title, description, variant, etc.)
 * @returns Object with id, dismiss, and update methods
 *
 * Usage:
 *   const { dismiss } = toast({ title: "Success!" });
 *   dismiss(); // Manually dismiss
 *
 * Note: Can be called outside React components due to memory state pattern.
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Hook to access toast state and functions
 *
 * @returns Current toast state, toast creation function, and dismiss function
 *
 * Subscribes component to toast state changes. Multiple components can
 * use this hook and all will see the same toasts.
 *
 * Cleanup: Automatically unsubscribes on unmount to prevent memory leaks.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
    // Dependency on state triggers re-subscription on every state change
    // This is intentional to ensure listener reference stays current, preventing
    // stale closures in React 18 concurrent rendering
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };