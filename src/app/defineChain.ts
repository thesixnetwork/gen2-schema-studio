import { defineChains, connect } from "graz";

export const sixCustomChain = defineChains({
  fivenet: {
    chainId: "fivenet",
    currencies: [
      {
        coinDenom: "six",
        coinMinimalDenom: "usix",
        coinDecimals: 6,
        coinGeckoId: "six-network",
        coinImageUrl: "https://www.six.network/static/media/img-sec-5.16efec58a21f96b58e9d.png",
      },
    ],
    rpc: "https://rpc1.fivenet.sixprotocol.net",
    rest: "https://api1.fivenet.sixprotocol.net",
  },
  sixnet: {
    chainId: "sixnet",
    currencies: [
      {
        coinDenom: "six",
        coinMinimalDenom: "usix",
        coinDecimals: 6,
        coinGeckoId: "six-network",
        coinImageUrl: "https://www.six.network/static/media/img-sec-5.16efec58a21f96b58e9d.png",
      },
    ],
    rpc: "https://sixnet-rpc.sixprotocol.net",
    rest: "https://sixnet-api.sixprotocol.net",
  },
});

// @ts-ignore
connect(sixCustomChain.fivenet);