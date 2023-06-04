# Replication (80%)
Understand, try and play with the Solana SDK on Svelte Kit. Use the following steps to get started.
![alt text](https://github.com/Jonas002/images/blob/main/svelte-kit-solana-app.png?raw=true)

## Clone repo and start web server

```bash

## Clone repo
git clone https://github.com/Jonas002/sveltekit-solana.git

## Change directory 
cd .\sveltekit-solana\ ## for PowerShell / CMD or Windows
cd ./sveltekit-solana/ ## for Bash or Linux-based systems / Mac


## Install npm dependencies
npm install yarn
yarn install

# Start development server on localhost:3000
yarn dev --open

```


# Folder Structure (10%)
```bash
solana-sveltekit-app/
├ src/ 
│ ├ lib/
│ │ ├ server/ 
│ │ │ └ [your server-only lib files]
│ │ └ [your lib files]
│ ├ params/
│ │ └ [your param matchers]
│ ├ routes/ (-> page paths)
│ │ └ [your routes] 
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ └ hooks.server.js
├ static/
│ └ [your static assets]
├ tests/
│ └ [your tests]
├ package-lock.json
├ package.json
├ postcss.config.js
├ README.md
├ svelte.config.js
├ tailwind.config.js
├ tsconfig.json
└ vite.config.js
└ yarn.lock
```


# Requirements (10%)
- Required Packages
	- Node.js (v18.15.1) 
	- npm (v9.5.0)
	- yarn (v1.22.19)
- Other requirements
	Install wallet extension (at least one of two):
    - Phantom https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa
    - Solflare https://chrome.google.com/webstore/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic

