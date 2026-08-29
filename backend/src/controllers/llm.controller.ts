import { Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "../utils/prisma";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export const explainDiscrepancy = async (
  req: any,
  res: Response
) => {
  try {
    const discrepancy =
      await prisma.reconciliationResult.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!discrepancy) {
      return res.status(404).json({
        message: "Discrepancy not found",
      });
    }

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

    const prompt = `
You are a financial reconciliation analyst.

Analyze the discrepancy.

Type: ${discrepancy.discrepancyType}
Order Amount: ${discrepancy.orderAmount}
Payment Amount: ${discrepancy.paymentAmount}
Risk Amount: ${discrepancy.riskAmount}

Return ONLY valid JSON:

{
  "summary":"",
  "likelyCause":"",
  "recommendedAction":"",
  "severity":""
}
`;

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text();

    try {
      const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const parsed = JSON.parse(cleaned);

      return res.json(parsed);
    } catch {
      return res.json({
        summary:
          "Unable to parse AI response",
        likelyCause:
          "Manual investigation required",
        recommendedAction:
          "Review transaction details",
        severity: "Medium",
      });
    }
  } catch (error: any) {
  console.error("GEMINI ERROR:", error);

  return res.status(500).json({
    message: error?.message || "Gemini error",
    error,
  });
}
};