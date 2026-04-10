import React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Footer } from "./shared/footer";

interface PaywallReceiptEmailProps {
  email: string | null | undefined;
  linkUrl: string;
}

const PaywallReceiptEmail = ({ email, linkUrl }: PaywallReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Tu acceso a la guía está listo!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Text className="text-2xl font-bold tracking-tighter">
                Closing Nation
              </Text>
            </Section>
            <Heading className="mx-0 my-7 p-0 text-xl font-semibold text-black">
              ¡Bienvenido a tu bóveda digital!
            </Heading>
            <Text className="mb-8 text-sm leading-6 text-gray-600">
              ¡Gracias por tu compra! Tu correo (<strong>{email}</strong>) ha sido autorizado de forma segura para tener acceso permanente y de por vida a los documentos.
            </Text>

            <Hr />

            <Heading className="mx-0 my-6 p-0 text-lg font-semibold text-black">
              Instrucciones de Acceso
            </Heading>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                1. Accede a los Documentos
              </strong>
              : Simplemente haz clic en el enlace de acceso seguro a continuación cada vez que necesites ver tus guías.
            </Text>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                2. Autentícate
              </strong>
              : Cuando se te solicite, ingresa la dirección de correo electrónico exacta que utilizaste para completar esta compra. Nuestro sistema te reconocerá inmediatamente.
            </Text>

            <Section className="my-8 text-center">
              <Link
                className="rounded-lg bg-black px-6 py-4 text-center text-[14px] font-semibold text-white no-underline shadow-md"
                href={linkUrl}
              >
                Acceder a tu Guía
              </Link>
            </Section>

            <Hr />
            <Text className="text-xs text-gray-400 mt-8">
              Si pierdes este correo electrónico, siempre puedes solicitar un nuevo enlace de acceso o contactar a soporte. 
              Por favor, no reenvíes este enlace específico a otras personas, ya que el acceso está restringido únicamente a tu dirección de correo electrónico.
            </Text>

            <Footer marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PaywallReceiptEmail;
