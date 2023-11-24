import { Button, ButtonGroup, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import {  useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import type { FC } from "react";
import React from "react";

export const ChainSwitcher: FC = () => {
  const toast = useToast();

  const { isConnecting, isReconnecting } = useAccount({
    onConnect: ({ account, isReconnect }:any) => {
      if (!isReconnect) {
        toast({
          status: "success",
          title: "Switched chain!",
          description: `Connected as ${account.name}`,
        });
      }
    },
  });

  const { connect } = useConnect();

  return (
    <FormControl>
      <FormLabel>Switch Chain</FormLabel>
      <ButtonGroup flexWrap="wrap" gap={2} isDisabled={isConnecting || isReconnecting} size="sm" spacing={0}>
        <Button onClick={() => 
            // @ts-ignore
            connect(sixCustomChain.fivenet)}
            >
            {sixCustomChain.fivenet.chainId}
        </Button>
      </ButtonGroup>
      <FormLabel mt={2}>Suggest and connect chain</FormLabel>
      <ButtonGroup isDisabled={isConnecting || isReconnecting} size="sm">
      <Button onClick={() => 
            // @ts-ignore
            connect(sixCustomChain.sixnet)}
            >
            {sixCustomChain.sixnet.chainId}
        </Button>
      </ButtonGroup>
    </FormControl>
  );
};
