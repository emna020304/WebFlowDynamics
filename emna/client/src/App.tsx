import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard";
import MissionForm from "@/pages/mission-form";
import MissionList from "@/pages/mission-list";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import RiskAppreciationPage from "@/pages/risk-appreciation";
import { ThemeProvider } from "@/components/ui/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/missions" component={MissionList} />
      <Route path="/missions/new" component={() => <MissionForm />} />
      <Route path="/missions/:id" component={({ params }) => <MissionForm id={params.id} />} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route path="/risques" component={RiskAppreciationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="audit-mission-theme">
        <TooltipProvider>
          <Toaster />
          <DashboardLayout>
            <Router />
          </DashboardLayout>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
