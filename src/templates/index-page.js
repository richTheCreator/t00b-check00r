import React, { useState } from "react"
import { graphql } from "gatsby"
import {
  Center,
  chakra,
  FormLabel,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"
import { getMintAddress } from "../getMintAddress"
import Seo from "../components/SEO"

import "../components/global.css"
import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Input,
} from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import ClawVid from "../images/the_claw.mp4"
import TipJar from "../components/tipjar"
import TabSection from "../components/Tabs"

const tube_vid =
  "https://ipfs.io/ipfs/QmTUVcUpekrK9DC7fDNkqDSJEqFLBDTj7e2UkahgUseJnR?ext=mp4"

function MetaCard({ nftMeta }) {
  return (
    <Box
      maxW="220px"
      borderRadius="lg"
      borderWidth="4px"
      borderColor={nftMeta.claimed ? "red.700" : "purple"}
      overflow="hidden"
      border
    >
      <Image src={nftMeta.img} alt={`DeGods ${nftMeta.name}`} />
      <Box
        p="4"
        style={{
          background:
            "linear-gradient(108.74deg,rgba(67,113,150,.28),rgba(125,140,158,.28))",
        }}
      >
        <Box display="flex" alignItems="baseline">
          <Badge
            borderRadius="full"
            px="2"
            colorScheme={nftMeta.claimed ? "red" : "purple"}
          >
            {nftMeta.claimed ? "Claimed" : "Unclaimed"}
          </Badge>
        </Box>

        <Box mt="1" fontWeight="bold" as="h2" lineHeight="tight" noOfLines={1}>
          {nftMeta.name}
        </Box>
      </Box>
    </Box>
  )
}

const IndexPage = ({ data }) => {
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

  const { frontmatter } = data.markdownRemark

  return (
    <>
      <Seo />

      {/* MAIN CONTAINER */}
      <Flex flexWrap="wrap" w="100%" zIndex={200} overflow="hidden">
        <Flex
          w={["100%", "100%", "50%"]}
          h={["400px", "400px", "100vh"]}
          bg="purple.400"
          position="relative"
          overflow="hidden"
        >
          <Center zIndex={10} w="100%">
            <Flex flexDirection="column" alignItems="center">
              <Heading
                as="h1"
                size="2xl"
                color="white"
                fontFamily="Neucha"
                textAlign="center"
              >
                t00b check00r
              </Heading>
              <Text
                mb={5}
                fontSize="xl"
                color="white"
                fontFamily="Neucha"
                textAlign="center"
              >
                {" "}
                Find out if a DeadGod has claimed it's y00t t00b or not.
              </Text>
              <Text fontWeight="bold" fontSize="sm" color="white" mb="2">
                {" "}
                TIP THE CREAT00R
              </Text>

              <Tooltip label="Copy to clipboard" color="white">
                <TipJar />
              </Tooltip>
            </Flex>
          </Center>
          <chakra.video
            autoPlay
            playsInline
            loop
            zIndex={2}
            muted
            style={{
              objectFit: "cover",
              position: "absolute",
              height: "100%",
              top: "0px",
              left: "0px",
              bottom: "0px",
              right: "0px",
            }}
          >
            <source src={ClawVid} type="video/mp4" />
          </chakra.video>
        </Flex>
        <Flex w={["100%", "100%", "50%"]} bg="blackAlpha.800" p={[4, 4, 10]}>
          <TabSection />
        </Flex>

        {/* <Container
          zIndex="100"
          py="10"
          px="5"
          maxW="container.md"
          bgColor="transparent"
          centerContent
          pos="relative"
          justifyContent={["flex-start", "flex-start", "center"]}
          h="100vh"
        >
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            direction="column"
          >

            <MetaCard nftMeta={nftMeta} />
            <Box
              style={{
                background:
                  "linear-gradient(108.74deg,rgba(67,113,150,.28),rgba(125,140,158,.28))",
              }}
              borderRadius="6"
              p={5}
              w={["100%", "100%", "50%"]}
              mt={5}
              justifyContent="center"
              alignItems="center"
            >
              <FormLabel fontWeight="bold" color="white">
                DeadGod ID #{" "}
              </FormLabel>
              <Input
                variant="filled"
                placeholder="4010"
                onChange={handleNFTinput}
              />

              <Button
                mt={3}
                colorScheme="purple"
                variant="solid"
                w="100%"
                isLoading={isCheckingt00b}
                onClick={() => checkClaimStatus()}
              >
                {" "}
                check t00b
              </Button>
            </Box>
            <Flex
              flexDirection="column"
              alignItems="center"
              borderRadius="6"
              p={3}
              backgroundColor="blackAlpha.500"
              mt={4}
            >
              <Text color="white" fontWeight="black" fontSize="xs">
                💰 Tip @richTheCreat00r
              </Text>
              <Text color="white" fontSize="xs">
                G54X99FX3UbE8JoZYXZXckXnKhRbmuAnouMUQVQkgvkF
              </Text>
            </Flex>
          </Flex> 
        </Container> */}
      </Flex>

      {/* VIDEO BG */}
      {/* <Box
        width="100vw"
        height="100vh"
        position="absolute"
        overflow={"hidden"}
        left="0px"
        right="0px"
        bottom="0px"
        top="0px"
      >

      </Box> */}
    </>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
      }
    }
  }
`
