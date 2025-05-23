import type { User } from "~/lib/types";

export type MakePaymentOptions = {
  user: User;
  amount: number;
};

export class PaystackPaymentService {
  private secretKey: string;
  private apiOptions: Record<string, any>;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY!;
    this.apiOptions = {
      url: "https://api.paystack.co",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
    };
  }

  async makePayment({ user, amount }: MakePaymentOptions) {
    const params = JSON.stringify({
      email: user.email,
      amount,
    });

    const response = await fetch(
      `${this.apiOptions.url}/transaction/initialize`,
      {
        method: "POST",
        body: params,
        headers: this.apiOptions.headers,
      }
    );

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        return {
          ...data.data,
          redirect_url: data.data.authorization_url,
        };
      }
    }
    console.log(data);
    throw new Error("Unable to complete payment");
  }

  async verifyPayment() {}
}

export const paystackPaymentService = new PaystackPaymentService();
