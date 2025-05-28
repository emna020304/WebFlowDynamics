import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MissionFormData, missionFormSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { formSections } from "@/lib/utils/form-sections";
import { MissionHeader } from "@/components/mission/MissionHeader";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { FormNavigation } from "@/components/mission/FormNavigation";
import { AuditFormSection } from "@/components/mission/AuditFormSection";
import { Button } from "@/components/ui/button";

interface MissionFormProps {
  id?: string;
}

export default function MissionForm({ id }: MissionFormProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const isEdit = Boolean(id);
  const missionId = id ? parseInt(id) : undefined;

  // Fetch mission data if in edit mode
  const { data: missionData, isLoading: isFetchingMission } = useQuery({
    queryKey: isEdit ? [`/api/missions/${missionId}`] : null,
    queryFn: isEdit ? undefined : null,
  });

  // Form setup
  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      title: "",
      companyName: "",
      companyType: "",
      registrationNumber: "",
      creationDate: "",
      address: "",
      activitySector: "",
      status: "draft",
      progress: 0,
      // Avant propos values
      confidentialityOptions: {
        noDisclosure: false,
        noReproduction: false,
        noPersonalUse: false,
        noCommercialUse: false,
      },
      versionHistory: [{
        version: "1.0",
        date: new Date().toISOString().split('T')[0],
        author: "Belkhiria Emna",
        changes: "Création du rapport"
      }],
      auditorContacts: [{
        name: "Dupont",
        firstName: "Jean",
        title: "Auditeur",
        phone: "53970527",
        email: "jean@example.com"
      }],
      auditedOrgContacts: [{
        name: "Omrani",
        firstName: "Ahmed",
        title: "Responsable",
        phone: "97863452",
        email: "omrani@audite.com"
      }],
      // Original fields
      contacts: [{ name: "", position: "", email: "" }],
      risks: [{ riskType: "", probability: "", impact: "", description: "", mitigation: "" }],
      recommendations: [{ description: "", priority: "medium", responsible: "", deadline: "" }],
    },
    mode: "onChange",
  });

  // Update form values when fetching existing mission
  useEffect(() => {
    if (missionData) {
      // Reset the form with mission data
      const missionDataTyped = missionData as MissionFormData;
      const { contacts, risks, recommendations, ...rest } = missionDataTyped;
      
      // Préparer des valeurs par défaut pour les nouvelles sections si elles n'existent pas dans les données
      const defaultConfidentialityOptions = {
        noDisclosure: false,
        noReproduction: false,
        noPersonalUse: false,
        noCommercialUse: false,
      };
      
      const defaultVersionHistory = [{
        version: "1.0",
        date: new Date().toISOString().split('T')[0],
        author: "Belkhiria Emna",
        changes: "Création du rapport"
      }];
      
      const defaultAuditorContacts = [{
        name: "Dupont",
        firstName: "Jean",
        title: "Auditeur",
        phone: "53970527",
        email: "jean@example.com"
      }];
      
      const defaultAuditedOrgContacts = [{
        name: "Omrani",
        firstName: "Ahmed",
        title: "Responsable",
        phone: "97863452",
        email: "omrani@audite.com"
      }];
      
      form.reset({
        ...rest,
        // Données de l'avant propos
        confidentialityOptions: rest.confidentialityOptions || defaultConfidentialityOptions,
        versionHistory: rest.versionHistory?.length ? rest.versionHistory : defaultVersionHistory,
        auditorContacts: rest.auditorContacts?.length ? rest.auditorContacts : defaultAuditorContacts,
        auditedOrgContacts: rest.auditedOrgContacts?.length ? rest.auditedOrgContacts : defaultAuditedOrgContacts,
        // Données originales
        contacts: contacts?.length ? contacts : [{ name: "", position: "", email: "" }],
        risks: risks?.length ? risks : [{ riskType: "", probability: "", impact: "", description: "", mitigation: "" }],
        recommendations: recommendations?.length 
          ? recommendations 
          : [{ description: "", priority: "medium", responsible: "", deadline: "" }],
      });
    }
  }, [missionData, form]);

  // Create or update mission
  const mutation = useMutation({
    mutationFn: async (data: MissionFormData) => {
      if (isEdit && missionId) {
        return apiRequest("PUT", `/api/missions/${missionId}`, data);
      } else {
        return apiRequest("POST", "/api/missions", data);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      if (missionId) {
        queryClient.invalidateQueries({ queryKey: [`/api/missions/${missionId}`] });
      }
      
      toast({
        title: isEdit ? "Mission mise à jour" : "Mission créée",
        description: isEdit 
          ? "La mission d'audit a été mise à jour avec succès." 
          : "Nouvelle mission d'audit créée avec succès.",
      });
      
      navigate("/missions");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'enregistrement: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: MissionFormData) => {
    mutation.mutate(data);
  };

  // Affichage global d'erreur de validation
  const hasFormErrors = Object.keys(form.formState.errors).length > 0;

  // Calculate progress based on form completion
  const calculateProgress = () => {
    const sections = formSections.map(section => {
      const values = form.getValues();
      return {
        ...section,
        completed: section.isCompleted(values)
      };
    });
    
    return sections;
  };

  const progressSteps = calculateProgress();
  const completedSections = progressSteps.filter(s => s.completed).length;
  const progressPercentage = Math.round((completedSections / progressSteps.length) * 100);

  // Save progress without navigating away
  const saveProgress = async () => {
    try {
      const data = form.getValues();
      if (isEdit && missionId) {
        await apiRequest("PUT", `/api/missions/${missionId}`, {
          ...data,
          progress: progressPercentage
        });
        queryClient.invalidateQueries({ queryKey: [`/api/missions/${missionId}`] });
        toast({
          title: "Progrès sauvegardé",
          description: "Les modifications ont été enregistrées."
        });
      } else {
        const response = await apiRequest("POST", "/api/missions", {
          ...data,
          progress: progressPercentage
        });
        const result = await response.json();
        queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
        navigate(`/missions/${result.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur lors de l'enregistrement: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Navigation between sections
  const goToNextSection = () => {
    if (currentSection < formSections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  if (isFetchingMission) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de la mission...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {hasFormErrors && (
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
              Merci de corriger les erreurs dans le formulaire avant de soumettre.
            </div>
          )}
          <MissionHeader 
            isEdit={isEdit}
            title={form.watch("title")}
            companyName={form.watch("companyName")}
            progress={progressPercentage}
            status={form.watch("status") ?? ""}
            saving={mutation.isPending}
            onSave={saveProgress}
            missionId={missionId}
          />
          
          <Card className="p-6">
            <ProgressSteps 
              steps={progressSteps.map((s, idx) => ({ 
                id: idx, 
                name: s.name, 
                completed: s.completed 
              }))}
              currentStep={currentSection}
              onStepClick={setCurrentSection}
              className="mb-6"
            />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FormNavigation 
                sections={progressSteps}
                currentSection={currentSection}
                onSectionClick={setCurrentSection}
              />
            </div>
            
            <div className="lg:col-span-3">
              <Card className="p-6">
                <AuditFormSection
                  section={formSections[currentSection]}
                  currentSection={currentSection}
                  form={form}
                />
                
                <div className="flex justify-end space-x-4 mt-6">
                  {currentSection > 0 && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={goToPreviousSection}
                    >
                      Section précédente
                    </Button>
                  )}
                  
                  {currentSection < formSections.length - 1 ? (
                    <Button 
                      type="button"
                      onClick={goToNextSection}
                    >
                      Section suivante
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Finaliser l'audit
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
