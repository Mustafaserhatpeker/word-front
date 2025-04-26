import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { logout } from "@/service/auth";
export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };
  return (
    <Center className="flex-1">
      <Divider />
      <Heading>Welcome to the Word Game!</Heading>
      <Text>Click the button below to start playing.</Text>
      <Button
        onPress={() => {
          handleLogout();
        }}
      >
        <Text>Quit</Text>
      </Button>
    </Center>
  );
}
