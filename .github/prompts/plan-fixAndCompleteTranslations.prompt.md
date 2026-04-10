## Plan: Fix and Complete Project Translations

This plan addresses two issues:

1.  The existing i18n implementation is not correctly applying translations to the UI.
2.  The data files in `public/` are not translated.

### Part 1: Implement UI Translations

The i18n setup is mostly correct, but the components are not using the `t()` translation function. This part of the plan will involve editing the components to use the translation function and adding the necessary translation keys to the JSON files.

**Steps:**

1.  **Analyze `src/App.tsx`**:
    - Get the `t` function from the `useTranslation` hook.
    - Replace hardcoded strings like `"Cupra Tavascan Pack Comparison"` with `t('header_title')`.
    - Add `'header_title'` and other new keys to `src/i18n/en.json`, `de.json`, `es.json`, and `fr.json`.
2.  **Analyze `src/components/Summary.tsx`**:
    - Apply the same process of using the `t` function for any hardcoded text.
3.  **Analyze `src/components/PairwiseComparison.tsx`**:
    - Apply the same process.
4.  **Analyze `src/components/Matrix.tsx`**:
    - Apply the same process.

### Part 2: Translate Data Files

The files `data_de.json`, `data_en.json`, `data_es.json`, and `data_fr.json` in `public/` need to be translated. I will assume `data.json` or `data_de.json` is the German source and translate it.

**Steps:**

1.  **Read `public/data.json`**: To understand the structure and content.
2.  **Translate Content**: Translate the values in the JSON structure to English, Spanish, and French.
3.  **Update `public/data_en.json`**: With the English translations.
4.  **Update `public/data_es.json`**: With the Spanish translations.
5.  **Update `public/data_fr.json`**: With the French translations.
6.  **Verify `public/data_de.json`**: Ensure it contains the German source text.

### Verification

1.  Run the application and switch languages to confirm that the UI text in `App.tsx` and other components changes.
2.  Verify that the data-driven parts of the application that use the `public/data_*.json` files also show translated content when the language is switched.

I will now proceed with this plan.
