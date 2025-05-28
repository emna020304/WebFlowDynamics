import { MissionFormData } from "@shared/schema";

// Validator function type
type ValidatorFn = (data: MissionFormData) => boolean;

// Form section interface
export interface FormSection {
  id: number;
  name: string;
  description?: string;
  isCompleted: ValidatorFn;
}

// Avant propos section validation
const avantProposCompleted: ValidatorFn = (data) => {
  // La section est complétée si au moins une option de confidentialité est sélectionnée,
  // il y a au moins un élément dans l'historique des versions,
  // et il y a au moins un contact dans la diffusion côté auditeur
  return Boolean(
    data.confidentialityOptions && 
    (data.confidentialityOptions.noDisclosure || 
     data.confidentialityOptions.noReproduction || 
     data.confidentialityOptions.noPersonalUse || 
     data.confidentialityOptions.noCommercialUse) &&
    data.versionHistory && 
    data.versionHistory.length > 0 &&
    data.auditorContacts && 
    data.auditorContacts.length > 0
  );
};

// Mission framework section validation
const missionFrameworkCompleted: ValidatorFn = (data) => {
  // La section est complétée si au moins le cadre légal, le type d'audit et l'objectif sont remplis
  return Boolean(
    data.legalFrameworkText &&
    data.auditType &&
    data.missionObjective
  );
};

// Organization presentation section validation
const orgPresentationCompleted: ValidatorFn = (data) => {
  // La section est complétée si les informations de base et au moins un processus sont remplis
  return Boolean(
    data.orgName &&
    data.orgBusinessActivity &&
    data.businessProcesses &&
    data.businessProcesses.length > 0 &&
    // Vérifier qu'au moins une exigence de sécurité est définie
    data.securityRequirements &&
    data.securityRequirements.length > 0
  );
};

// Audit scope section validation
const auditScopeCompleted: ValidatorFn = (data) => {
  // La section est complétée si au moins le périmètre géographique et les impacts sont remplis
  return Boolean(
    data.geographicPerimeter && 
    data.geographicPerimeter.length > 0 &&
    data.operationsImpact &&
    data.sensitiveData &&
    data.infrastructureComplexity &&
    // Vérifier qu'au moins une application est définie
    data.applications && 
    data.applications.length > 0 &&
    // Vérifier qu'au moins un élément d'infrastructure est défini
    data.networkInfrastructure && 
    data.networkInfrastructure.length > 0 &&
    // Vérifier qu'au moins un poste de travail est défini
    data.workstations && 
    data.workstations.length > 0 &&
    // Vérifier qu'au moins un serveur est défini
    data.servers && 
    data.servers.length > 0
  );
};

// Méthodologie d'audit validation
const auditMethodologyCompleted: ValidatorFn = (data) => {
  // La section est complétée si au moins les domaines de sécurité, la maturité et les outils sont remplis
  return Boolean(
    // Vérifier les domaines de sécurité
    data.securityDomains && 
    data.securityDomains.length > 0 &&
    // Vérifier la maturité des mesures
    data.securityMeasuresMaturity && 
    data.securityMeasuresMaturity.length > 0 &&
    // Vérifier les outils d'audit
    data.auditTools && 
    data.auditTools.length > 0 &&
    // Vérifier les checklists
    data.auditChecklists && 
    data.auditChecklists.length > 0 &&
    // Vérifier l'équipe d'audit
    data.auditTeam && 
    data.auditTeam.length > 0 &&
    // Vérifier l'équipe côté organisme
    data.organizationTeam && 
    data.organizationTeam.length > 0 &&
    // Vérifier le planning d'exécution
    data.missionPlanning && 
    data.missionPlanning.length > 0
  );
};

// Form sections definition
export const formSections: FormSection[] = [
  {
    id: 0,
    name: "Avant propos",
    description: "Informations sur la confidentialité et la diffusion du document",
    isCompleted: avantProposCompleted
  },
  {
    id: 1,
    name: "Cadre de la mission",
    description: "Contexte légal et réglementaire, objectifs et limites",
    isCompleted: missionFrameworkCompleted
  },
  {
    id: 2,
    name: "Présentation de l'organisme",
    description: "Présentation générale et cartographie des processus",
    isCompleted: orgPresentationCompleted
  },
  {
    id: 3,
    name: "Champ d'audit",
    description: "Périmètre, applications et infrastructure auditée",
    isCompleted: auditScopeCompleted
  },
  {
    id: 4,
    name: "Méthodologie d'audit",
    description: "Référentiels, outils, équipes et planning d'exécution",
    isCompleted: auditMethodologyCompleted
  },
  {
    id: 5,
    name: "Synthèse des résultats de l'audit",
    description: "Tableaux de synthèse des résultats, actions, maturité, indicateurs, etc.",
    isCompleted: () => true
  },
  {
    id: 6,
    name: "Appréciation des risques",
    description: "Matrice, cartographie et plan de traitement des risques",
    isCompleted: () => true
  }
];

// Risk types options
export const riskTypes = [
  "Risque opérationnel",
  "Risque financier",
  "Risque juridique",
  "Risque informatique",
  "Risque stratégique",
  "Risque de conformité",
  "Risque de réputation",
  "Risque de marché",
  "Risque environnemental",
  "Autre"
];

// Probability options
export const probabilityOptions = [
  "Faible",
  "Moyenne",
  "Élevée",
  "Très élevée"
];

// Impact options
export const impactOptions = [
  "Faible",
  "Moyen",
  "Élevé",
  "Très élevé"
];

// Priority options
export const priorityOptions = [
  { value: "high", label: "Haute" },
  { value: "medium", label: "Moyenne" },
  { value: "low", label: "Basse" }
];

// Compliance status options
export const complianceStatusOptions = [
  "Conforme",
  "Partiellement conforme",
  "Non conforme",
  "Non applicable"
];

// Company types
export const companyTypes = [
  "SARL",
  "SA",
  "SAS",
  "EURL",
  "SCI",
  "SASU",
  "Autre"
];

// Activity sectors
export const activitySectors = [
  "Technologie",
  "Finance",
  "Santé",
  "Commerce",
  "Industrie",
  "Services",
  "Éducation",
  "Transport",
  "Agriculture",
  "Énergie",
  "Autre"
];

// Shareholder structure options
export const shareholderStructureOptions = [
  "Actionnariat unique",
  "Actionnariat multiple",
  "Société cotée",
  "Filiale d'un groupe"
];

// Board meeting frequency options
export const boardMeetingOptions = [
  "Mensuelle",
  "Trimestrielle",
  "Semestrielle",
  "Annuelle"
];

// Committee options
export const committeeOptions = [
  "Comité d'audit",
  "Comité des risques",
  "Comité des rémunérations",
  "Comité des nominations",
  "Comité stratégique",
  "Comité éthique"
];

// Security domains options
export const securityDomainOptions = [
  "Mesures de sécurité organisationnelles (37)",
  "Mesures de sécurité applicables au personnel (8)",
  "Mesures de sécurité physique (14)",
  "Mesures de sécurité technologiques (34)"
];

// Security measures maturity options
export const maturityOptions = [
  { value: "none", label: "Inexistant (0%)" },
  { value: "basic", label: "Basic (25%)" },
  { value: "average", label: "Moyen (50%)" },
  { value: "good", label: "Bon (75%)" },
  { value: "excellent", label: "Excellent (100%)" }
];

export const auditPhases = [
  { value: "phase0", label: "Phase 0: Déclenchement de l'Audit", description: "Organisation de l'audit et préparation du plan d'audit" },
  { value: "phase1", label: "Phase 1: Audit Organisationnel et Physique", description: "Inspection des lieux et des installations physiques" },  
  { value: "phase2", label: "Phase 2: Appréciation des Risques", description: "Étude des risques et identification des menaces" },
  { value: "phase3", label: "Phase 3: Audit Technique", description: "Évaluation de la sécurité des systèmes informatiques" },
  { value: "phase4", label: "Phase 4: Sensibilisation Post-Audit", description: "Présentation des résultats préliminaires" },
  { value: "phase5", label: "Phase 5: Préparation du Rapport d'Audit", description: "Rédaction du rapport d'audit final" }
];

// Audit tool types
export const auditToolTypes = [
  { value: "vuln_scan", label: "Scanner de vulnérabilités" },
  { value: "net_sniffer", label: "Analyseur réseau" },
  { value: "pentest", label: "Outils de pentest" },
  { value: "compliance", label: "Verification compliance" },
  { value: "other", label: "Autre" }
];

// Task status options
export const taskStatusOptions = [
  { value: "not_started", label: "Non commencé" },
  { value: "in_progress", label: "En cours" },
  { value: "delayed", label: "Retardé" },
  { value: "completed", label: "Terminé" },
  { value: "canceled", label: "Annulé" }
];
