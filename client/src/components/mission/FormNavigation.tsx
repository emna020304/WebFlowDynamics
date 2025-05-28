import { FormSection } from "@/lib/utils/form-sections";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormNavigationProps {
  sections: FormSection[];
  currentSection: number;
  onSectionClick: (sectionId: number) => void;
}

export function FormNavigation({ 
  sections, 
  currentSection, 
  onSectionClick 
}: FormNavigationProps) {
  return (
    <Card className="sticky top-24">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Sections du formulaire</h2>
        <nav>
          <ul className="space-y-1">
            {sections.map((section, index) => (
              <li key={index}>
                <button 
                  onClick={() => onSectionClick(index)} 
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm font-medium rounded-md flex items-center justify-between transition-all",
                    currentSection === index 
                      ? "bg-primary-100 text-primary-700 border-l-4 border-primary-500" 
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  )}
                >
                  <div className="flex items-center">
                    <span>{section.name}</span>
                  </div>
                  {section.isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Card>
  );
}
