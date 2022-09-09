import {
  Button,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import React from "react"
import CheckDead from "./CheckDead"
import Unclaimed from "./Unclaimed"

const TabSection = () => (
  <Tabs variant="soft-rounded" colorScheme="purple" w="100%">
    <TabList>
      <Tab color="whiteAlpha.700">Unclaimed Listings </Tab>
      <Tab color="whiteAlpha.700"> Check DeadGod</Tab>
    </TabList>

    <TabPanels>
      <TabPanel>
        <Unclaimed />
      </TabPanel>
      <TabPanel>
        <CheckDead />
      </TabPanel>
    </TabPanels>
  </Tabs>
)

export default TabSection
