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
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
import React from "react";

export default function SearchGameModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Oyun Başlat
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
            <Button className="m-2 bg-orange-400 ">
              <ButtonText className="text-white font-bold">
                2 dak. Hızlı Oyun
              </ButtonText>
            </Button>

            <Button className="m-2 bg-orange-400">
              <ButtonText className="text-white font-bold">
                5 dak. Hızlı Oyun
              </ButtonText>
            </Button>

            <Button className="m-2 bg-orange-400">
              <ButtonText className="text-white font-bold">
                12 saat Geniş Oyun
              </ButtonText>
            </Button>
            <Button className="m-2 bg-orange-400">
              <ButtonText className="text-white font-bold">
                24 saat Geniş Oyun
              </ButtonText>
            </Button>
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
                setShowModal(false);
              }}
            >
              <ButtonText>Başla</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
