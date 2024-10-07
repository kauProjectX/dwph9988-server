// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules/**'], // node_modules 폴더는 검사에서 제외

    languageOptions: {
      ecmaVersion: 'latest', // 최신 ECMAScript 기능 사용
      sourceType: 'module', // 모듈 방식으로 코드를 해석
      globals: {
        browser: true, // 브라우저 환경을 위한 전역 변수 허용
        node: true, // Node.js 환경을 위한 전역 변수 허용
      },
    },

    plugins: {
      prettier: eslintPluginPrettier, // Prettier를 ESLint 플러그인으로 사용
    },

    rules: {
      'no-unused-vars': 'warn', // 사용되지 않는 변수가 있으면 경고
      'prettier/prettier': 'error', // Prettier 규칙 위반 시 오류
    },
  },
];
