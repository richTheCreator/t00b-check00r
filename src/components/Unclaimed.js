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
} from "@chakra-ui/react"
import React, { useEffect } from "react"
import SolImg from "../images/sol.png"
import MagicImg from "../images/ME_logo.png"
import axios from "axios"

const ListingItem = () => (
  <Flex bg="blackAlpha.500" borderRadius="lg" p={4} w="100%">
    <Image
      w="80px"
      h="80px"
      borderRadius="lg"
      src="https://img-cdn.magiceden.dev/rs:fill:640:640:0:0/plain/https://metadata.degods.com/g/4009-dead.png"
      mr={2}
    />
    <Flex flexDirection="column" justifyContent="space-between">
      <Text fontSize="lg" fontWeight="bold" color="white">
        DeGod # 4010
      </Text>
      <Flex alignItems="center">
        <Image src={SolImg} w="20px" h="20px" mr={2} />
        <Text fontSize="lg" fontWeight="bold" color="white">
          91
        </Text>
      </Flex>
    </Flex>
    <Spacer />
    <Button alignSelf="center" borderRadius="3xl">
      <Image src={MagicImg} w="auto" h="20px" />
    </Button>
  </Flex>
)

const Unclaimed = () => {
  // api-mainnet.magiceden.dev/v2

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
    <Box height={["400px", "400px", "100%", "100%"]}>
      {/* <StatGroup mb={5}>
        <Stat>
          <StatLabel color="whiteAlpha.700">Floor</StatLabel>
          <StatNumber color="white">91 SOL</StatNumber>
        </Stat>
        <Stat>
          <StatLabel color="whiteAlpha.700"># Listed</StatLabel>
          <StatNumber color="white">2</StatNumber>
        </Stat>
      </StatGroup> */}
      <Heading size="xl" onClick={loadUnclaimedDeadGods} color="white" mb={2}>
        {" "}
        Coming soon 🚀
      </Heading>
      <Text fontSize="md" fontWeight="medium" color="whiteAlpha.800">
        {" "}
        Floor & listing info for DeadGods with unclaimed t00bs.{" "}
      </Text>
      {/* <ListingItem /> */}
    </Box>
  )
}

export default Unclaimed
