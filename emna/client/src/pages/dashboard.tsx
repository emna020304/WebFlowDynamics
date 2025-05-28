import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, FileSpreadsheet, FileText, PieChart, Plus } from "lucide-react";
import { Mission } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell
} from "recharts";

export default function Dashboard() {
  const { data: missions, isLoading, error } = useQuery<Mission[]>({ 
    queryKey: ['/api/missions'] 
  });
  
  const recentMissions = missions?.slice(0, 5) || [];
  
  // Generate some simple stats
  const completedMissions = missions?.filter((m) => m.progress === 100).length || 0;
  const inProgressMissions = missions?.filter((m) => (m.progress ?? 0) > 0 && (m.progress ?? 0) < 100).length || 0;
  const totalMissions = missions?.length || 0;
  
  // Example data for charts
  const progressData = [
    { name: 'Mission 1', progress: 65 },
    { name: 'Mission 2', progress: 80 },
    { name: 'Mission 3', progress: 40 },
    { name: 'Mission 4', progress: 100 },
    { name: 'Mission 5', progress: 25 },
  ];
  
  const pieData = [
    { name: 'Complétées', value: completedMissions },
    { name: 'En cours', value: inProgressMissions },
    { name: 'Non commencées', value: totalMissions - (completedMissions + inProgressMissions) },
  ];
  
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Une erreur est survenue lors du chargement des données.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de vos missions d'audit</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/missions/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle mission
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{totalMissions}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions complétées</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{completedMissions}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {totalMissions > 0 
                  ? Math.round((completedMissions / totalMissions) * 100) 
                  : 0}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Progression des missions</CardTitle>
            <CardDescription>
              Aperçu de la progression de vos missions récentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={missions?.slice(0, 5).map(m => ({ name: m.title.substring(0, 20), progress: m.progress })) || progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#0ea5e9" activeDot={{ r: 8 }} name="Progression (%)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Statut des missions</CardTitle>
            <CardDescription>
              Distribution par statut de complétion
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RPieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Missions récentes</CardTitle>
          <CardDescription>
            Vos dernières missions d'audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentMissions.length > 0 ? (
            <div className="space-y-4">
              {recentMissions.map((mission) => (
                <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{mission.title}</h4>
                    <div className="text-sm text-muted-foreground">{mission.companyName}</div>
                    <div className="mt-2 w-full max-w-xs">
                      <Progress value={mission.progress} className="h-2" />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Progression: {mission.progress}%
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/missions/${mission.id}`} className="flex items-center gap-1">
                      Voir <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune mission récente.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/missions">
              Voir toutes les missions
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
