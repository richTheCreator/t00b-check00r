const fs = require("fs")
const candyStore = require("./newCandyStore.json")


const store1addy = "8RMqBV79p8sb51nMaKMWR94XKjUvD2kuUSAkpEJTmxyx" //1-2500
// [ '1523', '510', '807', '427', '1523' ] dupes
const store2addy = "CWMLRQqPdH2cjUv9Jar1zzUd45Vv3yyid91KKWLLEFUa" //2501-1000


// const findDupe = arry => arry.filter((item, index) => arry.indexOf(item.id) !== index.id)
// const duplicateElements = findDupe(candyStore);
// console.log(duplicateElements);




const lookup = candyStore.reduce((a, e) => {
  a[e.id] = ++a[e.id] || 0
  return a
}, {})

console.log(candyStore.filter(e => lookup[e.id]))

// const newStore = nfts1.sort(function (nft1, nft2) {
//   return nft1.id - nft2.id
// })

// fs.writeFileSync(`./src/newCandyStore.json`, JSON.stringify(newStore, null, 2))
