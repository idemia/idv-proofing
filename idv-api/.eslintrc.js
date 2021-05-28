module.exports = {
  "parser": "babel-eslint",
  'plugins': [
    'jest'
  ],
  'env': {
    'jest/globals': true
  },
  'rules': {
    'comma-dangle': ['off'],
    'no-unused-vars': 'warn',
    'no-trailing-spaces': 'warn',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'object-curly-spacing': ['off'],
    'padded-blocks': ['off'],
    'space-before-function-paren': ['error', {
      'anonymous': 'ignore',
      'named': 'ignore',
      'asyncArrow': 'ignore'
    }],
    'react/no-array-index-key': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'react/forbid-prop-types': 'off',
    'react/no-danger': 'off',
    'react/style-prop-object': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-extra-boolean-cast': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['off'],
  },
  'parserOptions': {
    'ecmaFeatures': {
      'legacyDecorators': true
    }
  }
};