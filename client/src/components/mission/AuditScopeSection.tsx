import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formSections } from "@/lib/utils/form-sections";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  PlusCircle, 
  Trash2, 
  MapPin, 
  AlertCircle, 
  Database, 
  Laptop, 
  Network, 
  Server
} from "lucide-react";

interface AuditScopeSectionProps {
  form: any;
}

export function AuditScopeSection({ form }: AuditScopeSectionProps) {
  const isCompleted = formSections[3].isCompleted(form.getValues());
  
  // Tabs management
  const [activeTab, setActiveTab] = useState("geographicPerimeter");
  
  // Geographic perimeter functions
  const addGeographicSite = () => {
    const currentSites = form.getValues("geographicPerimeter") || [];
    const newId = currentSites.length > 0 
      ? Math.max(...currentSites.map((s: any) => s.id)) + 1 
      : 1;
    
    form.setValue("geographicPerimeter", [
      ...currentSites,
      {
        id: newId,
        site: "",
        structure: "",
        location: ""
      }
    ]);
  };
  
  const removeGeographicSite = (siteId: number) => {
    const currentSites = form.getValues("geographicPerimeter") || [];
    form.setValue(
      "geographicPerimeter",
      currentSites.filter((s: any) => s.id !== siteId)
    );
  };
  
  // Application functions
  const addApplication = () => {
    const currentApps = form.getValues("applications") || [];
    const newId = currentApps.length > 0 
      ? Math.max(...currentApps.map((a: any) => a.id)) + 1 
      : 1;
    
    form.setValue("applications", [
      ...currentApps,
      {
        id: newId,
        name: "",
        modules: "",
        description: "",
        environment: "",
        developedBy: "",
        ipAddresses: "",
        userCount: 0
      }
    ]);
  };
  
  const removeApplication = (appId: number) => {
    const currentApps = form.getValues("applications") || [];
    form.setValue(
      "applications",
      currentApps.filter((a: any) => a.id !== appId)
    );
  };
  
  // Network infrastructure functions
  const addNetworkDevice = () => {
    const currentDevices = form.getValues("networkInfrastructure") || [];
    const newId = currentDevices.length > 0 
      ? Math.max(...currentDevices.map((d: any) => d.id)) + 1 
      : 1;
    
    form.setValue("networkInfrastructure", [
      ...currentDevices,
      {
        id: newId,
        type: "",
        brand: "",
        model: "",
        quantity: 1,
        managedBy: "",
        observations: "",
        inAuditPerimeter: true,
        exclusionJustification: ""
      }
    ]);
  };
  
  const removeNetworkDevice = (deviceId: number) => {
    const currentDevices = form.getValues("networkInfrastructure") || [];
    form.setValue(
      "networkInfrastructure",
      currentDevices.filter((d: any) => d.id !== deviceId)
    );
  };
  
  // Workstation functions
  const addWorkstation = () => {
    const currentWorkstations = form.getValues("workstations") || [];
    const newId = currentWorkstations.length > 0 
      ? Math.max(...currentWorkstations.map((w: any) => w.id)) + 1 
      : 1;
    
    form.setValue("workstations", [
      ...currentWorkstations,
      {
        id: newId,
        system: "",
        count: 0,
        inAuditPerimeter: true,
        exclusionJustification: ""
      }
    ]);
  };
  
  const removeWorkstation = (workstationId: number) => {
    const currentWorkstations = form.getValues("workstations") || [];
    form.setValue(
      "workstations",
      currentWorkstations.filter((w: any) => w.id !== workstationId)
    );
  };
  
  // Server functions
  const addServer = () => {
    const currentServers = form.getValues("servers") || [];
    const newId = currentServers.length > 0 
      ? Math.max(...currentServers.map((s: any) => s.id)) + 1 
      : 1;
    
    form.setValue("servers", [
      ...currentServers,
      {
        id: newId,
        name: "",
        ipAddress: "",
        type: "",
        system: "",
        role: "",
        inAuditPerimeter: true,
        exclusionJustification: ""
      }
    ]);
  };
  
  const removeServer = (serverId: number) => {
    const currentServers = form.getValues("servers") || [];
    form.setValue(
      "servers",
      currentServers.filter((s: any) => s.id !== serverId)
    );
  };
  
  // Watchers
  const geographicPerimeter = form.watch("geographicPerimeter") || [];
  const applications = form.watch("applications") || [];
  const networkInfrastructure = form.watch("networkInfrastructure") || [];
  const workstations = form.watch("workstations") || [];
  const servers = form.watch("servers") || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Champ d'audit</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <Tabs 
        defaultValue="geographicPerimeter" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="geographicPerimeter" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Périmètre Géographique</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Impacts</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <span>Réseau et Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="workstations" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span>Postes de Travail</span>
          </TabsTrigger>
          <TabsTrigger value="servers" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Serveurs</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Périmètre Géographique */}
        <TabsContent value="geographicPerimeter">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Périmètre Géographique</CardTitle>
                <CardDescription>Sites et localisations concernés par l'audit</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addGeographicSite}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un site
              </Button>
            </CardHeader>
            <CardContent>
              {geographicPerimeter.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun site défini. Cliquez sur "Ajouter un site" pour commencer.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Structure</TableHead>
                      <TableHead>Lieu d'implantation</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geographicPerimeter.map((site: any, index: number) => (
                      <TableRow key={site.id}>
                        <TableCell className="font-medium">{site.id}</TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`geographicPerimeter.${index}.site`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input {...field} placeholder="Ex: Siège Social" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`geographicPerimeter.${index}.structure`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input {...field} placeholder="Ex: Filiale 1 - RH/Gestion" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`geographicPerimeter.${index}.location`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input {...field} placeholder="Ex: Paris" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGeographicSite(site.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Impacts et complexité */}
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Impact sur les opérations et complexité de l'infrastructure</CardTitle>
              <CardDescription>Sensibilité et complexité du système d'information audité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="operationsImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact sur les opérations</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: Sites ayant un rôle critique dans les processus métiers"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sensitiveData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Données sensibles traitées</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: Sites traitant des informations confidentielles"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="infrastructureComplexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexité d'infrastructure</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: Sites ayant des infrastructures IT complexes"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="samplingCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Critères d'échantillonnage</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ex: Les critères d'échantillonnage doivent être confirmés et discutés entre l'organisme audité et l'auditeur"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      NOTE: Les critères d'échantillonnage doivent être confirmés et discutés entre l'organisme audité et l'auditeur
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="systemsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description des Systèmes d'Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Description détaillée des systèmes d'information de l'organisation"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Applications */}
        <TabsContent value="applications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tableau des Applications</CardTitle>
                <CardDescription>Applications dans le périmètre d'audit</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addApplication}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter une application
              </Button>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucune application définie. Cliquez sur "Ajouter une application" pour commencer.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Nom / Identification</TableHead>
                        <TableHead>Modules</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Environnement</TableHead>
                        <TableHead>Développé par / Année</TableHead>
                        <TableHead>Adresses IP</TableHead>
                        <TableHead>Nb Utilisateurs</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app: any, index: number) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.id}</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Nom de l'application" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.modules`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Module 1" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Description de l'application" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.environment`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Environnement A" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.developedBy`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Développé par X (2020)" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.ipAddresses`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: 192.168.1.10, 192.168.1.11" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`applications.${index}.userCount`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      value={field.value || ''}
                                      onChange={event => field.onChange(
                                        event.target.value === '' ? '' : Number(event.target.value)
                                      )}
                                      placeholder="Ex: 100" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeApplication(app.id)}
                              className="h-8 w-8 p-0 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Infrastructure réseau et sécurité */}
        <TabsContent value="network">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tableau de l'Infrastructure Réseau et Sécurité</CardTitle>
                <CardDescription>Équipements réseau et sécurité dans le périmètre d'audit</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addNetworkDevice}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un équipement
              </Button>
            </CardHeader>
            <CardContent>
              {networkInfrastructure.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun équipement défini. Cliquez sur "Ajouter un équipement" pour commencer.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Marque</TableHead>
                        <TableHead>Modèle</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Administré par</TableHead>
                        <TableHead>Observations</TableHead>
                        <TableHead>Inclus au périmètre</TableHead>
                        <TableHead>Justification d'exclusion</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {networkInfrastructure.map((device: any, index: number) => (
                        <TableRow key={device.id} className={!device.inAuditPerimeter ? "bg-red-50" : ""}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.type`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Firewall" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.brand`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Cisco" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.model`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: ASA 5500" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      value={field.value || ''}
                                      onChange={event => field.onChange(
                                        event.target.value === '' ? '' : Number(event.target.value)
                                      )}
                                      placeholder="Ex: 2" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.managedBy`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Administrateur A" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.observations`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Observations" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.inAuditPerimeter`}
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-center space-x-2 mb-0">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`networkInfrastructure.${index}.exclusionJustification`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      disabled={networkInfrastructure[index].inAuditPerimeter}
                                      placeholder="Justification si exclu" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNetworkDevice(device.id)}
                              className="h-8 w-8 p-0 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Postes de travail */}
        <TabsContent value="workstations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tableau des Postes de Travail</CardTitle>
                <CardDescription>Systèmes d'exploitation et postes de travail dans le périmètre d'audit</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addWorkstation}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un type de poste
              </Button>
            </CardHeader>
            <CardContent>
              {workstations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun poste de travail défini. Cliquez sur "Ajouter un type de poste" pour commencer.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Système d'exploitation</TableHead>
                      <TableHead>Nombre de postes</TableHead>
                      <TableHead>Inclus au périmètre d'audit</TableHead>
                      <TableHead>Justification d'exclusion</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workstations.map((workstation: any, index: number) => (
                      <TableRow key={workstation.id} className={!workstation.inAuditPerimeter ? "bg-red-50" : ""}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`workstations.${index}.system`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input {...field} placeholder="Ex: Windows 10" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`workstations.${index}.count`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    value={field.value || ''}
                                    onChange={event => field.onChange(
                                      event.target.value === '' ? '' : Number(event.target.value)
                                    )}
                                    placeholder="Ex: 50" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`workstations.${index}.inAuditPerimeter`}
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center space-x-2 mb-0">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`workstations.${index}.exclusionJustification`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    disabled={workstations[index].inAuditPerimeter}
                                    placeholder="Justification si exclu du périmètre" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkstation(workstation.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Serveurs */}
        <TabsContent value="servers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tableau des Serveurs</CardTitle>
                <CardDescription>Serveurs dans le périmètre d'audit</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addServer}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Ajouter un serveur
              </Button>
            </CardHeader>
            <CardContent>
              {servers.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun serveur défini. Cliquez sur "Ajouter un serveur" pour commencer.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom du serveur</TableHead>
                        <TableHead>Adresse IP</TableHead>
                        <TableHead>Type (VM/HW)</TableHead>
                        <TableHead>Système d'exploitation</TableHead>
                        <TableHead>Rôle/Métier (ex: BDD)</TableHead>
                        <TableHead>Inclus au périmètre</TableHead>
                        <TableHead>Justification d'exclusion</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servers.map((server: any, index: number) => (
                        <TableRow key={server.id} className={!server.inAuditPerimeter ? "bg-red-50" : ""}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Serveur Web A" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.ipAddress`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: 192.168.1.2" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.type`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: machine virtuelle" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.system`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Linux" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.role`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Serveur Web" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.inAuditPerimeter`}
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-center space-x-2 mb-0">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`servers.${index}.exclusionJustification`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      disabled={servers[index].inAuditPerimeter}
                                      placeholder="Justification si exclu" 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeServer(server.id)}
                              className="h-8 w-8 p-0 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}