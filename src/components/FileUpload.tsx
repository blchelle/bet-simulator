import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { Group, Stack, Title, Text } from "@mantine/core";
import { IconCheck, IconFileDescription } from "@tabler/icons-react";
import React from "react";

interface FileUploadProps {
  parsedFile: Bet[] | null;
  handleFileChange: (file: File | null) => void;
  errorMessage: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ parsedFile, handleFileChange, errorMessage }) => {
  return (
    <Dropzone
      onDrop={(files) => handleFileChange(files[0])}
      accept={[MIME_TYPES.csv]}
      maxFiles={1}
      maxSize={10_000_000}
      disabled={parsedFile !== null}
    >
      {parsedFile ? (
        <Group justify="center">
          <IconCheck size={36} color="green" />
          <Stack gap={0}>
            <Title order={5}>Successfully uploaded CSV file.</Title>
            <Text size="sm">You can now run the simulation</Text>
          </Stack>
        </Group>
      ) : (
        <Group justify="center">
          <IconFileDescription size={36} />
          <Stack gap={0}>
            <Title order={5}>Upload a CSV file of your betting history</Title>
            <Text size="sm">You can export this file from OddsJam</Text>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
          </Stack>
        </Group>
      )}
    </Dropzone>
  );
};

export default FileUpload;
