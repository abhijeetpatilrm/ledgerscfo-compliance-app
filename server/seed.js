import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import Client from "./models/Client.js";
import Task from "./models/Task.js";

dotenv.config();

const clientSeedData = [
  {
    companyName: "Orion Foods Pvt Ltd",
    country: "India",
    entityType: "Private Limited",
  },
  {
    companyName: "Maple Health Solutions LLP",
    country: "India",
    entityType: "LLP",
  },
  {
    companyName: "BluePeak Manufacturing Ltd",
    country: "India",
    entityType: "Public Limited",
  },
  {
    companyName: "Nexora Retail Ventures",
    country: "India",
    entityType: "Proprietorship",
  },
  {
    companyName: "Crestline Consulting Services",
    country: "India",
    entityType: "Partnership",
  },
];

const taskTemplates = [
  {
    title: "GST Filing",
    description: "File monthly GST return with reconciled sales and purchase data.",
    category: "Tax",
    dueInDays: -15,
    status: "Pending",
    priority: "High",
  },
  {
    title: "Income Tax Return",
    description: "Prepare and file annual income tax return with supporting schedules.",
    category: "Tax",
    dueInDays: 20,
    status: "Pending",
    priority: "High",
  },
  {
    title: "ROC Annual Filing",
    description: "Submit annual forms and financial statements to ROC.",
    category: "Filing",
    dueInDays: -5,
    status: "Pending",
    priority: "High",
  },
  {
    title: "TDS Return Filing",
    description: "File quarterly TDS returns and verify challan mapping.",
    category: "Filing",
    dueInDays: 7,
    status: "Completed",
    priority: "Medium",
  },
  {
    title: "Statutory Audit Preparation",
    description: "Compile ledgers, confirmations, and schedules for statutory audit.",
    category: "Audit",
    dueInDays: 30,
    status: "Pending",
    priority: "Medium",
  },
  {
    title: "Board Meeting Compliance",
    description: "Draft minutes and maintain statutory registers for board meeting.",
    category: "Legal",
    dueInDays: 10,
    status: "Completed",
    priority: "Low",
  },
  {
    title: "PF and ESI Monthly Compliance",
    description: "Submit monthly PF/ESI contributions and payroll reconciliations.",
    category: "Legal",
    dueInDays: 5,
    status: "Pending",
    priority: "Medium",
  },
  {
    title: "Tax Audit Report Filing",
    description: "Finalize and upload tax audit report with annexures.",
    category: "Audit",
    dueInDays: 45,
    status: "Completed",
    priority: "Low",
  },
];

const createDueDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const seed = async () => {
  try {
    await connectDB();

    await Task.deleteMany({});
    await Client.deleteMany({});

    const mappedClients = clientSeedData.map((client) => ({
      company_name: client.companyName,
      country: client.country,
      entity_type: client.entityType,
    }));

    const insertedClients = await Client.insertMany(mappedClients);

    const tasksToInsert = insertedClients.flatMap((client) => {
      return taskTemplates.map((template) => ({
        clientId: client._id,
        title: template.title,
        description: template.description,
        category: template.category,
        dueDate: createDueDate(template.dueInDays),
        status: template.status,
        priority: template.priority,
      }));
    });

    const insertedTasks = await Task.insertMany(tasksToInsert);

    console.log("Seeding completed");
    console.log(`Clients inserted: ${insertedClients.length}`);
    console.log(`Tasks inserted: ${insertedTasks.length}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
