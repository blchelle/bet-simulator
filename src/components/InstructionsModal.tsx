import React from "react";

import { Stack, Image, Button, Text, Alert } from "@mantine/core";
import step1 from "../assets/instructions/step1.png";
import step2 from "../assets/instructions/step2.png";
import step3 from "../assets/instructions/step3.png";
import { modals } from "@mantine/modals";
import { IconInfoCircle } from "@tabler/icons-react";

const InstructionsModal: React.FC = () => {
  return (
    <Stack>
      <Alert title="Heads Up!" icon={<IconInfoCircle />}>
        <Text>
          This guide assumes that you have a OddsJam account with a history of tracked bets. You will need to be signed
          into your account to export your betting history.
        </Text>
      </Alert>
      <Text>
        <strong>Step 1:</strong> Starting from the <a href="https://OddsJam.com">OddsJam</a> home page, navigate to the
        &quot;Bet Tracker&quot; dashboard page.
      </Text>
      <Image src={step1} alt="Step 1 Image" />
      <Text>
        <strong>Step 2:</strong> Click on the &quot;Bet Tracker&quot; tab at the top of the page.
      </Text>
      <Image src={step2} alt="Step 2 Image" />
      <Text>
        <strong>Step 3:</strong> Finally, click on the &quot;Export Bets&quot; button to download your betting history.
        OddsJam should confirm your action and will send you an email with your entire betting history shortly after.
        You can download the CSV file from the email they send you and use it on this site.
      </Text>
      <Image src={step3} alt="Step 3 Image" />
      <Button color="blue" fullWidth onClick={() => modals.closeAll()}>
        Got It
      </Button>
    </Stack>
  );
};

export default InstructionsModal;
