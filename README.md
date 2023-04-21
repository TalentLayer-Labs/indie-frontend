# Platform Frontend to manage platform on talentlayer

## About Platform Frontend

Platform Frontend is an open-source fork-able codebase that is available for marketplaces and other platforms integrating with [TalentLayer](https://docs.talentlayer.org/) to borrow from and use to get inspired.

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

## Steps for setup

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

## Steps to run in local

- `npm install`
- `npm run dev`

## VSCode useful plugins

- Tailwind CSS IntelliSense: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
