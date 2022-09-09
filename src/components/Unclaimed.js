import {
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Flex,
  Box,
  Text,
  StatHelpText,
  StatArrow,
  Tab,
  Image,
  Spacer,
  Button,
  Heading,
  Link,
  Spinner,
  LinkOverlay,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import SolImg from "../images/sol.png"
import MagicImg from "../images/ME_logo.png"
import axios from "axios"

const ListingItem = ({ meta_data }) => {
  console.log("meta_data", meta_data)
  return (
    <Flex bg="blackAlpha.500" borderRadius="lg" p={4} w="100%" mb={2}>
      <Image w="80px" h="80px" borderRadius="lg" src={meta_data.image} mr={2} />
      <Flex flexDirection="column" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="bold" color="white">
          {meta_data.title}
        </Text>
        <Flex alignItems="center">
          <Image src={SolImg} w="20px" h="20px" mr={2} />
          <Text fontSize="lg" fontWeight="bold" color="white">
            {meta_data.price}
          </Text>
        </Flex>
      </Flex>
      <Spacer />

      <Link
        alignSelf="center"
        borderRadius="3xl"
        target="_blank"
        py={2}
        px={3}
        bg="white"
        href={`https://www.magiceden.io/item-details/${meta_data.mintId}`}
      >
        <Image src={MagicImg} w="auto" h="20px" />
      </Link>
    </Flex>
  )
}

const Unclaimed = () => {
  const [unclaimedDeads, setUnclaimedDeads] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(async () => {
    setLoading(true)

    // MIGHT INCLUDE IN CONTEXT
    const unclaimedRes = await loadUnclaimedDeadGods()
    if (unclaimedRes.data.success) {
      console.log("unclaimed res:", unclaimedRes)
      // @audit could consolidate these

      setUnclaimedDeads(unclaimedRes.data.data)
    }
    setLoading(false)
  }, [])

  const loadUnclaimedDeadGods = async () => {
    try {
      const callNFTAPI = await axios("/api/fetchNFTs")

      return callNFTAPI
    } catch (e) {
      return e
    }
  }

  return (
    <Box height="100%">
      {isLoading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
      {unclaimedDeads?.length > 0 && (
        <>
          <StatGroup mb={5}>
            <Stat>
              <StatLabel color="whiteAlpha.700">Floor</StatLabel>
              <StatNumber color="white">
                {unclaimedDeads[0]?.price || "-"} SOL
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="whiteAlpha.700"># Listed</StatLabel>
              <StatNumber color="white">
                {unclaimedDeads.length || 0}
              </StatNumber>
            </Stat>
          </StatGroup>

          {unclaimedDeads.map(nft => (
            <ListingItem meta_data={nft} />
          ))}
        </>
      )}
    </Box>
  )
}

export default Unclaimed
