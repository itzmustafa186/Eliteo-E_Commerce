// src/inngest/client.js

import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({
  id: "eliteo",
});

// Sync User Creation
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-creation",
    triggers: [
      {
        event: "clerk/user.created",
      },
    ],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
      } = event.data;

      const userData = {
        _id: id,
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        email: email_addresses?.[0]?.email_address ?? "",
        imageUrl: image_url ?? "",
      };

      await User.findByIdAndUpdate(id, userData, {
        upsert: true,
        new: true,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("User Creation Error:", error);
      throw error;
    }
  }
);

// Sync User Update
export const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-updation",
    triggers: [
      {
        event: "clerk/user.updated",
      },
    ],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
      } = event.data;

      const userData = {
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        email: email_addresses?.[0]?.email_address ?? "",
        imageUrl: image_url ?? "",
      };

      await User.findByIdAndUpdate(id, userData, {
        new: true,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("User Update Error:", error);
      throw error;
    }
  }
);

// Sync User Deletion
export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-deletion",
    triggers: [
      {
        event: "clerk/user.deleted",
      },
    ],
  },
  async ({ event }) => {
    try {
      await connectDB();

      await User.findByIdAndDelete(event.data.id);

      return {
        success: true,
      };
    } catch (error) {
      console.error("User Delete Error:", error);
      throw error;
    }
  }
);

// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];