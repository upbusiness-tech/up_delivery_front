import { useMemo } from "react";
import type { Address, OrderMode } from "../types/Order.type";
import type { Neighborhood } from "../types/Restaurant.type";

const NAME_REGEX = /^[A-Za-zÀ-ÿ\s]{2,30}$/;
const BR_PHONE_REGEX = /^\(\d{2}\)\s9\s\d{4}-\d{4}$/;
const ONLY_DIGITS_REGEX = /^\d+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useInfoScreenValidation(name: string, phone: string, email: string) {
  const errors = useMemo(() => {
    const trimmedName = name.trim();
    const digitsPhone = phone.replace(/\D/g, "");
    const trimmedEmail = email.trim();
    const nameError = !trimmedName ? "Informe seu nome" : trimmedName.length > 30 ? "Nome muito longo (máx. 30 caracteres)" : !NAME_REGEX.test(trimmedName) ? "Nome deve conter apenas letras" : "";
    const phoneError = !digitsPhone ? "Informe seu WhatsApp" : digitsPhone.length !== 11 ? "Telefone deve ter 11 dígitos (DDD + 9 dígitos)" : !BR_PHONE_REGEX.test(phone) ? "Formato inválido, use (88) 9 8149-6910" : "";
    const emailError = !trimmedEmail ? "Informe seu e-mail" : !EMAIL_REGEX.test(trimmedEmail) ? "E-mail inválido" : "";
    return { nameError, phoneError, emailError };
  }, [name, phone, email]);

  const isValid = !errors.nameError && !errors.phoneError && !errors.emailError;

  return { errors, isValid };
}

export function useAddressValidation(type: OrderMode, address: Address, neighborhood: Neighborhood | undefined) {
  const errors = useMemo(() => {
    if (type === "pickup") return { streetNameError: "", numberError: "", cityError: "", neighborhoodError: "" };
    const trimmedStreet = address.streetName.trim();
    const streetNameError = !trimmedStreet ? "Informe a rua" : trimmedStreet.length < 3 ? "Nome da rua muito curto" : ONLY_DIGITS_REGEX.test(trimmedStreet) ? "Nome da rua não pode ser um número" : "";
    const numberError = !String(address.number).trim() ? "Informe o número" : "";
    const cityError = !address.city.trim() ? "Informe a cidade" : "";
    const neighborhoodError = !neighborhood ? "Selecione um bairro" : "";
    return { streetNameError, numberError, cityError, neighborhoodError };
  }, [type, address, neighborhood]);

  const isValid = type === "pickup" || (!errors.streetNameError && !errors.numberError && !errors.cityError && !errors.neighborhoodError);

  return { errors, isValid };
}