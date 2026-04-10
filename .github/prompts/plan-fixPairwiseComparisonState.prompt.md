## Plan: Fix State Management in PairwiseComparison

The `PairwiseComparison` component fails to update when the language changes because it stores pack names in its state, which become stale. The plan is to add a mechanism to reset this state whenever the underlying data changes.

**Steps**

1.  **Update PairwiseComparison Component**:
    - In [src/components/PairwiseComparison.tsx](src/components/PairwiseComparison.tsx), I will add a `useEffect` hook that listens for changes to the `data` prop.
    - When `data` changes (which happens on language switch), this hook will reset the `leftPackName` and `rightPackName` state variables to the default packs from the new dataset.

**Relevant files**

- [src/components/PairwiseComparison.tsx](src/components/PairwiseComparison.tsx) — This is the only file that needs to be modified.

**Verification**

1.  Run the application.
2.  Navigate to the Pairwise Comparison view.
3.  Switch the language to Spanish. The component should now correctly display the comparison.
4.  Switch the language to French. The component should also work correctly.
5.  Select different packs to compare and then switch the language again to ensure the state is properly reset in all cases.

This solution is robust because it makes the component reactive to the data it receives, ensuring the UI is always in sync with the application's state.
