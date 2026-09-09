import "dotenv/config";
import { db } from "./db";

async function main() {
  console.log("🌱 Creating development customer...");

  const email = "devcustomer@shoppinghighway.local";

  let customer = await db.orm.public.Customer.first({
    email,
  });

  if (!customer) {
    customer = await db.orm.public.Customer.create({
      name: "Development Customer",
      email,
      passwordHash: "DEV_ONLY_NO_LOGIN",
    });
  }

  console.log("✅ Development customer created");
  console.log("Customer ID:", customer.id);
}

main()
  .catch((error) => {
    console.error("❌ Failed to create development customer");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });