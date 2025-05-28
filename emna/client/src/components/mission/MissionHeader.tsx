import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Save } from "lucide-react";
import { ExportMenu } from "./ExportMenu";
import { Loader2 } from "lucide-react";

interface MissionHeaderProps {
  isEdit: boolean;
  title: string;
  companyName: string;
  progress: number;
  status: string;
  saving: boolean;
  onSave: () => void;
  missionId?: number;
}

export function MissionHeader({
  isEdit,
  title,
  companyName,
  progress,
  status,
  saving,
  onSave,
  missionId
}: MissionHeaderProps) {
  const [createdDate] = useState(new Date());
  
  const getStatusBadge = () => {
    if (progress === 100) return <Badge className="bg-green-100 text-green-800">Complété</Badge>;
    if (progress > 0) return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
    return <Badge className="bg-secondary-100 text-secondary-800">Brouillon</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {title || "Nouvelle mission d'audit"}
            {companyName && ` - ${companyName}`}
          </h1>
          <p className="mt-1 text-secondary-500">
            {isEdit 
              ? `Créée le ${createdDate.toLocaleDateString()} • Dernière modification ${formatDistanceToNow(new Date(), { addSuffix: true, locale: fr })}`
              : "Nouvelle mission d'audit"
            }
          </p>
          <div className="mt-2 flex items-center">
            {getStatusBadge()}
            <span className="ml-4 text-sm text-secondary-500">Progression: {progress}%</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onSave}
            disabled={saving}
            className="flex items-center justify-center"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Sauvegarder
          </Button>
          
          {isEdit && missionId && (
            <ExportMenu missionId={missionId} />
          )}
        </div>
      </div>
    </Card>
  );
}
