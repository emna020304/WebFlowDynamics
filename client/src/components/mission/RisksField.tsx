import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { riskTypes, probabilityOptions, impactOptions } from "@/lib/utils/form-sections";

interface RisksFieldProps {
  form: any;
}

export function RisksField({ form }: RisksFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "risks",
  });

  return (
    <div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-secondary-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium text-sm">Risque {index + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-8 text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <FormField
                  control={form.control}
                  name={`risks.${index}.riskType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de risque</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type de risque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {riskTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-4">
                <FormField
                  control={form.control}
                  name={`risks.${index}.probability`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Probabilité</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une probabilité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {probabilityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-4">
                <FormField
                  control={form.control}
                  name={`risks.${index}.impact`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un impact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {impactOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-12">
                <FormField
                  control={form.control}
                  name={`risks.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description du risque</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Décrivez le risque en détail..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-12">
                <FormField
                  control={form.control}
                  name={`risks.${index}.mitigation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesures de mitigation recommandées</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Décrivez les mesures à prendre pour réduire ce risque..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            riskType: "",
            probability: "",
            impact: "",
            description: "",
            mitigation: "",
          })
        }
        className="mt-4 text-sm text-primary-600 flex items-center hover:text-primary-800"
      >
        <Plus className="h-4 w-4 mr-1" />
        Ajouter un risque
      </Button>
    </div>
  );
}
