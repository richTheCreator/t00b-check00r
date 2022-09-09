import { Button, Image, Tooltip } from "@chakra-ui/react"
import React from "react"
import SolImg from "../images/sol.png"
import { CopyToClipboard } from "react-copy-to-clipboard"

const TipJar = React.forwardRef(({ children, ...rest }, ref) => (
  <CopyToClipboard text={"G54X99FX3UbE8JoZYXZXckXnKhRbmuAnouMUQVQkgvkF"}>
    <Button borderRadius="3xl" width="fit-content" ref={ref} {...rest}>
      <Image src={SolImg} w="24px" h="24px" mr={2} /> G54X...gvkF
    </Button>
  </CopyToClipboard>
))

export default TipJar
