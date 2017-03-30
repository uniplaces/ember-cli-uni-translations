module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 5,
    sourceType: 'module',
    ecmaFeatures: {
      "experimentalObjectRestSpread": true
    }
  },
  extends: [
    'eslint:recommended'
  ],
  env: {
    'browser': true
  },
  rules: {
    "camelcase": [0, {"properties": "never"}],
    "no-console": ["error", { allow: ["warn", "error"] }]
  }
};
