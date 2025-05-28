import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download, ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportMenuProps {
  missionId: number;
}

export function ExportMenu({ missionId }: ExportMenuProps) {
  const { toast } = useToast();
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const handleExport = async (format: "excel" | "pdf" | "word") => {
    try {
      setGeneratingType(format);
      
      // Create the download URL based on format
      let endpoint = "";
      let fileType = "";
      let contentType = "";
      let fileName = "";
      
      switch (format) {
        case "excel":
          endpoint = `/api/missions/${missionId}/export/excel`;
          fileType = "xlsx";
          contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          fileName = `Mission_Audit_${missionId}.xlsx`;
          break;
        case "pdf":
          endpoint = `/api/missions/${missionId}/export/pdf`;
          fileType = "pdf";
          contentType = "application/pdf";
          fileName = `Rapport_Audit_${missionId}.pdf`;
          break;
        case "word":
          endpoint = `/api/missions/${missionId}/export/word`;
          fileType = "docx";
          contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          fileName = `Rapport_Audit_${missionId}.docx`;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center justify-center">
          {generatingType ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Exporter
              <ChevronDown className="h-5 w-5 ml-1" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleExport("excel")} 
          disabled={Boolean(generatingType)}
        >
          <div className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
            Exporter vers Excel
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("pdf")} 
          disabled={Boolean(generatingType)}
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-red-600" />
            Générer un PDF
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport("word")} 
          disabled={Boolean(generatingType)}
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Générer un Word
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
