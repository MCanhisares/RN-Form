// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      quotes: [2, "single", { avoidEscape: true }],
      "jsx-quotes": ["error", "prefer-double"],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "ignore" },
      ],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "react-native/no-raw-text": "off",
      "no-tabs": 0,
      "no-restricted-imports": "off",
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        {
          name: "react-redux",
          importNames: ["useSelector", "useDispatch"],
          message:
            "Use typed hooks `useAppDispatch` and `useAppSelector` instead.",
        },
      ],
      "react/jsx-no-bind": [
        "error",
        {
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
      "no-console": "error",
    },
  },
]);
