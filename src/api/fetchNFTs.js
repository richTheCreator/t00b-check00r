const axios = require("axios")

// export default function handler(req, res) {
export default async function handler(req, res) {
  let headers = {
    "User-Agent": "PostmanRuntime/7.29.2",
  }

  try {
    const result = await axios.get(
      "https://api-mainnet.magiceden.dev/v2/collections/degods/listings?offset=0&limit=20",
      {
        headers: headers,
      }
    )

    return res.status(200).json({
      success: true,
      msg: "NFTs from Magic Eden",
      data: result,
    })
  } catch (e) {
    console.log("error in magic eden fetch", e)
    return res.status(200).json({
      success: false,
      msg: e,
    })
  }
}
