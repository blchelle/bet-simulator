import { Card, Group, Stack, Title, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

interface Props {
  label: string;
  value: string;
  tooltip?: string;
}

const StatCard: React.FC<Props> = ({ label, value, tooltip }) => {
  return (
    <Card withBorder>
      <Stack align="center" gap={8}>
        <Title order={3}>{value}</Title>
        <Group gap={"xs"}>
          <Title order={6}>{label}</Title>
          {tooltip && (
            <Tooltip label={tooltip}>
              <IconInfoCircle size={16} />
            </Tooltip>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

export default StatCard;
