import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
// import fs from "fs";
// import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 🔹 Load Google Service Account Credentials
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      throw new Error("Missing Google service account credentials.");
    }

    console.log("GOOGLE_APPLICATION_CREDENTIALS_JSON", process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    // const credentialsPath = path.join(process.cwd(), "service-account.json");
    // const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}");
    const credentialsJson = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,"base64").toString("utf8");
    // const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    const credentials = JSON.parse(credentialsJson);
    console.log("EMAIL IS HERE TESTING",credentials.client_email); // Check if it works correctly

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("Google Auth initialized successfully!");

    const sheets = google.sheets({ version: "v4", auth });

    // 🔹 Replace with your actual Google Sheet ID
    const sheetId = process.env.GOOGLE_SHEET_ID;  // Replace with your correct sheet ID

    // 🔹 Get data from request body
    const { date, house, totalEggs, mortality, brokenEggs, chickens, food, user } = req.body;

    // 🔹 Get the current number of rows in the sheet
    const getRowsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:A",  // This checks column A for the number of rows with data
    });

    // 🔹 Get the last row with data
    const lastRow = getRowsResponse.data.values ? getRowsResponse.data.values.length + 1 : 2;  // If no data, start at row 2

    // 🔹 Append data to the sheet, starting from the next available row
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `Sheet1!A${lastRow}:G${lastRow}`,  // Dynamically calculated range
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[date, house, totalEggs, mortality, brokenEggs, chickens, food, user]],
      },
    });

    return res.status(200).json({ message: "Data saved successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error details:", error.message);  // Log the error message
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown error:", error);  // In case of an unknown error
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
