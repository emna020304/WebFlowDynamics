import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formSections } from "@/lib/utils/form-sections";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MissionFrameworkSectionProps {
  form: any;
}

export function MissionFrameworkSection({ form }: MissionFrameworkSectionProps) {
  // Utilisez l'index 1 car c'est la 2ème section après Avant propos
  const isCompleted = formSections[1].isCompleted(form.getValues());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Cadre de la mission</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Cadre légal et réglementaire */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Cadre légal et réglementaire</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Cadre légal ou réglementaire de référence pour cette mission d'audit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <FormField
              control={form.control}
              name="legalFrameworkText"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Texte de référence</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Cette mission d'audit est réalisée conformément au décret-loi n°2023-17 du 11 mars 2023 et à l'arrêté du ministre des technologies de la communication du 12 septembre 2023." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="legalFrameworkReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence légale</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: décret-loi n°2023-17"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Type d'audit */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Type d'audit</h3>
            </div>
            
            <FormField
              control={form.control}
              name="auditType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Audit exhaustif"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Précisez le type d'audit (exhaustif, ciblé, suivi, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Objectif de la mission */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Objectif de la mission</h3>
            </div>
            
            <FormField
              control={form.control}
              name="missionObjective"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Vérification de la conformité avec ISO 27001, recommandations, et plan d'action pour l'amélioration."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Décrivez l'objectif principal de cette mission d'audit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Préparation à la certification ISO 27001 */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Préparation à la certification ISO 27001</h3>
            </div>
            
            <FormField
              control={form.control}
              name="isoPrepCertification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Préparation à la certification ISO 27001
                    </FormLabel>
                    <FormDescription>
                      Cette mission fait-elle partie de la préparation à la certification ISO 27001?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Standard(s) métier de référence */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Standard(s) métier de référence</h3>
            </div>
            
            <FormField
              control={form.control}
              name="isoStandards.name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Nom du standard</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: ISO 27001"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="isoStandards.securityStandards"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Norme de sécurité de l'information</FormLabel>
                      <FormDescription>
                        Standard relatif à la sécurité de l'information (ISO 27001, etc.)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isoStandards.specificStandards"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Standards métier spécifiques</FormLabel>
                      <FormDescription>
                        Standards spécifiques à l'organisation auditée
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Limites et contraintes de l'audit */}
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Limites et contraintes de l'audit</h3>
            </div>
            
            <FormField
              control={form.control}
              name="auditLimitations"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: L'échantillonnage est limité aux systèmes X et Y, les données ont changé depuis le dernier audit, certaines parties du système n'ont pas été auditées."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Décrivez les limites ou contraintes spécifiques rencontrées lors de l'audit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}