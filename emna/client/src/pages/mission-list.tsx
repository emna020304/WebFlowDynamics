import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mission } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, FileSpreadsheet, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MissionList() {
  const { toast } = useToast();
  const [deletingMissionId, setDeletingMissionId] = useState<number | null>(null);

  const { data: missions, isLoading, error } = useQuery<Mission[]>({
    queryKey: ['/api/missions']
  });

  const handleDeleteMission = async (id: number) => {
    try {
      setDeletingMissionId(id);
      await apiRequest("DELETE", `/api/missions/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      toast({
        title: "Mission supprimée",
        description: "La mission d'audit a été supprimée avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeletingMissionId(null);
    }
  };

  const getStatusBadge = (status: string, progress: number) => {
    if (progress === 100) return <Badge className="bg-green-100 text-green-800">Complété</Badge>;
    if (progress > 0) return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
    return <Badge className="bg-secondary-100 text-secondary-800">Brouillon</Badge>;
  };

  const columns: ColumnDef<Mission>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground">{row.original.companyName}</div>
        </div>
      ),
    },
    {
      accessorKey: "progress",
      header: "Progression",
      cell: ({ row }) => (
        <div className="w-full max-w-xs">
          <Progress value={row.getValue("progress")} className="h-2" />
          <span className="text-xs text-muted-foreground">{row.getValue("progress")}%</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => getStatusBadge(row.getValue("status"), row.original.progress ?? 0),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de création
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt ? new Date(row.original.createdAt) : new Date();
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: fr })}
            </div>
          </div>
        );
      },
      sortingFn: "datetime",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/missions/${row.original.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cette opération supprimera définitivement la mission
                  d'audit et toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDeleteMission(row.original.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deletingMissionId === row.original.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Une erreur est survenue lors du chargement des missions.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/missions'] })} className="mt-4">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Missions d'audit</h1>
          <p className="text-muted-foreground">Gérez vos missions d'audit</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/missions/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle mission
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les missions</CardTitle>
          <CardDescription>
            Liste de toutes vos missions d'audit. Vous pouvez filtrer, trier et accéder aux détails de chaque mission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={missions || []}
              searchColumn="title"
              searchPlaceholder="Rechercher par titre..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
