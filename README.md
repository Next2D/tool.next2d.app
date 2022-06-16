[![UnitTest](https://github.com/Next2D/tool.next2d.app/actions/workflows/integration.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/integration.yml)
[![CodeQL](https://github.com/Next2D/tool.next2d.app/actions/workflows/codeql-analysis.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml)
[![Lint](https://github.com/Next2D/tool.next2d.app/actions/workflows/lint.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/lint.yml) \
[![license](https://img.shields.io/github/license/Next2D/tool.next2d.app)](https://github.com/Next2D/tool.next2d.app/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://next2d.app/ja/usage/index.html)
[![Discord](https://img.shields.io/discord/812136803506716713?label=Discord&logo=discord)](https://discord.gg/6c9rv5Uns5)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/Next2D?label=Follow&style=social)](https://twitter.com/intent/user?screen_name=Next2D)

# About
developブランチは開発専用のブランチです。  
The develop branch is a development-only branch.

## Version
- Node.js v14.x
- npm 6.x

## Initial Settings
```
git clone -b develop git@github.com:Next2D/tool.next2d.app.git --recursive
cd tool.next2d.app
npm install -g gulp karma
npm install
```

## Start Development
```
gulp
```

## Unit Test
```
gulp test
```

## ESLint
```
gulp lint
```

## Build

```linux
npm run build
```

## Language

This is a JavaScript file to support other languages for NoCode Tool. \

```linux
src/languages/*.js
```

Japanese is used as the base language.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
