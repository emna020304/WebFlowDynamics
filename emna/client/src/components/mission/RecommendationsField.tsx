import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { priorityOptions } from "@/lib/utils/form-sections";
import { cn } from "@/lib/utils";

interface RecommendationsFieldProps {
  form: any;
}

export function RecommendationsField({ form }: RecommendationsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recommendations",
  });

  // Get priority color class based on value
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700";
      case "medium":
        return "bg-yellow-50 text-yellow-700";
      case "low":
        return "bg-green-50 text-green-700";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-secondary-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <h4 className="font-medium text-sm">Recommandation {index + 1}</h4>
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
              <div className="md:col-span-9">
                <FormField
                  control={form.control}
                  name={`recommendations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommandation</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Décrivez la recommandation..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name={`recommendations.${index}.priority`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorité</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(
                            getPriorityClass(field.value)
                          )}>
                            <SelectValue placeholder="Sélectionnez une priorité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  control={form.control}
                  name={`recommendations.${index}.responsible`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsable</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nom du responsable..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  control={form.control}
                  name={`recommendations.${index}.deadline`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Échéance</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
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
            description: "",
            priority: "medium",
            responsible: "",
            deadline: "",
          })
        }
        className="mt-4 text-sm text-primary-600 flex items-center hover:text-primary-800"
      >
        <Plus className="h-4 w-4 mr-1" />
        Ajouter une recommandation
      </Button>
    </div>
  );
}
