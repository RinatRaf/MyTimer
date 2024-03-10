module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:import/recommended'],
  rules: {
    'import/no-default-export': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/ignore': ['react-native'],
  },
};
