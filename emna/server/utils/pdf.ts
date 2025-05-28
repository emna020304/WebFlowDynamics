import { Mission, Contact, Risk, Recommendation } from '@shared/schema';
// @ts-ignore
import PDFDocument from 'pdfkit';

interface MissionWithRelations extends Mission {
  contacts: Contact[];
  risks: Risk[];
  recommendations: Recommendation[];
}

export async function generatePDF(mission: MissionWithRelations): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      
      // Collect the PDF data chunks
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: any) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Set font
      doc.font('Helvetica');
      
      // Add title
      doc.fontSize(20)
         .fillColor('#0070C0')
         .text(`RAPPORT D'AUDIT - ${mission.companyName}`, { align: 'center' })
         .moveDown(1);
      
      // Add company information section
      doc.fontSize(16)
         .fillColor('#000000')
         .text('Informations de l\'entreprise', { underline: true })
         .moveDown(0.5);
      
      // Company details
      doc.fontSize(11);
      addKeyValueText(doc, 'Nom de l\'entreprise', mission.companyName);
      addKeyValueText(doc, 'Type d\'entreprise', mission.companyType || '');
      addKeyValueText(doc, 'Numéro SIRET', mission.registrationNumber || '');
      addKeyValueText(doc, 'Date de création', mission.creationDate || '');
      addKeyValueText(doc, 'Adresse', mission.address || '');
      addKeyValueText(doc, 'Secteur d\'activité', mission.activitySector || '');
      doc.moveDown(1);
      
      // Contacts
      doc.fontSize(16)
         .text('Contacts principaux', { underline: true })
         .moveDown(0.5);
      
      if (mission.contacts.length > 0) {
        // Create table-like structure for contacts
        doc.fontSize(11);
        doc.text('Nom', 50, doc.y, { width: 150 });
        doc.text('Poste', 200, doc.y - 11, { width: 150 });
        doc.text('Email', 350, doc.y - 11, { width: 200 });
        doc.moveDown(0.5);
        
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        
        for (const contact of mission.contacts) {
          const yPos = doc.y;
          doc.text(contact.name, 50, yPos, { width: 150 });
          doc.text(contact.position || '', 200, yPos, { width: 150 });
          doc.text(contact.email || '', 350, yPos, { width: 200 });
          doc.moveDown(0.5);
        }
      } else {
        doc.fontSize(11).text('Aucun contact enregistré');
      }
      
      doc.moveDown(1);
      
      // Financial Analysis Section
      doc.addPage();
      doc.fontSize(20)
         .fillColor('#0070C0')
         .text('ANALYSE FINANCIÈRE', { align: 'center' })
         .moveDown(1);
      
      doc.fontSize(11).fillColor('#000000');
      addKeyValueText(doc, 'Chiffre d\'affaires annuel (€)', 
        mission.annualRevenue?.toString() || '');
      addKeyValueText(doc, 'Marge bénéficiaire (%)', 
        mission.profitMargin?.toString() || '');
      addKeyValueText(doc, 'Total des actifs (€)', 
        mission.totalAssets?.toString() || '');
      addKeyValueText(doc, 'Total des dettes (€)', 
        mission.totalDebts?.toString() || '');
      doc.moveDown(1);
      
      // Ratios
      doc.fontSize(16)
         .text('Ratios financiers', { underline: true })
         .moveDown(0.5);
      
      const financialRatios = mission.financialRatios ?? {};
      if (financialRatios) {
        doc.fontSize(11);
        
        // Draw table headers
        doc.text('Ratio', 50, doc.y, { width: 200 });
        doc.text('Valeur', 250, doc.y - 11, { width: 100 });
        doc.text('Évaluation', 350, doc.y - 11, { width: 200 });
        doc.moveDown(0.5);
        
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        
        // Ratio data
        const addRatioRow = (name: string, value: string, evaluation: string) => {
          const yPos = doc.y;
          doc.text(name, 50, yPos, { width: 200 });
          doc.text(value, 250, yPos, { width: 100 });
          doc.text(evaluation, 350, yPos, { width: 200 });
          doc.moveDown(0.5);
        };
        
        addRatioRow('Ratio de liquidité', 
          financialRatios.liquidity?.toString() || '', 
          financialRatios.liquidityEvaluation?.toString() || '');
          
        addRatioRow('Ratio d\'endettement', 
          financialRatios.debt?.toString() || '', 
          financialRatios.debtEvaluation?.toString() || '');
          
        addRatioRow('Rentabilité des capitaux propres (ROE)', 
          financialRatios.roe?.toString() || '', 
          financialRatios.roeEvaluation?.toString() || '');
      } else {
        doc.fontSize(11).text('Aucun ratio financier enregistré');
      }
      
      doc.moveDown(1);
      
      // Financial comments
      doc.fontSize(16)
         .text('Commentaires sur la situation financière', { underline: true })
         .moveDown(0.5);
      
      doc.fontSize(11).text(mission.financialComments || '');
      doc.moveDown(1);
      
      // Risks Section
      doc.addPage();
      doc.fontSize(20)
         .fillColor('#0070C0')
         .text('ÉVALUATION DES RISQUES', { align: 'center' })
         .moveDown(1);
      
      doc.fillColor('#000000');
      
      if (mission.risks.length > 0) {
        for (let i = 0; i < mission.risks.length; i++) {
          const risk = mission.risks[i];
          
          doc.fontSize(14).text(`Risque ${i + 1}: ${risk.riskType}`, { underline: true });
          doc.moveDown(0.5);
          
          doc.fontSize(11);
          addKeyValueText(doc, 'Probabilité', risk.probability);
          addKeyValueText(doc, 'Impact', risk.impact);
          
          doc.moveDown(0.5);
          doc.fontSize(12).text('Description du risque:', { bold: true });
          doc.fontSize(11).text(risk.description || '');
          
          doc.moveDown(0.5);
          doc.fontSize(12).text('Mesures de mitigation recommandées:', { bold: true });
          doc.fontSize(11).text(risk.mitigation || '');
          
          doc.moveDown(1);
          
          // Add a separator between risks
          if (i < mission.risks.length - 1) {
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);
          }
        }
      } else {
        doc.fontSize(11).text('Aucun risque identifié');
      }
      
      // Compliance Section
      doc.addPage();
      doc.fontSize(20)
         .fillColor('#0070C0')
         .text('CONFORMITÉ ET GOUVERNANCE', { align: 'center' })
         .moveDown(1);
      
      doc.fillColor('#000000');
      doc.fontSize(16)
         .text('Conformité réglementaire', { underline: true })
         .moveDown(0.5);
      
      const complianceStatus = mission.complianceStatus ?? {};
      if (complianceStatus) {
        doc.fontSize(12).text('RGPD / Protection des données', { bold: true });
        doc.fontSize(11);
        addKeyValueText(doc, 'Statut', complianceStatus.gdpr?.toString() || '');
        doc.text('Commentaires: ' + (complianceStatus.gdprComments?.toString() || ''));
        doc.moveDown(1);
        
        doc.fontSize(12).text('Droit du travail', { bold: true });
        doc.fontSize(11);
        addKeyValueText(doc, 'Statut', complianceStatus.laborLaw?.toString() || '');
        doc.text('Commentaires: ' + (complianceStatus.laborLawComments?.toString() || ''));
        doc.moveDown(1);
        
        doc.fontSize(12).text('Normes sectorielles', { bold: true });
        doc.fontSize(11);
        addKeyValueText(doc, 'Statut', complianceStatus.industryStandards?.toString() || '');
        doc.text('Commentaires: ' + (complianceStatus.industryStandardsComments?.toString() || ''));
      } else {
        doc.fontSize(11).text('Aucune donnée de conformité enregistrée');
      }
      
      doc.moveDown(1);
      
      // Governance
      doc.fontSize(16)
         .text('Structure de gouvernance', { underline: true })
         .moveDown(0.5);
      
      const governanceStructure = mission.governanceStructure ?? {};
      if (governanceStructure) {
        doc.fontSize(11);
        
        addKeyValueText(doc, 'Structure de l\'actionnariat', 
          governanceStructure.shareholderStructure?.toString() || '');
        addKeyValueText(doc, 'Fréquence des réunions du conseil', 
          governanceStructure.boardMeetings?.toString() || '');
        
        doc.moveDown(0.5);
        doc.text('Comités spécialisés:');
        
        if (governanceStructure.committees && Array.isArray(governanceStructure.committees)) {
          for (const committee of governanceStructure.committees) {
            doc.text(`  • ${committee}`);
          }
        } else {
          doc.text('  Aucun comité spécialisé');
        }
      } else {
        doc.fontSize(11).text('Aucune donnée de gouvernance enregistrée');
      }
      
      // Recommendations Section
      doc.addPage();
      doc.fontSize(20)
         .fillColor('#0070C0')
         .text('RECOMMANDATIONS ET PLAN D\'ACTION', { align: 'center' })
         .moveDown(1);
      
      doc.fillColor('#000000');
      doc.fontSize(16)
         .text('Synthèse des observations', { underline: true })
         .moveDown(0.5);
      
      doc.fontSize(11).text(mission.observations || 'Aucune observation enregistrée');
      doc.moveDown(1);
      
      // Recommendations
      doc.fontSize(16)
         .text('Recommandations', { underline: true })
         .moveDown(0.5);
      
      if (mission.recommendations.length > 0) {
        for (let i = 0; i < mission.recommendations.length; i++) {
          const recommendation = mission.recommendations[i];
          
          doc.fontSize(12).text(`Recommandation ${i + 1}`, { bold: true });
          doc.fontSize(11).text(recommendation.description);
          doc.moveDown(0.5);
          
          // Color-coded priority
          let priorityColor = '#000000';
          if (recommendation.priority === 'high' || recommendation.priority === 'Haute') {
            priorityColor = '#FF0000'; // Red
          } else if (recommendation.priority === 'medium' || recommendation.priority === 'Moyenne') {
            priorityColor = '#FFA500'; // Orange
          } else if (recommendation.priority === 'low' || recommendation.priority === 'Basse') {
            priorityColor = '#008000'; // Green
          }
          
          doc.fillColor(priorityColor)
             .text(`Priorité: ${recommendation.priority}`)
             .fillColor('#000000');
          
          addKeyValueText(doc, 'Responsable', recommendation.responsible || '');
          addKeyValueText(doc, 'Échéance', recommendation.deadline || '');
          
          doc.moveDown(1);
          
          // Add a separator between recommendations
          if (i < mission.recommendations.length - 1) {
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);
          }
        }
      } else {
        doc.fontSize(11).text('Aucune recommandation enregistrée');
      }
      
      doc.moveDown(1);
      
      // Follow-up plan
      doc.fontSize(16)
         .text('Plan de suivi', { underline: true })
         .moveDown(0.5);
      
      doc.fontSize(11);
      addKeyValueText(doc, 'Date de la prochaine revue', mission.followUpDate || '');
      addKeyValueText(doc, 'Responsable du suivi', mission.followUpResponsible || '');
      
      doc.moveDown(0.5);
      doc.fontSize(12).text('Modalités de suivi:', { bold: true });
      doc.fontSize(11).text(mission.followUpDetails || '');
      
      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        // Add page number at the bottom
        doc.fontSize(8)
           .text(
              `Page ${i + 1} sur ${pageCount}`,
              50,
              doc.page.height - 50,
              { align: 'center', width: doc.page.width - 100 }
           );
        
        // Add company name and date at footer
        doc.fontSize(8)
           .text(
              `${mission.companyName} - Rapport généré le ${new Date().toLocaleDateString()}`,
              50,
              doc.page.height - 35,
              { align: 'center', width: doc.page.width - 100 }
           );
      }
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to add key-value pairs with consistent formatting
function addKeyValueText(doc: any, key: string, value: string) {
  doc.font('Helvetica-Bold').text(`${key}: `, {
    continued: true
  });
  doc.font('Helvetica').text(value);
  return doc;
}
