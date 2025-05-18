import { message, type FormInstance } from "antd";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function calculateDiscount(price: number, discount: number) {
  return discount > 0 ? price - calculatePercentage(price, discount) : price;
}

export function calculatePercentage(num: number, percentage: number) {
  return (num / 100) * percentage;
}

export function setFieldErrors(
  form: FormInstance,
  errors: Record<string, string> | undefined
) {
  if (errors) {
    const errorMap = Object.entries(errors).map(([name, err]) => ({
      name,
      errors: [err],
    }));
    form.setFields(errorMap);
  }
}

export function getImageSrc(value: string) {
  return value.startsWith("http") ? value : "/uploads/" + value;
}

export function sleep(miliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, miliseconds);
  });
}
