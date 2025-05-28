import { FormSection } from "@/lib/utils/form-sections";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MissionFormData } from "@shared/schema";
import { 
  companyTypes, 
  activitySectors, 
  complianceStatusOptions, 
  shareholderStructureOptions, 
  boardMeetingOptions, 
  committeeOptions 
} from "@/lib/utils/form-sections";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactsField } from "./ContactsField";
import { RisksField } from "./RisksField";
import { RecommendationsField } from "./RecommendationsField";
import { AvantProposSection } from "./AvantProposSection";
import { MissionFrameworkSection } from "./MissionFrameworkSection";
import { OrganizationPresentationSection } from "./OrganizationPresentationSection";
import { AuditScopeSection } from "./AuditScopeSection";
import { AuditMethodologySection } from "./AuditMethodologySection";
import { AuditSynthesisSection } from "./AuditSynthesisSection";
import RiskAppreciationSection from "./RiskAppreciationSection";

interface AuditFormSectionProps {
  section: FormSection;
  currentSection: number;
  form: ReturnType<typeof useFormContext<MissionFormData>>;
}

export function AuditFormSection({ section, currentSection, form }: AuditFormSectionProps) {
  const isCompleted = section.isCompleted(form.getValues());

  // Section 0: Avant propos
  const renderAvantPropos = () => (
    <AvantProposSection form={form} />
  );
  
  // Section 1: Cadre de la mission
  const renderMissionFramework = () => (
    <MissionFrameworkSection form={form} />
  );
  
  // Section 2: Organization Presentation
  const renderOrgPresentation = () => (
    <OrganizationPresentationSection form={form} />
  );
  
  // Section 3: Audit Scope
  const renderAuditScope = () => (
    <AuditScopeSection form={form} />
  );
  
  // Section 4: Audit Methodology
  const renderAuditMethodology = () => (
    <AuditMethodologySection form={form} />
  );

  // Section 5: Synthèse des résultats de l'audit
  const renderAuditSynthesis = () => (
    <AuditSynthesisSection form={form} />
  );

  // Render the appropriate section based on currentSection
  switch (currentSection) {
    case 0:
      return renderAvantPropos();
    case 1:
      return renderMissionFramework();
    case 2:
      return renderOrgPresentation();
    case 3:
      return renderAuditScope();
    case 4:
      return renderAuditMethodology();
    case 5:
      return renderAuditSynthesis();
    default:
      return null;
  }

  if (section.name === "Appréciation des risques") {
    return <RiskAppreciationSection />;
  }
}
