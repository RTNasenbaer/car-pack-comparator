## Plan: Improve Comparison Selection Logic

This plan will adjust the application's behavior to set a better default comparison pair ("Standard" and "Immersive" packs) and make the user's selections persist across page refreshes.

**Steps**

1.  **Fix ESLint Warning**: Move the `AppContext` from `src/context/AppProvider.tsx` to `src/context/AppContext.tsx` to resolve the `react-refresh/only-export-components` warning.
2.  **Set Default Selections**: Modify the `AppProvider` component to initialize the comparison with "Standard Pack" and "Immersive Pack" if no selection is saved in local storage.
3.  **Persist Selections**: Use `useEffect` hooks within the `AppProvider` to save the selected packs for both the left and right sides of the comparison to local storage whenever they change.

**Relevant files**

- `src/context/AppProvider.tsx` — This is where the main logic for state management resides. We will modify it to handle default state and persistence.
- `src/context/AppContext.tsx` — This file will house the `AppContext` definition.

**Verification**

1.  After the changes, the ESLint warning in `AppProvider.tsx` should disappear.
2.  When you first load the application, the "Standard Pack" and "Immersive Pack" should be selected by default.
3.  If you change the selected packs, then refresh the page, your last selection should be restored.
4.  Switching languages should not reset your selected packs.
