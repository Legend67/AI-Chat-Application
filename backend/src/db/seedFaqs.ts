// backend/src/db/seedFaqs.ts

import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { faqs } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  await client.connect();
  const db = drizzle(client);

  console.log("Seeding FAQs...");

  await db.insert(faqs).values([
    {
      category: "shipping",
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship worldwide. International delivery typically takes 7–14 business days."
    },
    {
      category: "shipping",
      question: "Do you ship to the USA?",
      answer:
        "Yes, we ship to the USA. Delivery usually takes 5–7 business days."
    },
    {
      category: "returns",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in original packaging."
    },
    {
      category: "returns",
      question: "How long do refunds take?",
      answer:
        "Refunds are processed within 5 business days after inspection."
    },
    {
      category: "support",
      question: "What are your support hours?",
      answer:
        "Our support team is available Monday to Friday, 9 AM to 6 PM IST."
    }
  ]);

  console.log("FAQ seeding completed.");
  await client.end();
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
