import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, FileSpreadsheet, FileText, Download } from "lucide-react";
import { Mission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();
  const [selectedMissionId, setSelectedMissionId] = useState<string>("");
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const { data: missions, isLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions']
  });

  const handleExport = async (format: "excel" | "pdf" | "word") => {
    if (!selectedMissionId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une mission pour générer un rapport.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGeneratingType(format);
      
      // Create the download URL based on format
      let endpoint = "";
      let fileType = "";
      let contentType = "";
      let fileName = "";
      
      switch (format) {
        case "excel":
          endpoint = `/api/missions/${selectedMissionId}/export/excel`;
          fileType = "xlsx";
          contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          fileName = `Mission_Audit_${selectedMissionId}.xlsx`;
          break;
        case "pdf":
          endpoint = `/api/missions/${selectedMissionId}/export/pdf`;
          fileType = "pdf";
          contentType = "application/pdf";
          fileName = `Rapport_Audit_${selectedMissionId}.pdf`;
          break;
        case "word":
          endpoint = `/api/missions/${selectedMissionId}/export/word`;
          fileType = "docx";
          contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          fileName = `Rapport_Audit_${selectedMissionId}.docx`;
          break;
      }
      
      // Fetch and trigger download
      const response = await fetch(endpoint, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la génération du fichier (${response.status})`);
      }
      
      // Get the blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast({
        title: "Rapport généré",
        description: `Le rapport au format ${format.toUpperCase()} a été généré avec succès.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la génération du rapport: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setGeneratingType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rapports</h1>
        <p className="text-muted-foreground">Générer et télécharger des rapports d'audit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport</CardTitle>
          <CardDescription>
            Sélectionnez une mission et le format souhaité pour générer un rapport.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mission d'audit</label>
              <Select value={selectedMissionId} onValueChange={setSelectedMissionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une mission" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Chargement...
                    </div>
                  ) : missions && missions.length > 0 ? (
                    missions.map((mission) => (
                      <SelectItem key={mission.id} value={mission.id.toString()}>
                        {mission.title} - {mission.companyName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      Aucune mission disponible
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
                    Excel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Le fichier Excel contient désormais une seule feuille intitulée <b>Présentation de l'organisme</b>.
                    Elle regroupe toutes les informations importantes : présentation générale, cartographie des processus, exigences de sécurité pour chaque processus, et la matrice CIA détaillée.
                    Idéal pour l'analyse et le traitement des données.
                  </p>
                  <Button 
                    onClick={() => handleExport("excel")} 
                    disabled={!selectedMissionId || Boolean(generatingType)}
                    className="w-full"
                  >
                    {generatingType === "excel" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Excel
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-red-600" />
                    PDF
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Génère un rapport PDF formaté et professionnel contenant toutes les données d'audit.
                  </p>
                  <Button 
                    onClick={() => handleExport("pdf")} 
                    disabled={!selectedMissionId || Boolean(generatingType)}
                    className="w-full"
                  >
                    {generatingType === "pdf" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Word
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Exporte le rapport d'audit dans un document Word (.docx) que vous pouvez éditer.
                  </p>
                  <Button 
                    onClick={() => handleExport("word")} 
                    disabled={!selectedMissionId || Boolean(generatingType)}
                    className="w-full"
                  >
                    {generatingType === "word" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Word
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions d'utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold mb-1">Excel</h3>
              <p className="text-sm text-muted-foreground">
                Le fichier Excel contient plusieurs feuilles organisées par section : informations générales,
                analyse financière, évaluation des risques, conformité et recommandations. Idéal pour l'analyse et
                le traitement des données.
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-1">PDF</h3>
              <p className="text-sm text-muted-foreground">
                Le rapport PDF est formaté pour l'impression et le partage avec les clients. Il inclut une page de garde,
                des en-têtes et pieds de page professionnels, et une mise en page optimisée pour la lisibilité.
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-1">Word</h3>
              <p className="text-sm text-muted-foreground">
                Le document Word vous permet de personnaliser et modifier le rapport avant de le partager.
                Vous pouvez ajuster la mise en forme, ajouter des commentaires, et adapter le contenu selon vos besoins.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
