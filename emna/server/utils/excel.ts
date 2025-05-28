import ExcelJS from 'exceljs';
import { Mission, Contact, Risk, Recommendation } from '@shared/schema';

interface MissionWithRelations extends Mission {
  contacts: Contact[];
  risks: Risk[];
  recommendations: Recommendation[];
}

export async function generateExcel(mission: MissionWithRelations): Promise<Buffer> {
  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = 'Audit Mission Platform';
  workbook.lastModifiedBy = 'Audit Mission Platform';
  workbook.created = new Date();
  workbook.modified = new Date();
  
  // Add a general info worksheet
  const generalSheet = workbook.addWorksheet('Informations générales');
  
  // Add title
  generalSheet.mergeCells('A1:F1');
  const titleRow = generalSheet.getRow(1);
  titleRow.getCell(1).value = `RAPPORT D'AUDIT - ${mission.companyName}`;
  titleRow.getCell(1).font = { size: 16, bold: true, color: { argb: '0070C0' } };
  titleRow.getCell(1).alignment = { horizontal: 'center' };
  
  // Add company information
  generalSheet.getColumn(1).width = 25;
  generalSheet.getColumn(2).width = 35;

  generalSheet.addRow([]);
  generalSheet.addRow(['Informations de l\'entreprise', '']);
  const headerRow = generalSheet.lastRow;
  headerRow!.getCell(1).font = { bold: true, size: 14 };
  
  generalSheet.addRow(['Nom de l\'entreprise', mission.companyName]);
  generalSheet.addRow(['Type d\'entreprise', mission.companyType]);
  generalSheet.addRow(['Numéro SIRET', mission.registrationNumber]);
  generalSheet.addRow(['Date de création', mission.creationDate]);
  generalSheet.addRow(['Adresse', mission.address]);
  generalSheet.addRow(['Secteur d\'activité', mission.activitySector]);
  
  // Add contacts information
  generalSheet.addRow([]);
  generalSheet.addRow(['Contacts principaux', '']);
  const contactsHeader = generalSheet.lastRow;
  contactsHeader!.getCell(1).font = { bold: true, size: 14 };
  
  // Add headers for contacts
  generalSheet.addRow(['Nom', 'Poste', 'Email']);
  const contactHeaderRow = generalSheet.lastRow;
  for (let i = 1; i <= 3; i++) {
    contactHeaderRow!.getCell(i).font = { bold: true };
    contactHeaderRow!.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E6E6E6' }
    };
    contactHeaderRow!.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Add contact data
  for (const contact of mission.contacts) {
    generalSheet.addRow([contact.name, contact.position, contact.email]);
  }
  
  // Add financial analysis worksheet
  const financialSheet = workbook.addWorksheet('Analyse financière');
  
  financialSheet.getColumn(1).width = 25;
  financialSheet.getColumn(2).width = 15;
  financialSheet.getColumn(3).width = 25;
  
  // Add title
  financialSheet.mergeCells('A1:C1');
  const finTitleRow = financialSheet.getRow(1);
  finTitleRow.getCell(1).value = 'ANALYSE FINANCIÈRE';
  finTitleRow.getCell(1).font = { size: 16, bold: true, color: { argb: '0070C0' } };
  finTitleRow.getCell(1).alignment = { horizontal: 'center' };
  
  financialSheet.addRow([]);
  financialSheet.addRow(['Chiffre d\'affaires annuel (€)', mission.annualRevenue?.toString()]);
  financialSheet.addRow(['Marge bénéficiaire (%)', mission.profitMargin?.toString()]);
  financialSheet.addRow(['Total des actifs (€)', mission.totalAssets?.toString()]);
  financialSheet.addRow(['Total des dettes (€)', mission.totalDebts?.toString()]);
  
  // Add ratios
  financialSheet.addRow([]);
  financialSheet.addRow(['Ratios financiers', '', '']);
  const ratiosHeader = financialSheet.lastRow;
  ratiosHeader!.getCell(1).font = { bold: true, size: 14 };
  
  financialSheet.addRow(['Ratio', 'Valeur', 'Évaluation']);
  const ratioHeaderRow = financialSheet.lastRow;
  for (let i = 1; i <= 3; i++) {
    ratioHeaderRow!.getCell(i).font = { bold: true };
    ratioHeaderRow!.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E6E6E6' }
    };
    ratioHeaderRow!.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Add ratio data
  const financialRatios = (mission.financialRatios && typeof mission.financialRatios === 'object') ? mission.financialRatios as Record<string, any> : {};
  financialSheet.addRow(['Ratio de liquidité', 
    ("liquidity" in financialRatios ? financialRatios.liquidity?.toString() : '') || '', 
    ("liquidityEvaluation" in financialRatios ? financialRatios.liquidityEvaluation?.toString() : '') || '']);
  financialSheet.addRow(['Ratio d\'endettement', 
    ("debt" in financialRatios ? financialRatios.debt?.toString() : '') || '', 
    ("debtEvaluation" in financialRatios ? financialRatios.debtEvaluation?.toString() : '') || '']);
  financialSheet.addRow(['Rentabilité des capitaux propres (ROE)', 
    ("roe" in financialRatios ? financialRatios.roe?.toString() : '') || '', 
    ("roeEvaluation" in financialRatios ? financialRatios.roeEvaluation?.toString() : '') || '']);
  
  // Add comments
  financialSheet.addRow([]);
  financialSheet.addRow(['Commentaires sur la situation financière']);
  const commentsHeader = financialSheet.lastRow;
  commentsHeader!.getCell(1).font = { bold: true };
  
  financialSheet.addRow([mission.financialComments || '']);
  
  // Add risks worksheet
  const risksSheet = workbook.addWorksheet('Évaluation des risques');
  
  risksSheet.getColumn(1).width = 20;
  risksSheet.getColumn(2).width = 15;
  risksSheet.getColumn(3).width = 15;
  risksSheet.getColumn(4).width = 40;
  risksSheet.getColumn(5).width = 40;
  
  // Add title
  risksSheet.mergeCells('A1:E1');
  const risksTitleRow = risksSheet.getRow(1);
  risksTitleRow.getCell(1).value = 'ÉVALUATION DES RISQUES';
  risksTitleRow.getCell(1).font = { size: 16, bold: true, color: { argb: '0070C0' } };
  risksTitleRow.getCell(1).alignment = { horizontal: 'center' };
  
  risksSheet.addRow([]);
  risksSheet.addRow(['Type de risque', 'Probabilité', 'Impact', 'Description', 'Mesures de mitigation']);
  const risksHeaderRow = risksSheet.lastRow;
  for (let i = 1; i <= 5; i++) {
    risksHeaderRow!.getCell(i).font = { bold: true };
    risksHeaderRow!.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E6E6E6' }
    };
    risksHeaderRow!.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Add risk data
  for (const risk of mission.risks) {
    risksSheet.addRow([
      risk.riskType, 
      risk.probability, 
      risk.impact, 
      risk.description, 
      risk.mitigation
    ]);
  }
  
  // Add compliance worksheet
  const complianceSheet = workbook.addWorksheet('Conformité et gouvernance');
  
  complianceSheet.getColumn(1).width = 25;
  complianceSheet.getColumn(2).width = 20;
  complianceSheet.getColumn(3).width = 40;
  
  // Add title
  complianceSheet.mergeCells('A1:C1');
  const complianceTitleRow = complianceSheet.getRow(1);
  complianceTitleRow.getCell(1).value = 'CONFORMITÉ ET GOUVERNANCE';
  complianceTitleRow.getCell(1).font = { size: 16, bold: true, color: { argb: '0070C0' } };
  complianceTitleRow.getCell(1).alignment = { horizontal: 'center' };
  
  complianceSheet.addRow([]);
  complianceSheet.addRow(['Conformité réglementaire', '', '']);
  const complianceHeader = complianceSheet.lastRow;
  complianceHeader!.getCell(1).font = { bold: true, size: 14 };
  
  complianceSheet.addRow(['Domaine réglementaire', 'Statut', 'Commentaires']);
  const compHeaderRow = complianceSheet.lastRow;
  for (let i = 1; i <= 3; i++) {
    compHeaderRow!.getCell(i).font = { bold: true };
    compHeaderRow!.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E6E6E6' }
    };
    compHeaderRow!.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Add compliance data
  const complianceStatus = (mission.complianceStatus && typeof mission.complianceStatus === 'object') ? mission.complianceStatus as Record<string, any> : {};
  complianceSheet.addRow([
    'RGPD / Protection des données', 
    ("gdpr" in complianceStatus ? complianceStatus.gdpr?.toString() : '') || '', 
    ("gdprComments" in complianceStatus ? complianceStatus.gdprComments?.toString() : '') || ''
  ]);
  complianceSheet.addRow([
    'Droit du travail', 
    ("laborLaw" in complianceStatus ? complianceStatus.laborLaw?.toString() : '') || '', 
    ("laborLawComments" in complianceStatus ? complianceStatus.laborLawComments?.toString() : '') || ''
  ]);
  complianceSheet.addRow([
    'Normes sectorielles', 
    ("industryStandards" in complianceStatus ? complianceStatus.industryStandards?.toString() : '') || '', 
    ("industryStandardsComments" in complianceStatus ? complianceStatus.industryStandardsComments?.toString() : '') || ''
  ]);
  
  // Add governance structure
  const governanceStructure = (mission.governanceStructure && typeof mission.governanceStructure === 'object') ? mission.governanceStructure as Record<string, any> : {};
  complianceSheet.addRow(['Structure de l\'actionnariat', ("shareholderStructure" in governanceStructure ? governanceStructure.shareholderStructure?.toString() : '') || '', '']);
  complianceSheet.addRow(['Fréquence des réunions du conseil', ("boardMeetings" in governanceStructure ? governanceStructure.boardMeetings?.toString() : '') || '', '']);
  complianceSheet.addRow(['Comités spécialisés', '', '']);
  if ("committees" in governanceStructure && Array.isArray(governanceStructure.committees)) {
    for (const committee of governanceStructure.committees) {
      complianceSheet.addRow(['- ' + committee, '', '']);
    }
  }
  
  // Add recommendations worksheet
  const recommendationsSheet = workbook.addWorksheet('Recommandations');
  
  recommendationsSheet.getColumn(1).width = 40;
  recommendationsSheet.getColumn(2).width = 15;
  recommendationsSheet.getColumn(3).width = 20;
  recommendationsSheet.getColumn(4).width = 15;
  
  // Add title
  recommendationsSheet.mergeCells('A1:D1');
  const recTitleRow = recommendationsSheet.getRow(1);
  recTitleRow.getCell(1).value = 'RECOMMANDATIONS ET PLAN D\'ACTION';
  recTitleRow.getCell(1).font = { size: 16, bold: true, color: { argb: '0070C0' } };
  recTitleRow.getCell(1).alignment = { horizontal: 'center' };
  
  recommendationsSheet.addRow([]);
  recommendationsSheet.addRow(['Synthèse des observations']);
  const obsHeader = recommendationsSheet.lastRow;
  obsHeader!.getCell(1).font = { bold: true };
  
  recommendationsSheet.addRow([mission.observations || '']);
  
  recommendationsSheet.addRow([]);
  recommendationsSheet.addRow(['Recommandations', '', '', '']);
  const recHeader = recommendationsSheet.lastRow;
  recHeader!.getCell(1).font = { bold: true, size: 14 };
  
  recommendationsSheet.addRow(['Description', 'Priorité', 'Responsable', 'Échéance']);
  const recHeaderRow = recommendationsSheet.lastRow;
  for (let i = 1; i <= 4; i++) {
    recHeaderRow!.getCell(i).font = { bold: true };
    recHeaderRow!.getCell(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E6E6E6' }
    };
    recHeaderRow!.getCell(i).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }
  
  // Add recommendation data
  for (const recommendation of mission.recommendations) {
    recommendationsSheet.addRow([
      recommendation.description,
      recommendation.priority,
      recommendation.responsible,
      recommendation.deadline
    ]);
  }
  
  // Add follow-up plan
  recommendationsSheet.addRow([]);
  recommendationsSheet.addRow(['Plan de suivi', '', '', '']);
  const followUpHeader = recommendationsSheet.lastRow;
  followUpHeader!.getCell(1).font = { bold: true, size: 14 };
  
  recommendationsSheet.addRow(['Date de la prochaine revue', mission.followUpDate || '', '', '']);
  recommendationsSheet.addRow(['Responsable du suivi', mission.followUpResponsible || '', '', '']);
  recommendationsSheet.addRow(['Modalités de suivi', '', '', '']);
  recommendationsSheet.addRow([mission.followUpDetails || '', '', '', '']);
  
  // Présentation de l'organisme (tout dans une seule feuille)
  const orgSheet = workbook.addWorksheet("Présentation de l'organisme");
  orgSheet.getColumn(1).width = 30;
  orgSheet.getColumn(2).width = 60;

  // Bloc 1 : Informations générales
  orgSheet.addRow(["Informations générales", ""]);
  if (orgSheet.lastRow) orgSheet.getRow(orgSheet.lastRow.number).font = { bold: true, size: 14 };
  orgSheet.addRow(["Nom de l'organisme", mission.orgName || ""]);
  orgSheet.addRow(["Date de création", mission.orgCreationDate || ""]);
  orgSheet.addRow(["Activité principale", mission.orgBusinessActivity || ""]);
  orgSheet.addRow(["Coordonnées", mission.orgContactInfo || ""]);
  orgSheet.addRow(["Site web", mission.orgWebsite || ""]);

  // Espace
  orgSheet.addRow([]);

  // Bloc 2 : Cartographie des processus
  orgSheet.addRow(["Cartographie des processus", ""]);
  if (orgSheet.lastRow) orgSheet.getRow(orgSheet.lastRow.number).font = { bold: true, size: 14 };
  orgSheet.addRow(["ID", "Processus", "Description", "Type de données traitées"]);
  if (orgSheet.lastRow) orgSheet.getRow(orgSheet.lastRow.number).font = { bold: true };
  if (Array.isArray(mission.businessProcesses)) {
    for (const proc of mission.businessProcesses) {
      orgSheet.addRow([
        proc.id,
        proc.name || "",
        proc.description || "",
        proc.dataType || ""
      ]);
    }
  }

  // Espace
  orgSheet.addRow([]);

  // Bloc 3 : Exigences de sécurité (6 processus statiques)
  orgSheet.addRow(["Exigences de sécurité pour chaque processus", ""]);
  if (orgSheet.lastRow) orgSheet.getRow(orgSheet.lastRow.number).font = { bold: true, size: 14 };
  orgSheet.addRow([
    'Processus',
    'Confidentialité',
    'Intégrité',
    'Disponibilité',
    'Criticité',
    'Classification',
    'Commentaires'
  ]);
  if (orgSheet.lastRow) orgSheet.getRow(orgSheet.lastRow.number).font = { bold: true };
  const staticSecurityProcesses = [
    { id: 1, name: "Gestion des audits" },
    { id: 2, name: "Gestion des risques" },
    { id: 3, name: "Gestion des ressources humaines" },
    { id: 4, name: "Services fiscaux" },
    { id: 5, name: "Gestion des incidents de sécurité" },
    { id: 6, name: "Gestion des achats" },
  ];
  if (Array.isArray(mission.securityRequirements)) {
    for (let i = 0; i < staticSecurityProcesses.length; i++) {
      const proc = staticSecurityProcesses[i];
      const req = mission.securityRequirements.find((r: any) => r.processId === proc.id) || {};
      const confidentiality = req.confidentiality ?? 1;
      const integrity = req.integrity ?? 1;
      const availability = req.availability ?? 1;
      const criticality = Math.max(confidentiality, integrity, availability);
      let classification = '';
      switch (criticality) {
        case 4:
          classification = 'critique et prioritaire'; break;
        case 3:
          classification = 'important mais avec flexibilité'; break;
        case 2:
          classification = 'modéré nécessite vigilance'; break;
        case 1:
        default:
          classification = 'faible, peu impactant'; break;
      }
      orgSheet.addRow([
        proc.name,
        confidentiality,
        integrity,
        availability,
        criticality,
        classification,
        req.comments || ''
      ]);
    }
  }
  
  // Ajout de la feuille de synthèse des résultats de l'audit
  const synthesisSheet = workbook.addWorksheet("Synthèse des résultats de l'audit");
  synthesisSheet.getColumn(1).width = 30;
  synthesisSheet.getColumn(2).width = 30;
  synthesisSheet.getColumn(3).width = 30;
  synthesisSheet.getColumn(4).width = 30;
  synthesisSheet.getColumn(5).width = 30;
  synthesisSheet.getColumn(6).width = 30;
  synthesisSheet.getColumn(7).width = 30;

  // Typage permissif pour auditSynthesis
  const auditSynthesis: any = mission.auditSynthesis || {};

  // Tableau 1 : Critères/Référentiels
  synthesisSheet.addRow(["Critère/Référentiel", "Description"]);
  if (auditSynthesis.criteria) {
    for (const row of auditSynthesis.criteria) {
      synthesisSheet.addRow([row.ref, row.desc]);
    }
  }
  synthesisSheet.addRow([]);

  // Tableau 2 : Responsabilité et limites
  synthesisSheet.addRow(["Responsabilité de l'Auditeur", "Limites de l'Audit"]);
  if (auditSynthesis.responsibility) {
    for (const row of auditSynthesis.responsibility) {
      synthesisSheet.addRow([row.resp, row.limit]);
    }
  }
  synthesisSheet.addRow([]);

  // Tableau 3 : Types de tests
  synthesisSheet.addRow(["Type de test", "Nature du test", "Objectif"]);
  if (auditSynthesis.tests) {
    for (const row of auditSynthesis.tests) {
      synthesisSheet.addRow([row.type, row.nature, row.objectif]);
    }
  }
  synthesisSheet.addRow([]);

  // Tableau 4 : Plan d'action
  synthesisSheet.addRow(["Projet", "Action", "Criticité", "Chargé de l'action", "Charge (H/J)", "Taux de réalisation", "Évaluation"]);
  if (auditSynthesis.actions) {
    for (const row of auditSynthesis.actions) {
      synthesisSheet.addRow([row.projet, row.action, row.criticite, row.chargee, row.charge, row.taux, row.eval]);
    }
  }
  synthesisSheet.addRow([]);

  // Tableau 5 : Présentation de l'évolution des indicateurs de sécurité
  if (auditSynthesis.indicators && Array.isArray(auditSynthesis.indicators) && auditSynthesis.indicators.length > 0) {
    const allYearsSet = new Set<string>();
    auditSynthesis.indicators.forEach((row: any) => {
      Object.keys(row.values || {}).forEach((year) => allYearsSet.add(year));
    });
    const years = Array.from(allYearsSet).sort();
    if (years.length < 2) years.push((parseInt(years[0] || '2023') + 1).toString());
    synthesisSheet.addRow([
      "Indicateur de sécurité",
      ...years.map(y => `${y} (%)`),
      "Variation (%)"
    ]);
    for (const row of auditSynthesis.indicators) {
      const values = years.map(y => row.values?.[y] ?? "");
      const first = parseFloat(row.values?.[years[0]]?.toString().replace(",", ".") ?? "");
      const last = parseFloat(row.values?.[years[years.length - 1]]?.toString().replace(",", ".") ?? "");
      let variation = "";
      if (!isNaN(first) && !isNaN(last) && first !== 0) {
        variation = ((last - first) / first * 100).toFixed(2) + " %";
      }
      synthesisSheet.addRow([
        row.indicateur,
        ...values,
        variation
      ]);
    }
    synthesisSheet.addRow([]);
  }

  // Tableau 6 : Synthèse des Bonnes Pratiques et Défaillances
  synthesisSheet.addRow(["Bonnes pratiques identifiées", "Défaillances enregistrées"]);
  if (auditSynthesis.practices) {
    for (const row of auditSynthesis.practices) {
      synthesisSheet.addRow([row.bonne, row.defaillance]);
    }
  }
  synthesisSheet.addRow([]);

  // Tableau 7 : État de maturité
  synthesisSheet.addRow(["Domaine", "Sous-domaine", "Référence", "Énoncé", "Valeur attribuée", "Commentaire"]);
  if (auditSynthesis.maturity) {
    for (const row of auditSynthesis.maturity) {
      synthesisSheet.addRow([row.domaine, row.sousDomaine, row.reference, row.enonce, row.valeur, row.commentaire]);
    }
  }
  synthesisSheet.addRow([]);
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
