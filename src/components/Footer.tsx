import { Anchor, Divider, Group, Text } from "@mantine/core";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Group>
      <Text>Made by Brock Chelle</Text>
      <Divider orientation="vertical" />
      <Anchor href="https://linkedin.com/blchelle" target="_blank">
        LinkedIn
      </Anchor>
      <Divider orientation="vertical" />
      <Anchor href="https://github.com/blchelle/bet-simulator" target="_blank">
        GitHub
      </Anchor>
      <Divider orientation="vertical" />
      <Anchor href="mailto:brocklchelle@gmail.com" target="_blank">
        brocklchelle@gmail.com
      </Anchor>
    </Group>
  );
};

export default Footer;
