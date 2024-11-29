import '@mantine/core/styles.css'
import { Button, MantineProvider } from "@mantine/core"

const App = () => {
  return (
    <MantineProvider>
      <Button>Click Me</Button>
    </MantineProvider>
  )
}

export default App
