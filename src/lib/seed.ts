// src/lib/seed.ts
import { MongoClient, Db } from 'mongodb';
import bcrypt from 'bcrypt';
import { User, UserRole } from './models/User'; // Import User and UserRole

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'pos_system';
const DEFAULT_ADMIN_EMAIL = "sam968766@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "admin123"; // Make sure to change this in production!
const DEFAULT_CASHIER_EMAIL = "cashier@rs.com";
const DEFAULT_CASHIER_PASSWORD = "cashier123"; // Make sure to change this in production!

async function seedDatabase() {
  let client: MongoClient | null = null;
  let db: Db | null = null;

  try {
    console.log("Attempting to connect to MongoDB...");
    client = await MongoClient.connect(MONGODB_URI);
    db = client.db(DB_NAME);
    console.log("Successfully connected to MongoDB.");

    const usersCollection = db.collection<User>("users");

    // Seed Default Admin
    const existingAdmin = await usersCollection.findOne({ email: DEFAULT_ADMIN_EMAIL });
    if (!existingAdmin) {
      console.log(`Seeding default admin: ${DEFAULT_ADMIN_EMAIL}`);
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

      const defaultAdmin: User = {
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: UserRole.Admin,
        isDefaultAdmin: true, // Now 'true' is assignable to 'boolean'
        // name: "Default Admin" // You might want to add a name for the admin too
      };
      await usersCollection.insertOne(defaultAdmin);
      console.log("Default admin seeded successfully!");
    } else {
      console.log("Default admin already exists.");
    }

    // Seed Default Cashier
    const existingCashier = await usersCollection.findOne({ email: DEFAULT_CASHIER_EMAIL });
    if (!existingCashier) {
      console.log(`Seeding default cashier: ${DEFAULT_CASHIER_EMAIL}`);
      const hashedPassword = await bcrypt.hash(DEFAULT_CASHIER_PASSWORD, 10);

      const defaultCashier: User = {
        email: DEFAULT_CASHIER_EMAIL,
        password: hashedPassword,
        role: UserRole.Cashier,
        isDefaultCashier: true,
        name: "Default Cashier", // Add a name for OTP requests
        cashierId: "CS001", // Add a unique ID
        isDefaultAdmin: false, // <-- Add this property, explicitly setting it to false for a cashier
      };
      await usersCollection.insertOne(defaultCashier);
      console.log("Default cashier seeded successfully!");
    } else {
      console.log("Default cashier already exists. No seeding needed.");
    }

  } catch (error) {
    console.error("Error during seeding process:", error);
    process.exit(1);
  } finally {
    if (client) {
      console.log("Closing MongoDB connection.");
      await client.close();
    }
  }
}

// Execute the seeding function
seedDatabase();