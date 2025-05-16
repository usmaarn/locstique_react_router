import { message } from "antd";
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

export function formatError(error: any) {
  if (error.status === 400) {
    return (
      error.response?.data?.errors
        ? Object.entries(error.response.data.errors).map(([name, err]) => ({
            name,
            errors: [err],
          }))
        : []
    ) as any;
  }
  message.error("An error occurred");
}

export function getImageSrc(value: string) {
  return value.startsWith("http") ? value : "/" + value;
}

export function sleep(miliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, miliseconds);
  });
}
