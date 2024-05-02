import React, { useState, useEffect } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack, Progress, Heading } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [weight, setWeight] = useState("");
  const [habit, setHabit] = useState("");
  const [daysWithoutHabit, setDaysWithoutHabit] = useState(0);
  const [competitionEndDate, setCompetitionEndDate] = useState(new Date("2023-12-31"));
  const [today] = useState(new Date());

  const handleWeightChange = (value) => setWeight(value);
  const handleHabitChange = (event) => setHabit(event.target.value);

  const saveData = async () => {
    await client.set("currentWeight", { weight });
    await client.set("habit", { habit });
  };

  const loadData = async () => {
    const weightData = await client.get("currentWeight");
    const habitData = await client.get("habit");
    if (weightData) setWeight(weightData.weight);
    if (habitData) setHabit(habitData.habit);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = now - today;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      setDaysWithoutHabit(days);
    }, 1000);
    return () => clearInterval(interval);
  }, [today]);

  const daysLeft = Math.ceil((competitionEndDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">
          Competition Tracker
        </Heading>
        <FormControl>
          <FormLabel>Daily Weigh-in</FormLabel>
          <NumberInput value={weight} onChange={handleWeightChange}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Habit to Eliminate</FormLabel>
          <Input value={habit} onChange={handleHabitChange} placeholder="Enter habit" />
        </FormControl>
        <Button leftIcon={<FaSave />} colorScheme="blue" onClick={saveData}>
          Save
        </Button>
        <Box w="full">
          <Text fontSize="lg">
            Days without {habit}: {daysWithoutHabit}
          </Text>
          <Progress colorScheme="green" value={(daysWithoutHabit / 30) * 100} />
        </Box>
        <Box w="full">
          <Text fontSize="lg">Days until competition ends: {daysLeft}</Text>
          <Progress colorScheme="red" value={((30 - daysLeft) / 30) * 100} />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
