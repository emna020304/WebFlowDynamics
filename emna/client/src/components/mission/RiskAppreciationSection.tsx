import React, { useState } from "react";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, Grid, TextField, IconButton, Tooltip, Paper } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';

const riskLevels = [
  { label: "Négligeable", color: "#92D050", text: "#222" },
  { label: "Mineur", color: "#FFFF00", text: "#222" },
  { label: "Moyen", color: "#FFC000", text: "#222" },
  { label: "Élevé", color: "#FF0000", text: "#fff" },
  { label: "Critique", color: "#800000", text: "#fff" },
];

const probabilityRows = [
  ["1", "Très complexe : Utilisateur avec capacités IT illimitées", "Pratiquement impossible", "Non probable", "Pas de motivation"],
  ["2", "Complexe : Utilisateur avec capacités IT importantes", "Difficile", "Peu probable : Pourrait se produire rarement", "Peu de motivation"],
  ["3", "Moyennement complexe : Utilisateur avec capacités IT moyennes", "Moyennement facile", "Moyennement Probable : Pourrait se produire une fois par an", "Motivation possible"],
  ["4", "Facile : Utilisateur avec faibles capacités IT", "Facile", "Probable : Pourrait se produire plus qu'une fois par année (2 à 3 fois par an)", "Forte motivation"],
  ["5", "Très Facile : Utilisateur avec aucune capacité IT", "Très facile", "Très probable (plus que 3 fois par an)", "Très forte motivation"],
];

const impactRows = [
  ["1", "Pas d'impact politique/Environnemental", "Aucun impact", "Aucun effet sur le personnel", "Aucun impact", "Interruptions limitées dans une BU", "Aucun impact", "Incident mineur"],
  ["2", "Faible impact politique/Environnemental", "Faible impact", "Effets Mineurs sur le personnel", "Plaintes occasionnelles", "1 Business Unit; interruptions limitées", "Dégradation mineure", "Panne courte durée"],
  ["3", "Impact significatif", "Non-respect de la réglementation", "Effets Significatifs", "Nuisance Significative en interne", "2 business units; interruptions modérées", "Dégradation significative", "Incident multi-services"],
  ["4", "Fermeture temporaire", "Infraction majeure", "Effets graves", "Nuisance Grave au niveau national", "3 business units; interruptions importantes", "Dégradation grave", "Incident majeur"],
  ["5", "Dissolution de l'instance", "Sanction judiciaire", "Effets extrêmement graves", "Perte de confiance internationale", "Toute l'instance; arrêt complet", "Système inutilisable", "Catastrophe"],
];

const matrixColors = [
  [0,0,0,0,0],
  [0,1,1,2,2],
  [0,1,2,3,3],
  [1,2,3,3,4],
  [1,2,3,4,4],
];

const initialRisks = [
  { id: "R001", desc: "Perte de données sensibles", proba: 3, impact: 4 },
  { id: "R002", desc: "Attaque par déni de service", proba: 2, impact: 5 },
  { id: "R003", desc: "Accès non autorisé", proba: 4, impact: 3 },
];

export default function RiskAppreciationSection() {
  const [risks, setRisks] = useState(initialRisks);
  const [newRisk, setNewRisk] = useState({ desc: "", proba: 1, impact: 1 });

  const addRisk = () => {
    const id = `R${(risks.length + 1).toString().padStart(3, '0')}`;
    setRisks([...risks, { id, ...newRisk }]);
    setNewRisk({ desc: "", proba: 1, impact: 1 });
  };

  function getRiskLevel(score: number) {
    if (score <= 3) return 0;
    if (score <= 6) return 1;
    if (score <= 12) return 2;
    if (score <= 20) return 3;
    return 4;
  }

  return (
    <Box className="space-y-10" p={2}>
      {/* En-tête */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, background: '#1f497d', color: '#fff', borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} align="center">MATRICE D'APPRÉCIATION DES RISQUES DE SÉCURITÉ</Typography>
        <Typography variant="subtitle2" align="center" sx={{ color: '#e0e0e0', fontStyle: 'italic' }}>
          Dernière mise à jour: {new Date().toLocaleDateString()} | Version: 1.0
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={2}>
          <InfoOutlinedIcon />
          <Typography fontWeight={600}>LÉGENDE DES NIVEAUX DE RISQUE :</Typography>
          {riskLevels.map(lvl => (
            <Chip key={lvl.label} label={lvl.label} sx={{ bgcolor: lvl.color, color: lvl.text, fontWeight: 700, mx: 0.5 }} />
          ))}
        </Box>
      </Paper>

      {/* Table de probabilité */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#1f497d" mb={1}>PROBABILITÉ</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Niveau</TableCell>
              <TableCell>Exploitation de la vulnérabilité</TableCell>
              <TableCell>Facilité de découverte</TableCell>
              <TableCell>Probabilité de survenance</TableCell>
              <TableCell>Motivation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {probabilityRows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="caption" color="text.secondary" mt={1}>
          Valeur de la probabilité = MAX (Exploitation, Facilité, Survenance, Motivation)
        </Typography>
      </Paper>

      {/* Table d'impact */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#1f497d" mb={1}>IMPACT</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Niveau</TableCell>
              <TableCell>Politique/Environnemental</TableCell>
              <TableCell>Conformité réglementaire</TableCell>
              <TableCell>Ressources Humaines</TableCell>
              <TableCell>Image de Marque</TableCell>
              <TableCell>Opérationnel</TableCell>
              <TableCell>Technologique</TableCell>
              <TableCell>Exemple</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {impactRows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="caption" color="text.secondary" mt={1}>
          Valeur de l'impact = MAX(Politique, Conformité, RH, Image, Opérationnel, Technologique)
        </Typography>
      </Paper>

      {/* Matrice de risque */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#1f497d" mb={1}>MATRICE DE RISQUE (PROBABILITÉ x IMPACT)</Typography>
        <Table size="small" sx={{ maxWidth: 400, mx: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {[1,2,3,4,5].map(p => (
                <TableCell key={p} align="center">P{p}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1,2,3,4,5].map((i) => (
              <TableRow key={i}>
                <TableCell align="center" sx={{ fontWeight: 700 }}>I{i}</TableCell>
                {[1,2,3,4,5].map((j) => {
                  const score = i*j;
                  const lvl = getRiskLevel(score);
                  return (
                    <TableCell key={j} align="center" sx={{ bgcolor: riskLevels[lvl].color, color: riskLevels[lvl].text, fontWeight: 700 }}>{score}</TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight={600}>INTERPRÉTATION DES SCORES</Typography>
          <Table size="small" sx={{ maxWidth: 400 }}>
            <TableBody>
              {[
                ["1-3", "Négligeable", "Acceptable"],
                ["4-6", "Mineur", "Surveillance"],
                ["7-12", "Moyen", "Traitement recommandé"],
                ["13-20", "Élevé", "Traitement requis"],
                ["21-25", "Critique", "Traitement urgent"],
              ].map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Cartographie des risques */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <AssessmentIcon color="primary" />
          <Typography variant="h6" fontWeight={600} color="#1f497d">CARTOGRAPHIE DES RISQUES</Typography>
          <Tooltip title="Ajouter un risque">
            <IconButton color="primary" onClick={addRisk}><AddCircleOutlineIcon /></IconButton>
          </Tooltip>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID Risque</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Probabilité</TableCell>
              <TableCell>Impact</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Niveau</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {risks.map((r, i) => {
              const score = r.proba * r.impact;
              const lvl = getRiskLevel(score);
              return (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.desc}</TableCell>
                  <TableCell>{r.proba}</TableCell>
                  <TableCell>{r.impact}</TableCell>
                  <TableCell>{score}</TableCell>
                  <TableCell><Chip label={riskLevels[lvl].label} sx={{ bgcolor: riskLevels[lvl].color, color: riskLevels[lvl].text, fontWeight: 700 }} /></TableCell>
                </TableRow>
              );
            })}
            {/* Ligne d'ajout */}
            <TableRow>
              <TableCell>Auto</TableCell>
              <TableCell><TextField size="small" value={newRisk.desc} onChange={e => setNewRisk(n => ({ ...n, desc: e.target.value }))} placeholder="Description..." /></TableCell>
              <TableCell><TextField size="small" type="number" inputProps={{ min:1, max:5 }} value={newRisk.proba} onChange={e => setNewRisk(n => ({ ...n, proba: Math.max(1, Math.min(5, Number(e.target.value))) }))} /></TableCell>
              <TableCell><TextField size="small" type="number" inputProps={{ min:1, max:5 }} value={newRisk.impact} onChange={e => setNewRisk(n => ({ ...n, impact: Math.max(1, Math.min(5, Number(e.target.value))) }))} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell><Button size="small" onClick={addRisk} variant="contained">Ajouter</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Évaluation des contrôles */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#1f497d" mb={1}>ÉVALUATION DU DESIGN DES CONTRÔLES</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Score</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Exemple</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["5", "Très élevé", "Effectif", "Contrôles conçus et fonctionnent comme prévu", "MFA implémenté"],
              ["4", "Élevé", "Amélioration limitée", "Contrôles bien conçus avec quelques améliorations possibles", "Journalisation partielle"],
              ["3", "Modéré", "Amélioration modérée", "Contrôles clés en place mais améliorations importantes nécessaires", "Politique mot de passe de base"],
              ["2", "Faible", "Amélioration significative", "Contrôles limités en place; risque reste élevé", "Sauvegardes occasionnelles"],
              ["1", "Très faible", "Amélioration critique", "Contrôles inexistants ou lacunes majeures", "Aucun contrôle d'accès"],
            ].map((row, i) => (
              <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight={600}>CALCUL DU RISQUE RÉSIDUEL</Typography>
          <Table size="small" sx={{ maxWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Risque Initial</TableCell>
                <TableCell>Score Contrôle</TableCell>
                <TableCell>Risque Résiduel</TableCell>
                <TableCell>Réduction</TableCell>
                <TableCell>Niveau Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                [12, 3, "=(Initial*(1-(Score/5)))+(0.2*Initial)", "=Initial-Résiduel", "Négligeable"],
                [8, 4, "=(Initial*(1-(Score/5)))+(0.2*Initial)", "=Initial-Résiduel", "Mineur"],
                [20, 2, "=(Initial*(1-(Score/5)))+(0.2*Initial)", "=Initial-Résiduel", "Élevé"],
              ].map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Plan de traitement */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="#1f497d" mb={1}>PLAN DE TRAITEMENT DES RISQUES</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Risque</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Contrôles Existants</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Échéance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["R001", "Perte de données", "Élevé", "Sauvegardes hebdomadaires", "1. Implémenter chiffrement\n2. Sauvegardes quotidiennes", "DSI", "30/06/2024"],
              ["R002", "Attaque DOS", "Critique", "Firewall basique", "1. Déployer anti-DDoS\n2. Former équipe", "RSSI", "15/06/2024"],
              ["R003", "Accès non autorisé", "Moyen", "Authentification simple", "1. Mettre en place MFA\n2. Revue des accès", "Admin", "15/07/2024"],
            ].map((row, i) => (
              <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Tableau de bord synthétique */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <DashboardIcon color="primary" />
          <Typography variant="h6" fontWeight={600} color="#1f497d">TABLEAU DE BORD SYNTHÉTIQUE</Typography>
        </Box>
        <Table size="small" sx={{ maxWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Niveau de risque</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>%</TableCell>
              <TableCell>Traité</TableCell>
              <TableCell>En cours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["Critique", 2, "10%", 0, 1],
              ["Élevé", 5, "25%", 2, 2],
              ["Moyen", 8, "40%", 5, 2],
              ["Mineur", 4, "20%", 3, 1],
              ["Négligeable", 1, "5%", 1, 0],
            ].map((row, i) => (
              <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Placeholders pour graphiques camembert/barres */}
        <Box display="flex" gap={4} mt={2}>
          <Box flex={1} minHeight={180} bgcolor="#f3f4f6" borderRadius={2} display="flex" alignItems="center" justifyContent="center">
            <Typography color="text.secondary">[Graphique camembert ici]</Typography>
          </Box>
          <Box flex={1} minHeight={180} bgcolor="#f3f4f6" borderRadius={2} display="flex" alignItems="center" justifyContent="center">
            <Typography color="text.secondary">[Graphique à barres ici]</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Boutons d'action */}
      <Box display="flex" gap={2} mt={2} justifyContent="flex-end">
        <Button variant="contained" color="primary" startIcon={<RefreshIcon />}>Actualiser</Button>
        <Button variant="contained" color="success" startIcon={<PictureAsPdfIcon />}>Exporter PDF</Button>
      </Box>
    </Box>
  );
} 