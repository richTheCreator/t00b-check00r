import React, { useEffect, useState } from "react"
import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  Container,
  Image,
  Badge,
  FormLabel,
  useToast,
  Center,
} from "@chakra-ui/react"

import axios from "axios"

import { getMintAddress } from "../../src/getMintAddress"

function MetaCard({ nftMeta }) {
  return (
    <Box
      mt={5}
      maxW={["100%", "80%", "50%"]}
      borderRadius="lg"
      borderWidth="4px"
      borderColor={nftMeta.claimed ? "red.700" : "purple"}
      overflow="hidden"
      border
    >
      <Image src={nftMeta.img} alt={`DeGods ${nftMeta.name}`} />
      <Box p="4" bg="blackAlpha.500">
        <Box display="flex" alignItems="baseline">
          <Badge
            borderRadius="full"
            px="2"
            colorScheme={nftMeta.claimed ? "red" : "purple"}
          >
            {nftMeta.claimed ? "t00b claimed" : "t00b unclaimed"}
          </Badge>
        </Box>

        <Box
          mt="1"
          fontWeight="bold"
          color="white"
          as="h2"
          lineHeight="tight"
          noOfLines={1}
        >
          {nftMeta.name}
        </Box>
      </Box>
    </Box>
  )
}

const CheckDead = () => {
  const toast = useToast()
  const [nft_id, setNFTid] = useState("")

  const handleNFTinput = event => setNFTid(event.target.value)
  const [isCheckingt00b, setT00bCheck] = useState(false)
  const [nftMeta, setNftMeta] = useState({
    name: "Degod #4010",
    img: "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://metadata.degods.com/g/4009-dead.png",
    claimed: true,
  })

  const checkClaimStatus = async () => {
    setT00bCheck(true)

    const mint_address = getMintAddress(Number(nft_id))

    const blockRes = await checkBlockChainAPI(mint_address)

    // make call to check claimed status
    if (blockRes.success) {
      const degodRes = await checkDeGodAPI(mint_address)

      if (degodRes.success) {
        setNftMeta({
          img: blockRes.data.data.off_chain_data.image,
          name: blockRes.data.data.off_chain_data.name,
          claimed: !degodRes.claimable,
        })
      } else {
        toast({
          title: "Error",
          description: degodRes.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    } else {
      toast({
        title: "Error",
        description: blockRes.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }

    setT00bCheck(false)
  }

  const checkDeGodAPI = async mint_address => {
    const degod_url = "https://api.degods.com/y00ts/v1/claims"
    const data = {
      mintAddresses: [mint_address],
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
        claimable: resDegodAPI.data.deadGodStatuses[0].claimable,
      }
    } catch (e) {
      console.log("error degod api", e)
      return {
        success: false,
        error: "Error checking claim status",
      }
    }
  }

  const checkBlockChainAPI = async mint_address => {
    const blockchain_url =
      "https://api.theblockchainapi.com/v1/solana/nft?mint_address="

    let headers = {
      APISecretKey: process.env.GATSBY_BLOCKCHAIN_API_KEY,
      APIKeyId: process.env.GATSBY_BLOCKCHAIN_KEY_ID,
    }
    const blockReq = {
      url: `${blockchain_url}${mint_address}&network=mainnet-beta`,
      headers,
    }

    try {
      const resBlockChainAPI = await axios(blockReq)

      if (resBlockChainAPI.data.data.symbol == "DGOD") {
        const degodType =
          resBlockChainAPI.data.off_chain_data.attributes.filter(
            attr => attr.trait_type == "version"
          )[0].value

        if (degodType == "DeadGod") {
          return {
            success: true,
            data: resBlockChainAPI,
          }
        } else {
          return {
            success: false,
            error: "Only DeadGods can have t00bs claimed",
          }
        }
      } else {
        return {
          success: false,
          error: "Can only check DeGod mint addresses",
        }
      }
    } catch (e) {
      return {
        success: false,
        error: e.response.data.error_message,
      }
    }
  }

  const loadUnclaimedDeadGods = async mint_address => {
    try {
      const callNFTAPI = await fetch(
        "https://api-mainnet.magiceden.dev/v2/collections/degods/listings?offset=0&limit=20",
        {
          crossDomain: true,
        }
      )
      console.log("called API:", callNFTAPI)
    } catch (e) {
      console.log("error calling API:", e)
    }
  }

  return (
    <Flex
      w="100%"
      alignItems="flex-start"
      justifyContent="center"
      direction="column"
    >
      <Flex
        borderRadius="6"
        w={["100%", "100%", "500px"]}
        mt={5}
        justifyContent="center"
        alignItems="center"
      >
        <Box w={["65%", "65%", "75%"]} mr={2}>
          <FormLabel fontWeight="bold" color="white">
            DeadGod ID #{" "}
          </FormLabel>
          <Input
            variant="filled"
            placeholder="4010"
            onChange={handleNFTinput}
            _focus={{ bg: "white", color: "black" }}
          />
        </Box>
        <Button
          mt={3}
          colorScheme="purple"
          variant="solid"
          alignSelf="flex-end"
          w={["35%", "35%", "25%"]}
          isLoading={isCheckingt00b}
          onClick={() => checkClaimStatus()}
        >
          {" "}
          check t00b
        </Button>
      </Flex>
      <MetaCard nftMeta={nftMeta} />
    </Flex>
  )
}

export default CheckDead
