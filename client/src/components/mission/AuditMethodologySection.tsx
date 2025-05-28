import React, { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Calendar } from "lucide-react";
import { 
  securityDomainOptions, 
  maturityOptions, 
  auditToolTypes,
  auditPhases,
  taskStatusOptions
} from "@/lib/utils/form-sections";
import { MissionFormData } from "@shared/schema";

interface AuditMethodologySectionProps {
  form: any;
}

export function AuditMethodologySection({ form }: AuditMethodologySectionProps) {
  // Fonction utilitaire pour formater la date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };
  const [activeTab, setActiveTab] = useState("security-domains");

  // Security Domains
  const securityDomains = form.watch("securityDomains") || [];
  const addSecurityDomain = () => {
    const newId = securityDomains.length > 0 
      ? Math.max(...securityDomains.map((d: any) => d.id)) + 1 
      : 1;
    
    form.setValue("securityDomains", [
      ...securityDomains,
      {
        id: newId,
        domainName: "",
        referential: "",
        actions: ""
      }
    ]);
  };
  
  const removeSecurityDomain = (id: number) => {
    form.setValue(
      "securityDomains",
      securityDomains.filter((domain: any) => domain.id !== id)
    );
  };

  // Security Measures Maturity
  const securityMeasuresMaturity = form.watch("securityMeasuresMaturity") || [];
  const addSecurityMeasureMaturity = () => {
    const newId = securityMeasuresMaturity.length > 0 
      ? Math.max(...securityMeasuresMaturity.map((m: any) => m.id)) + 1 
      : 1;
    
    form.setValue("securityMeasuresMaturity", [
      ...securityMeasuresMaturity,
      {
        id: newId,
        domainName: "",
        maturityLevel: "",
        comments: ""
      }
    ]);
  };
  
  const removeSecurityMeasureMaturity = (id: number) => {
    form.setValue(
      "securityMeasuresMaturity",
      securityMeasuresMaturity.filter((measure: any) => measure.id !== id)
    );
  };

  // Audit Tools
  const auditTools = form.watch("auditTools") || [];
  const addAuditTool = () => {
    const newId = auditTools.length > 0 
      ? Math.max(...auditTools.map((t: any) => t.id)) + 1 
      : 1;
    
    form.setValue("auditTools", [
      ...auditTools,
      {
        id: newId,
        toolName: "",
        version: "",
        purpose: "",
        mainResponsible: "",
        usageComments: ""
      }
    ]);
  };
  
  const removeAuditTool = (id: number) => {
    form.setValue(
      "auditTools",
      auditTools.filter((tool: any) => tool.id !== id)
    );
  };

  // Audit Checklists
  const auditChecklists = form.watch("auditChecklists") || [];
  const addAuditChecklist = () => {
    const newId = auditChecklists.length > 0 
      ? Math.max(...auditChecklists.map((c: any) => c.id)) + 1 
      : 1;
    
    form.setValue("auditChecklists", [
      ...auditChecklists,
      {
        id: newId,
        checklistName: "",
        version: "",
        source: "",
        description: "",
        lastUpdate: ""
      }
    ]);
  };
  
  const removeAuditChecklist = (id: number) => {
    form.setValue(
      "auditChecklists",
      auditChecklists.filter((checklist: any) => checklist.id !== id)
    );
  };

  // Audit Team
  const auditTeam = form.watch("auditTeam") || [];
  const addAuditTeamMember = () => {
    const newId = auditTeam.length > 0 
      ? Math.max(...auditTeam.map((m: any) => m.id)) + 1 
      : 1;
    
    form.setValue("auditTeam", [
      ...auditTeam,
      {
        id: newId,
        name: "",
        role: "",
        qualification: "",
        certifiedBy: "",
        observationsPro: ""
      }
    ]);
  };
  
  const removeAuditTeamMember = (id: number) => {
    form.setValue(
      "auditTeam",
      auditTeam.filter((member: any) => member.id !== id)
    );
  };

  // Organization Team
  const organizationTeam = form.watch("organizationTeam") || [];
  const addOrganizationTeamMember = () => {
    const newId = organizationTeam.length > 0 
      ? Math.max(...organizationTeam.map((m: any) => m.id)) + 1 
      : 1;
    
    form.setValue("organizationTeam", [
      ...organizationTeam,
      {
        id: newId,
        name: "",
        position: "",
        function: ""
      }
    ]);
  };
  
  const removeOrganizationTeamMember = (id: number) => {
    form.setValue(
      "organizationTeam",
      organizationTeam.filter((member: any) => member.id !== id)
    );
  };

  // Mission Planning
  const missionPlanning = form.watch("missionPlanning") || [];
  const addMissionPlanningTask = () => {
    const newId = missionPlanning.length > 0 
      ? Math.max(...missionPlanning.map((t: any) => t.id)) + 1 
      : 1;
    
    form.setValue("missionPlanning", [
      ...missionPlanning,
      {
        id: newId,
        phase: "",
        taskDescription: "",
        startDate: "",
        endDate: "",
        period: 1,
        status: "not_started",
        manDays: 1,
        peopleInvolved: 1
      }
    ]);
  };
  
  const removeMissionPlanningTask = (id: number) => {
    form.setValue(
      "missionPlanning",
      missionPlanning.filter((task: any) => task.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Méthodologie d'audit</h2>
        <Badge variant="secondary" className="text-sm">
          {securityDomains.length > 0 ? "En cours" : "À compléter"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 mb-6">
          <TabsTrigger value="security-domains">Domaines de sécurité</TabsTrigger>
          <TabsTrigger value="maturity">Maturité des mesures</TabsTrigger>
          <TabsTrigger value="tools">Outils d'audit</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="audit-team">Équipe d'audit</TabsTrigger>
          <TabsTrigger value="organization-team">Équipe côté organisme</TabsTrigger>
          <TabsTrigger value="planning">Planning d'exécution</TabsTrigger>
        </TabsList>

        {/* Domaines de sécurité */}
        <TabsContent value="security-domains" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Domaines de sécurité audités</h3>
            <Button type="button" onClick={addSecurityDomain} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un domaine
            </Button>
          </div>

          {securityDomains.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucun domaine de sécurité défini. Ajoutez-en un en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Domaine de sécurité</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Référentiel d'audit (ANCS)</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions auditées</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {securityDomains.map((domain: any, index: number) => (
                    <tr key={domain.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`securityDomains.${index}.domainName`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un domaine" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {securityDomainOptions.map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`securityDomains.${index}.referential`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Référentiel d'audit (ANCS)" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`securityDomains.${index}.actions`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Textarea placeholder="Description des actions auditées..." {...field} rows={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSecurityDomain(domain.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Maturité des mesures */}
        <TabsContent value="maturity" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Maturité des Mesures de Sécurité</h3>
            <Button type="button" onClick={addSecurityMeasureMaturity} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter une évaluation
            </Button>
          </div>

          {securityMeasuresMaturity.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucune évaluation de maturité définie. Ajoutez-en une en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Domaine de sécurité</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Maturité des mesures</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Commentaires</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {securityMeasuresMaturity.map((measure: any, index: number) => (
                    <tr key={measure.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`securityMeasuresMaturity.${index}.domainName`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un domaine" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {securityDomainOptions.map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`securityMeasuresMaturity.${index}.maturityLevel`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Niveau de maturité" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {maturityOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`securityMeasuresMaturity.${index}.comments`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Textarea placeholder="Détails sur la maturité..." {...field} rows={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSecurityMeasureMaturity(measure.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Outils d'audit */}
        <TabsContent value="tools" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Les outils d'audit utilisés</h3>
            <Button type="button" onClick={addAuditTool} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un outil
            </Button>
          </div>

          {auditTools.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucun outil d'audit défini. Ajoutez-en un en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Nom d'outil</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Version utilisée</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Objectif</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Responsable principal</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Commentaires sur l'utilisation</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTools.map((tool: any, index: number) => (
                    <tr key={tool.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTools.${index}.toolName`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: NMAP" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTools.${index}.version`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: 7.9.1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTools.${index}.purpose`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Scanner réseau" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTools.${index}.mainResponsible`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Jean Dupont" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTools.${index}.usageComments`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Textarea placeholder="Commentaires..." {...field} rows={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAuditTool(tool.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Checklists */}
        <TabsContent value="checklists" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Les checklists utilisées</h3>
            <Button type="button" onClick={addAuditChecklist} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter une checklist
            </Button>
          </div>

          {auditChecklists.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucune checklist définie. Ajoutez-en une en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Nom</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Version</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Source</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Dernière mise à jour</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditChecklists.map((checklist: any, index: number) => (
                    <tr key={checklist.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditChecklists.${index}.checklistName`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Checklist sécurité réseau" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditChecklists.${index}.version`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: 1.0" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditChecklists.${index}.source`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: NIST" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditChecklists.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Textarea placeholder="Description..." {...field} rows={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditChecklists.${index}.lastUpdate`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAuditChecklist(checklist.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Équipe d'audit */}
        <TabsContent value="audit-team" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Équipe d'audit</h3>
            <Button type="button" onClick={addAuditTeamMember} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un membre
            </Button>
          </div>

          {auditTeam.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucun membre d'équipe défini. Ajoutez-en un en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Nom et Prénom</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Rôle/Fonction</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Qualification (ISO 27001)</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Certifié par / CISA</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Observations</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTeam.map((member: any, index: number) => (
                    <tr key={member.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTeam.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Jean Dupont" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTeam.${index}.role`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Chef d'équipe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTeam.${index}.qualification`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Auditeur certifié ISO 27001" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTeam.${index}.certifiedBy`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: ISACA" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`auditTeam.${index}.observationsPro`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Textarea placeholder="Observations..." {...field} rows={2} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAuditTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Équipe côté organisme */}
        <TabsContent value="organization-team" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Équipe du côté de l'organisme audité</h3>
            <Button type="button" onClick={addOrganizationTeamMember} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un membre
            </Button>
          </div>

          {organizationTeam.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucun membre d'équipe défini. Ajoutez-en un en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Nom Prénom</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Poste/Grade</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Fonction</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizationTeam.map((member: any, index: number) => (
                    <tr key={member.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`organizationTeam.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Pierre Martin" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`organizationTeam.${index}.position`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Chef de projet" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`organizationTeam.${index}.function`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Ex: Responsable sécurité" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrganizationTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Planning d'exécution */}
        <TabsContent value="planning" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Planning d'exécution de la mission d'audit</h3>
            <Button type="button" onClick={addMissionPlanningTask} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Ajouter une tâche
            </Button>
          </div>

          {missionPlanning.length === 0 ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              Aucune tâche définie. Ajoutez-en une en cliquant sur le bouton ci-dessus.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Phase</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Tâche de la phase</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Date de début</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Date de fin</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Période</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">J/H</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Nb intervenants</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {missionPlanning.map((task: any, index: number) => (
                    <tr key={task.id}>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.phase`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Phase" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {auditPhases.map((phase) => (
                                    <SelectItem key={phase.value} value={phase.value}>{phase.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.taskDescription`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input placeholder="Description de la tâche" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.period`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.status`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Statut" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {taskStatusOptions.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.manDays`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <FormField
                          control={form.control}
                          name={`missionPlanning.${index}.peopleInvolved`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm border border-secondary-200">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMissionPlanningTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}