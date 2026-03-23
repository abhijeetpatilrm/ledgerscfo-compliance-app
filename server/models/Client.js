import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      alias: "company_name",
    },
    country: {
      type: String,
      trim: true,
    },
    entityType: {
      type: String,
      trim: true,
      alias: "entity_type",
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
