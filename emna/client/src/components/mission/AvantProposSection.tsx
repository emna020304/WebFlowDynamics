import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formSections } from "@/lib/utils/form-sections";

interface AvantProposSectionProps {
  form: any;
}

export function AvantProposSection({ form }: AvantProposSectionProps) {
  const isCompleted = formSections[0].isCompleted(form.getValues());
  
  // Version history management
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);
  
  const addVersion = () => {
    const currentVersions = form.getValues("versionHistory") || [];
    const today = new Date().toISOString().split('T')[0];
    
    form.setValue("versionHistory", [
      ...currentVersions, 
      { 
        version: `1.${currentVersions.length}`, 
        date: today, 
        author: "",
        changes: ""
      }
    ]);
  };
  
  const removeVersion = (index: number) => {
    const currentVersions = form.getValues("versionHistory") || [];
    form.setValue(
      "versionHistory", 
      currentVersions.filter((_: any, i: number) => i !== index)
    );
  };
  
  // Contacts management (auditeurs)
  const addAuditorContact = () => {
    const currentContacts = form.getValues("auditorContacts") || [];
    form.setValue("auditorContacts", [
      ...currentContacts, 
      { 
        name: "", 
        firstName: "", 
        title: "", 
        phone: "", 
        email: "" 
      }
    ]);
  };
  
  const removeAuditorContact = (index: number) => {
    const currentContacts = form.getValues("auditorContacts") || [];
    form.setValue(
      "auditorContacts", 
      currentContacts.filter((_: any, i: number) => i !== index)
    );
  };
  
  // Contacts management (audités)
  const addAuditedOrgContact = () => {
    const currentContacts = form.getValues("auditedOrgContacts") || [];
    form.setValue("auditedOrgContacts", [
      ...currentContacts, 
      { 
        name: "", 
        firstName: "", 
        title: "", 
        phone: "", 
        email: "" 
      }
    ]);
  };
  
  const removeAuditedOrgContact = (index: number) => {
    const currentContacts = form.getValues("auditedOrgContacts") || [];
    form.setValue(
      "auditedOrgContacts", 
      currentContacts.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Avant propos</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      {/* Confidentialité */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Confidentialité</h3>
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="confidentialityOptions.noDisclosure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Non divulgation</FormLabel>
                      <FormDescription>
                        Ce document ne peut être divulgué à des tiers sans autorisation écrite préalable.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidentialityOptions.noReproduction"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Non reproduction</FormLabel>
                      <FormDescription>
                        Ce document ne peut être reproduit en tout ou partie sans autorisation écrite préalable.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidentialityOptions.noPersonalUse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Non utilisation personnelle</FormLabel>
                      <FormDescription>
                        Le contenu de ce document ne peut être utilisé à des fins personnelles.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidentialityOptions.noCommercialUse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Non utilisation commerciale</FormLabel>
                      <FormDescription>
                        Le contenu de ce document ne peut être utilisé à des fins commerciales.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des versions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Historique des versions</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addVersion}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter une version
          </Button>
        </div>
        
        <div className="space-y-4">
          {form.watch("versionHistory")?.map((version: any, index: number) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Version {version.version}</Badge>
                    <span className="text-sm text-gray-500">{version.date}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeVersion(index)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`versionHistory.${index}.version`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`versionHistory.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`versionHistory.${index}.author`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auteur</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'auteur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`versionHistory.${index}.changes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modifications</FormLabel>
                        <FormControl>
                          <Input placeholder="Description des modifications" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contacts - Auditeurs */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Diffusion Côté Auditeur</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addAuditorContact}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter un contact
          </Button>
        </div>
        
        <div className="space-y-4">
          {form.watch("auditorContacts")?.map((contact: any, index: number) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {contact.name || contact.firstName ? 
                        `${contact.firstName || ''} ${contact.name || ''}`.trim() : 
                        `Contact ${index + 1}`
                      }
                    </span>
                    {contact.title && <Badge variant="outline">{contact.title}</Badge>}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeAuditorContact(index)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`auditorContacts.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditorContacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditorContacts.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre / Fonction</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Responsable audit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditorContacts.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditorContacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Contacts - Audités */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Diffusion Côté Audité</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addAuditedOrgContact}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter un contact
          </Button>
        </div>
        
        <div className="space-y-4">
          {form.watch("auditedOrgContacts")?.map((contact: any, index: number) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {contact.name || contact.firstName ? 
                        `${contact.firstName || ''} ${contact.name || ''}`.trim() : 
                        `Contact ${index + 1}`
                      }
                    </span>
                    {contact.title && <Badge variant="outline">{contact.title}</Badge>}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeAuditedOrgContact(index)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`auditedOrgContacts.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditedOrgContacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditedOrgContacts.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre / Fonction</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Directeur financier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditedOrgContacts.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`auditedOrgContacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}