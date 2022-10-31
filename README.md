# web3-boilerplate

## Motivation

- Most existing boilerplates bring too many dependencies, or are not maintained anymore
- Let anyone choose their dependencies by documenting all the steps done to build the boilerplate

## Stacks

- [Vite](https://vitejs.dev)
- [ReactJS](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [React Router v6](https://reactrouter.com/en/main)
- [Ethers.js](https://docs.ethers.io/v5)
- [Wagmi](https://wagmi.sh)
- [WalletConnect - Web3Modal](https://github.com/WalletConnect/web3modal/blob/V2/docs/react.md)
- [Heroicons](https://heroicons.com/)
- [Headlessui](https://headlessui.com/)

## Dev stacks

- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

## Steps

- Init the react app with typescript using Vite: `npm create vite@latest dapp -- --template react-ts`
- Install ESLint: `npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript`
- Install Tailwind:
  - `npm install -D tailwindcss postcss autoprefixer`
  - `npx tailwindcss init -p`
- Install React Router: `npm install react-router-dom@6`
- Install Wagmi: `npm i wagmi ethers`
- Install web3modal: `npm install @web3modal/react @web3modal/ethereum ethers`
  - Create env file: `touch .env`
  - Define the wallect connect project Id: `VITE_WALLECT_CONNECT_PROJECT_ID`
- Install Heroicons: `npm i `

## VSCode useful plugins

- Tailwind CSS IntelliSense: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
