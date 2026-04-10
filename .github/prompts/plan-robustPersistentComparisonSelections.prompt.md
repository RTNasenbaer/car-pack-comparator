## Plan: Implement Robust Persistent Comparison Selections

This plan will make the car pack selections persist across reloads and language changes by storing a language-independent identifier.

**Steps**

1.  **Update Context and State**: In `src/context/AppProvider.tsx`:
    - Expand the `AppContextType` interface to manage the `fileName` of the selected packs (e.g., `selectedPackLeftId`).
    - Initialize the state for the selected pack IDs from `localStorage`.
    - If no selection is found in `localStorage`, default the left selection to `cupra_tavascan_standard_pack.xml` and the right to `cupra_tavascan_immersive_pack.xml`.
    - Use `useEffect` to save the pack IDs to `localStorage` whenever they change.
2.  **Update `App.tsx`**:
    - Read the selected pack IDs from the `AppContext`.
    - When the data is loaded (or re-loaded after a language change), use the IDs from the context to find the full pack objects from the new data and set them in the local state for the comparison components.
3.  **Pass Props to Components**: Pass the full selected pack objects from the `App.tsx` state down to the `PairwiseComparison` and `Matrix` components.

**Relevant files**

- `src/context/AppProvider.tsx` — To manage the persistent state of the selected pack IDs.
- `src/App.tsx` — To bridge the gap between the persistent IDs in the context and the language-specific data loaded from JSON files.

**Verification**

1.  On first load, "Standard Pack" and "Immersive Pack" are selected.
2.  Changing the selected packs and refreshing the page restores the selection.
3.  **Crucially, changing the language will keep the selected packs, but display their names and details in the newly selected language.**
4.  Changing the theme will not affect the selection.
