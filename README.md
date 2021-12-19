# NFT Marketplace with SvelteKit and Magic
This is an NFT Marketplace DApp built with [SvelteKit](https://kit.svelte.dev/) and [Magic](https://magic.link/). It is a remix of both [Nader Dabit](https://twitter.com/dabit3)'s and [Sean Mullen](https://twitter.com/srmullen)'s apps - [Building a Full Stack NFT Marketplace on Ethereum with Polygon](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb) and [How to add Magic Link to a SvelteKit application](https://magic.link/posts/magic-svelte#logging_into_the_application), respectively.

Here's a [video format](https://www.youtube.com/watch?v=GuJg3IHA1to) explaining how the app was built.

# Getting Started
***Note:** The smart contracts for this DApp were only deployed on the local Hardhat network. To see how you can deploy to a test or main network, make sure to check out [Nader Dabit's tutorial](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb)!*

1. Clone this repo: `gh repo clone seemcat/nft-marketplace-svelte-magic` & run `npm install`.
2. Set up your `.env` file by first changing its file name: `mv .example-env .env`. Then create an account with [Magic](https://magic.link/). Grab your Publishable API Key; it's the value for `VITE_MAGIC_PUBLIC_KEY`. The Secret Key is the value for `MAGIC_SECRET_KEY`.
3. Spin up the local Hardhat network: `npx hardhat node`. This will create 19 test accounts which we will use later.
4. Deploy the smart contracts onto the local Hardhat network: `npx hardhat run scripts/deploy.js --network localhost`. 
5. Once you've deployed the smart contracts, the CLI will print out the addresses where the contracts were deployed. Run `mv example-config.js config.js` and paste the addresses into their rightful spots in the `config.js` file.
6. Run the client side: `npm run dev`.

   **Note:** There's currently a bug in one of the dependency files. While we wait for a fix, here's a workaround: 
   
   **a)** Go into `node_modules/electron-fetch/lib/index.es.js`. 
   
   **b)** Replace this line of code: `import { STATUS_CODES } from 'http';` with `import { getStatusCode } from 'http-status-codes';`. 
   
   **c)** Replace `STATUS_CODES[this.status]` with `getStatusCode[this.status]`.

   If you run `npm run dev`, the client side should now work.

7. Now that the app is running, create an account & Magic wallet by logging in. Once you've logged in, go into the Profile page. Here you will find your Public Address & Account Balance. 
7. You'll start off with a 0 balance. To add some test ETH to your Magic Wallet, use the [Rinkeby Faucet](https://www.rinkeby.io/#faucet).
8. Now that you have some test ETH, you can mint, buy or view NFTs!

# Any Questions?
If you run into any issues at all, please join the [Magic Discord Server](https://discord.gg/magiclabs) - this is where [Maricris](https://twitter.com/seemcat) & other Magicians hang out. We'd be more than happy to help!