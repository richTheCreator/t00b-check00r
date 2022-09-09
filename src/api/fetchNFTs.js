const axios = require("axios")

// export default function handler(req, res) {
export default async function handler(req, res) {
  let headers = {
    "User-Agent": "PostmanRuntime/7.29.2",
  }

  const getEden = async () => {
    var eden = []
    var done = false
    var x = 0
    var errCount = 0
    while (!done && errCount < 10) {
      await axios
        .get(
          `https://jittromney.com/getListedNFTsByQuery?q={"$match":{"collectionSymbol":"degods","takerAmount":{"$gte":0}},"$sort":{"takerAmount":1,"createdAt":-1},"$skip":${x},"$limit":20}`
        )
        .then(function (response) {
          if (response.data.results.length === 0) {
            done = true
          }
          eden = eden.concat(response.data.results)
          x += 20
        })
        .catch(function (error) {
          console.log(error)
          console.log(errCount)
          errCount++
        })
    }

    var cleaned = []
    var j = 0
    for (var i = 0; i < eden.length; i++) {
      const degodType = eden[i].attributes.filter(
        attr => attr.trait_type == "version"
      )[0].value

      if (degodType !== "DeadGod") {
        continue
      }
      eden[i].image = eden[i].img
      eden[i].mintId = eden[i].mintAddress
      eden[i].sol = eden[i].price
      cleaned[j] = eden[i]
      j++
    }

    return cleaned
  }

  const checkDeGodAPI = async mint_addr_arr => {
    const degod_url = "https://api.degods.com/y00ts/v1/claims"
    const data = {
      mintAddresses: mint_addr_arr,
    }

    const degodReq = {
      url: degod_url,
      data,
      method: "post",
    }
    try {
      const resDegodAPI = await axios(degodReq)
      return {
        success: true,
        data: resDegodAPI,
      }
    } catch (e) {
      console.log("error degod api", e)
      return {
        success: false,
        error: "Error checking claim status",
      }
    }
  }

  try {
    const edenRes = await getEden()
    const mint_addresses = edenRes.map(nft => nft.mintAddress)

    const claimRes = await checkDeGodAPI(mint_addresses)

    const filteredClaims = claimRes.data.data.deadGodStatuses.filter(
      nft => nft.claimable
    )

    // remove all items from edenRes that have claimable false
    const myArrayFiltered = edenRes.filter(el => {
      return filteredClaims.some(f => {
        return f.mintAddress === el.mintAddress
      })
    })

    return res.status(200).json({
      success: true,
      data: myArrayFiltered,
    })
  } catch (e) {
    console.log("error in magic eden fetch", e)
    return res.status(200).json({
      success: false,
      msg: "Failed to NFTs",
      error: e,
    })
  }
}
