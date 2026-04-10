# Plan: Fixes and Code Refinements

This plan will first address the functional bug in the Pairwise Comparison feature to ensure consistent behavior across all languages. Then, it will tackle a series of code quality and performance improvements to make the application more robust and maintainable.

## Phase 1: Bug Fix - Consistent Initial Pairwise Comparison

**Description**
The "Pairwise Comparison" component doesn't update its selected packages when the language changes, causing it to break for languages other than English and German. This is because the component's internal state is not synchronized with the new data that is loaded when the language is switched.

**Steps**

1.  **Synchronize State with Props:** In [src/components/PairwiseComparison.tsx](src/components/PairwiseComparison.tsx), add a `useEffect` hook that listens for changes to the `data` prop.
2.  **Reset State on Data Change:** Inside the `useEffect` hook, reset the `leftPackName` and `rightPackName` states to use the first two packs from the new `data` prop. This will ensure that whenever the language changes, the component will correctly display the comparison for the new set of packages.

**Relevant files**

- [src/components/PairwiseComparison.tsx](src/components/PairwiseComparison.tsx) — This is where the state logic for the component resides and needs to be updated.
- [src/App.tsx](src/App.tsx) — The parent component that provides the `data` prop.

## Phase 2: Code Quality and Refinement

**Description**
This phase focuses on improving the overall quality, consistency, and performance of the codebase by addressing issues found during the code review.

**Steps**

1.  **Fix `AppContext` Issues:**
    - In [src/context/AppContext.tsx](src/context/AppContext.tsx), remove the unused `Language` type.
    - Separate the `useAppContext` hook from the context provider to follow React best practices.
    - Refactor the `useEffect` that sets the theme to avoid synchronous state updates that cause extra re-renders.
2.  **Improve `App.tsx` Robustness:**
    - In [src/App.tsx](src/App.tsx), implement a more user-friendly loading indicator (e.g., a spinner or skeleton screen).
    - Add error handling for the data fetching logic to gracefully handle cases where the data fails to load.
3.  **Refactor `PairwiseComparison.tsx`:**
    - In [src/components/PairwiseComparison.tsx](src/components/PairwiseComparison.tsx), extract complex inline helper functions (`byName`, `setFromCategory`, etc.) into a separate utility file.
    - Optimize the use of `Set` objects to avoid creating them multiple times in loops.
    - Use `useMemo` to memoize the results of expensive calculations.
4.  **General Code Cleanup:**
    - Add JSDoc comments to complex functions and components to improve readability.
    - In [src/components/Matrix.tsx](src/components/Matrix.tsx), correct the variable scope of `presentCount` and memoize feature calculations.
    - In [src/i18n/index.ts](src/i18n/index.ts), centralize the list of supported languages to avoid duplication.

**Relevant files**

- [src/context/AppContext.tsx](src/context/AppContext.tsx)
- [src/App.tsx](src/App.tsx)
- [src/components/PairwiseComparison.tsx](src/components/PairwiseComparison.tsx)
- [src/components/Matrix.tsx](src/components/Matrix.tsx)
- [src/i18n/index.ts](src/i18n/index.ts)

## Verification

1.  **Manual Testing (Bug Fix):**
    - Switch between all available languages (English, German, Spanish, French).
    - For each language, navigate to the "Pairwise Comparison" view and verify that two different car packages are selected for comparison by default.
2.  **Automated Checks (Code Quality):**
    - Run the linter and type checker to ensure no new errors have been introduced.
3.  **Manual Testing (General):**
    - Perform a full walkthrough of the application to ensure all functionality remains intact after the changes.
