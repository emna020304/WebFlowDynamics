import { Router, json, urlencoded, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMissionSchema, insertContactSchema, insertRiskSchema, insertRecommendationSchema } from "@shared/schema";
import { generateExcel } from "./utils/excel";
import { generatePDF } from "./utils/pdf";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();
  app.use("/api", router);
  
  // Middleware for parsing JSON bodies
  router.use(json());
  router.use(urlencoded({ extended: true }));
  
  // Missions endpoints
  router.get("/missions", async (_req, res) => {
    try {
      const missions = await storage.getMissions();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missions", error });
    }
  });
  
  router.get("/missions/:id", async (req, res) => {
    try {
      const missionId = parseInt(req.params.id);
      if (isNaN(missionId)) {
        return res.status(400).json({ message: "Invalid mission ID" });
      }
      
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      // Get related data
      const contacts = await storage.getContactsByMissionId(missionId);
      const risks = await storage.getRisksByMissionId(missionId);
      const recommendations = await storage.getRecommendationsByMissionId(missionId);
      
      res.json({
        ...mission,
        contacts,
        risks,
        recommendations
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission", error });
    }
  });
  
  router.post("/missions", async (req, res) => {
    try {
      const validationResult = insertMissionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid mission data", errors: validationResult.error.errors });
      }
      
      const mission = await storage.createMission(validationResult.data);
      
      // Handle contacts if provided
      if (req.body.contacts && Array.isArray(req.body.contacts)) {
        for (const contact of req.body.contacts) {
          const contactData = {
            ...contact,
            missionId: mission.id
          };
          const validContactData = insertContactSchema.safeParse(contactData);
          if (validContactData.success) {
            await storage.createContact(validContactData.data);
          }
        }
      }
      
      // Handle risks if provided
      if (req.body.risks && Array.isArray(req.body.risks)) {
        for (const risk of req.body.risks) {
          const riskData = {
            ...risk,
            missionId: mission.id
          };
          const validRiskData = insertRiskSchema.safeParse(riskData);
          if (validRiskData.success) {
            await storage.createRisk(validRiskData.data);
          }
        }
      }
      
      // Handle recommendations if provided
      if (req.body.recommendations && Array.isArray(req.body.recommendations)) {
        for (const recommendation of req.body.recommendations) {
          const recommendationData = {
            ...recommendation,
            missionId: mission.id
          };
          const validRecommendationData = insertRecommendationSchema.safeParse(recommendationData);
          if (validRecommendationData.success) {
            await storage.createRecommendation(validRecommendationData.data);
          }
        }
      }
      
      // Calculate and update mission progress
      const progress = await storage.calculateMissionProgress(mission.id);
      await storage.updateMission(mission.id, { progress });
      
      res.status(201).json(mission);
    } catch (error) {
      res.status(500).json({ message: "Failed to create mission", error });
    }
  });
  
  router.put("/missions/:id", async (req, res) => {
    try {
      const missionId = parseInt(req.params.id);
      if (isNaN(missionId)) {
        return res.status(400).json({ message: "Invalid mission ID" });
      }
      
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      // Update mission data
      const updatedMission = await storage.updateMission(missionId, req.body);
      
      // Handle contacts if provided
      if (req.body.contacts && Array.isArray(req.body.contacts)) {
        // Remove existing contacts
        await storage.deleteContactsByMissionId(missionId);
        
        // Add new contacts
        for (const contact of req.body.contacts) {
          const contactData = {
            ...contact,
            missionId
          };
          const validContactData = insertContactSchema.safeParse(contactData);
          if (validContactData.success) {
            await storage.createContact(validContactData.data);
          }
        }
      }
      
      // Handle risks if provided
      if (req.body.risks && Array.isArray(req.body.risks)) {
        // Remove existing risks
        await storage.deleteRisksByMissionId(missionId);
        
        // Add new risks
        for (const risk of req.body.risks) {
          const riskData = {
            ...risk,
            missionId
          };
          const validRiskData = insertRiskSchema.safeParse(riskData);
          if (validRiskData.success) {
            await storage.createRisk(validRiskData.data);
          }
        }
      }
      
      // Handle recommendations if provided
      if (req.body.recommendations && Array.isArray(req.body.recommendations)) {
        // Remove existing recommendations
        await storage.deleteRecommendationsByMissionId(missionId);
        
        // Add new recommendations
        for (const recommendation of req.body.recommendations) {
          const recommendationData = {
            ...recommendation,
            missionId
          };
          const validRecommendationData = insertRecommendationSchema.safeParse(recommendationData);
          if (validRecommendationData.success) {
            await storage.createRecommendation(validRecommendationData.data);
          }
        }
      }
      
      // Calculate and update mission progress
      const progress = await storage.calculateMissionProgress(missionId);
      await storage.updateMission(missionId, { progress });
      
      res.json(updatedMission);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mission", error });
    }
  });
  
  router.delete("/missions/:id", async (req, res) => {
    try {
      const missionId = parseInt(req.params.id);
      if (isNaN(missionId)) {
        return res.status(400).json({ message: "Invalid mission ID" });
      }
      
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      const deleted = await storage.deleteMission(missionId);
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete mission" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mission", error });
    }
  });
  
  // Export to Excel
  router.get("/missions/:id/export/excel", async (req, res) => {
    try {
      const missionId = parseInt(req.params.id);
      if (isNaN(missionId)) {
        return res.status(400).json({ message: "Invalid mission ID" });
      }
      
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      // Get related data
      const contacts = await storage.getContactsByMissionId(missionId);
      const risks = await storage.getRisksByMissionId(missionId);
      const recommendations = await storage.getRecommendationsByMissionId(missionId);
      
      // Generate Excel file
      const excelBuffer = await generateExcel({
        ...mission,
        contacts,
        risks,
        recommendations
      });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Mission_Audit_${mission.id}.xlsx`);
      
      // Send the buffer
      res.send(excelBuffer);
    } catch (error) {
      console.error("Excel export error:", error);
      res.status(500).json({ message: "Failed to generate Excel file", error });
    }
  });
  
  // Generate PDF
  router.get("/missions/:id/export/pdf", async (req, res) => {
    try {
      const missionId = parseInt(req.params.id);
      if (isNaN(missionId)) {
        return res.status(400).json({ message: "Invalid mission ID" });
      }
      
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      // Get related data
      const contacts = await storage.getContactsByMissionId(missionId);
      const risks = await storage.getRisksByMissionId(missionId);
      const recommendations = await storage.getRecommendationsByMissionId(missionId);
      
      // Generate PDF
      const pdfBuffer = await generatePDF({
        ...mission,
        contacts,
        risks,
        recommendations
      });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Rapport_Audit_${mission.id}.pdf`);
      
      // Send the buffer
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate PDF file", error });
    }
  });

  // Generate Word document (For simplicity, we'll use the PDF endpoint but change the content type)
  router.get("/missions/:id/export/word", async (req, res) => {
    try {
      const missionId = parseInt(req.params.id);
      if (isNaN(missionId)) {
        return res.status(400).json({ message: "Invalid mission ID" });
      }
      
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      // Get related data
      const contacts = await storage.getContactsByMissionId(missionId);
      const risks = await storage.getRisksByMissionId(missionId);
      const recommendations = await storage.getRecommendationsByMissionId(missionId);
      
      // Generate PDF (we'll use PDF for now as we don't have a Word generator)
      const pdfBuffer = await generatePDF({
        ...mission,
        contacts,
        risks,
        recommendations
      });
      
      // Set response headers for Word document
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=Rapport_Audit_${mission.id}.docx`);
      
      // Send the buffer
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Word generation error:", error);
      res.status(500).json({ message: "Failed to generate Word file", error });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
