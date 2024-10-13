import pluginJs from "@eslint/js";
import putout from "@putout/plugin-merge-duplicate-imports";
import configPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import pathAlias from "eslint-plugin-path-alias";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginPrettier.configs.recommended,
    configPrettier,
    {
        languageOptions: {
            sourceType: "module",
            ecmaVersion: "latest",
        },
        plugins: {
            import: eslintPluginImport,
            "simple-import-sort": simpleImportSort,
            "merge-duplicate-imports": putout,
            "path-alias": pathAlias,
        },

        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
            "react/prop-types": "off",
            "no-undef": ["error", { typeof: true }],
            "import/no-relative-packages": "error",
            "react/react-in-jsx-scope": "off",
            "path-alias/no-relative": "error",
        },
    },
];
