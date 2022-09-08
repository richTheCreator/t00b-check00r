import React, { useState } from "react"
import { graphql } from "gatsby"
import {
  Center,
  chakra,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"
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
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from "@chakra-ui/react"
import { Button, ButtonGroup } from "@chakra-ui/react"
import { CheckIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons"
import { StaticImage } from "gatsby-plugin-image"
import ClawVid from "../images/the_claw.mp4"
import MintVid from "../images/mint_vid.mp4"

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [mintAddress, setMintAddress] = useState("")
  const handleMintChange = event => setMintAddress(event.target.value)
  const [isCheckingt00b, setT00bCheck] = useState(false)
  const [nftMeta, setNftMeta] = useState({
    name: "Degod #4010",
    img: "https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://metadata.degods.com/g/4009-dead.png",
    claimed: true,
  })

  const checkClaimStatus = async () => {
    setT00bCheck(true)

    const blockRes = await checkBlockChainAPI()

    // make call to check claimed status
    if (blockRes.success) {
      const degodRes = await checkDeGodAPI()
      console.log("degodRes ----", degodRes)
      console.log("blockres ----", blockRes)

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

    console.log("block res", blockRes)
  }

  const checkDeGodAPI = async () => {
    const degod_url = "https://api.degods.com/y00ts/v1/claims"
    const data = {
      mintAddresses: [mintAddress],
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

  const checkBlockChainAPI = async () => {
    const blockchain_url =
      "https://api.theblockchainapi.com/v1/solana/nft?mint_address="

    let headers = {
      APISecretKey: process.env.GATSBY_BLOCKCHAIN_API_KEY,
      APIKeyId: process.env.GATSBY_BLOCKCHAIN_KEY_ID,
    }
    const blockReq = {
      url: `${blockchain_url}${mintAddress}&network=mainnet-beta`,
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
      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Find Mint Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="blackAlpha.600" pb={2}>
              {" "}
              The mint address can be located on a profile page from Magic Eden.
              It is not the address of the person that minted the NFT, these are
              unique for each solana NFT.{" "}
            </Text>
            <chakra.video
              autoPlay
              playsInline
              loop
              muted
              style={{
                objectFit: "cover",
              }}
            >
              <source src={MintVid} type="video/webm" />
            </chakra.video>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MAIN CONTAINER */}
      <Box w="100%" zIndex={200}>
        <Container
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
            <Heading mb={10} color="white" fontFamily="Neucha">
              t00b check00r
            </Heading>
            <MetaCard nftMeta={nftMeta} />
            <Box
              style={{
                background:
                  "linear-gradient(108.74deg,rgba(67,113,150,.28),rgba(125,140,158,.28))",
              }}
              borderRadius="6"
              p={5}
              w={["100%", "100%", "60%"]}
              mt={5}
              justifyContent="center"
              alignItems="center"
            >
              <Input
                variant="filled"
                placeholder="Mint Address of DeadGod"
                onChange={handleMintChange}
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
            <Link color="white" mt={2} onClick={onOpen}>
              {" "}
              How to find a mint address?
            </Link>
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
        </Container>
      </Box>

      {/* VIDEO BG */}
      <Box
        width="100vw"
        height="100vh"
        position="absolute"
        overflow={"hidden"}
        left="0px"
        right="0px"
        bottom="0px"
        top="0px"
      >
        <chakra.video
          autoPlay
          playsInline
          loop
          muted
          transform={[
            "scale(2) translateX(0px)",
            "scale(2) translateX(0px)",
            "scale(2) translateX(-150px)",
          ]}
          style={{
            objectFit: "cover",
            position: "relative",
            height: "100%",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
          }}
        >
          <source src={ClawVid} type="video/mp4" />
        </chakra.video>
      </Box>
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
