import { UserType } from "@/lib/enums";
import { db } from "./index.server";
import {
  ordersTable,
  productOrderTable,
  productsTable,
  usersTable,
} from "./schema.server";
import { faker } from "@faker-js/faker";

async function populateUsers(tx: any) {
  for (let i = 0; i <= 10; i++) {
    await tx.insert(usersTable).values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await Bun.password.hash("pass1234", "argon2id"),
      type: UserType.CUSTOMER,
      phone: faker.phone.number({ style: "international" }),
    });
  }
  await tx.insert(usersTable).values({
    name: faker.person.fullName(),
    email: "admin@test.com",
    password: await Bun.password.hash("pass1234", "argon2id"),
    type: UserType.ADMIN,
    phone: faker.phone.number({ style: "international" }),
  });
}

async function populateProducts(tx: any) {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = (await response.json()) as any[];
  if (data) {
    for (const record of data) {
      await tx.insert(productsTable).values({
        name: record.title,
        images: [record.image],
        price: record.price,
        description: record.description,
        discount: Math.ceil(Math.random() * 40),
        stock: Math.floor(Math.random() * 1000),
      });
    }
  }
}

async function populateOrders(tx: any) {
  const users = await tx.query.usersTable.findMany();

  for (let user of users) {
    for (let i = 0; i < faker.number.int({ min: 8, max: 20 }); i++) {
      await tx.insert(ordersTable).values({
        userId: user.id,
        transactionId: faker.number.int().toString(),
        deliveryAddress: `${faker.location.streetAddress()}, ${faker.location.city()} ${faker.location.state()}, ${faker.location.country()}`,
        status: faker.number.int({ min: 5, max: 15, multipleOf: 5 }).toString(),
      });
    }
  }
}

async function populateProductOrder() {
  const orders = await db.query.ordersTable.findMany();
  const products = await db.query.productsTable.findMany();

  for (let order of orders) {
    for (let i = 0; i < 10; i++) {
      try {
        const product =
          products[faker.number.int({ max: products.length - 1 })];
        await db.insert(productOrderTable).values({
          orderId: order.id,
          productId: product.id,
          quantity: faker.number.int({ max: 5 }),
          price: product.price,
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }
}

export async function seed() {
  try {
    await db.transaction(async (tx) => {
      await populateProducts(tx);
      console.log("Products Populated");
      await populateUsers(tx);
      console.log("Users Populated");
      await populateOrders(tx);
      console.log("Orders Populated");
      console.log("seeding completed!");
    });
    await populateProductOrder();
  } catch (error) {
    console.log(error);
  }
}

await seed();
process.exit(0);
