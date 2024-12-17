import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
// import { v2 } from 'cloudinary'

import * as cloudinary from "cloudinary";
const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

app.get("singed-in-url/:userId", async (c) => {
  const userId = c.req.param("userId");

  if (!userId) {
    return c.json(
      {
        message: "userId is required",
      },
      400
    );
  }

  var timestamp = Math.round(new Date().getTime() / 1000) - 55 * 60;

  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: `user_uploads/${userId}`,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return c.json({
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY!,
    folder: `user_uploads/${userId}`,
    upload_preset: "preset_name",
    tags: ["user_uploads"],
  },200);
});

export const handler = handle(app);
