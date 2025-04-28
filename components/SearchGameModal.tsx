import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Icon, CloseIcon } from "@/components/ui/icon";
import React, { useState } from "react";

export default function SearchGameModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);

  const gameTypes = [
    { label: "2 dak. Hızlı Oyun", value: "2min" },
    { label: "5 dak. Hızlı Oyun", value: "5min" },
    { label: "12 saat Geniş Oyun", value: "12hour" },
    { label: "24 saat Geniş Oyun", value: "24hour" },
  ];

  return (
    <Center className="h-[300px]">
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent style={{ backgroundColor: "white" }}>
          <ModalHeader>
            <Heading size="md" className="ml-2 text-orange-500">
              WordoX Müsabakası
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {gameTypes.map((game) => (
              <Button
                key={game.value}
                className={`m-2 ${
                  selectedGameType === game.value
                    ? "bg-orange-600"
                    : "bg-orange-400"
                }`}
                onPress={() => setSelectedGameType(game.value)}
              >
                <ButtonText className="text-white font-bold">
                  {game.label}
                </ButtonText>
              </Button>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>İptal</ButtonText>
            </Button>
            <Button
              onPress={() => {
                if (selectedGameType) {
                  console.log("Seçilen Müsabaka Türü:", selectedGameType);
                } else {
                  console.log("Hiçbir müsabaka türü seçilmedi.");
                }
                setShowModal(false);
              }}
              isDisabled={!selectedGameType}
            >
              <ButtonText>Başla</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
