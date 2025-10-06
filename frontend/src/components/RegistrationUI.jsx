import { VStack, HStack, Text, Box, Button, Input, Image, SimpleGrid } from '@chakra-ui/react';

function RegistrationUI({ status, videoRef, startCamera, takeSnapshot, snapshots, username, setUsername, handleRegister, isRegistering }) {
  return (
    <VStack spacing={4} align="center">
      <Text color="gray.400">{status}</Text>
      <Input 
        placeholder="Enter your name" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        maxWidth="320px"
      />
      <Box bg="black" borderRadius="lg" overflow="hidden">
        <video ref={videoRef} autoPlay playsInline style={{ width: '320px', height: '240px' }}></video>
      </Box>
      <HStack gap={4}>
        <Button variant="outline" onClick={startCamera}>Start Camera</Button>
        <Button colorScheme="blue" onClick={takeSnapshot}>Take Snapshot ({snapshots.length}/10)</Button>
      </HStack>

      <SimpleGrid columns={5} spacing={2} mt={4}>
        {snapshots.map((src, index) => (
          <Image key={index} src={src} boxSize="60px" objectFit="cover" borderRadius="md" />
        ))}
      </SimpleGrid>

      <Button 
        colorScheme="green" 
        onClick={handleRegister} 
        isLoading={isRegistering}
        isDisabled={snapshots.length < 10 || !username}
      >
        Register My Face
      </Button>
    </VStack>
  );
}

export default RegistrationUI;