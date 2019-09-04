module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "extends": [
    "eslint:recommended", // eslint-plugin-react
    "plugin:react/recommended", // eslint-plugin-react
    "plugin:@typescript-eslint/recommended",
  ],
  "plugins": [
    "@typescript-eslint",
    "react-hooks", // eslint-plugin-react-hooks
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error", // eslint-plugin-react-hooks, 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn", // eslint-plugin-react-hooks, 检查 effect 的依赖
  },
  "overrides": [
    {
      "rules": {}
    }
  ],
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  }
}