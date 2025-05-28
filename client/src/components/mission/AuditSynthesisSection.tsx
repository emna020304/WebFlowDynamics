import React, { useState, useMemo } from "react";
import { securityControlsData, SecurityControl } from "./securityControlsData";
// @ts-ignore: Si le type n'est pas trouvé, ignorer pour react-select
import Select from "react-select";
import { Dialog, DialogTitle, DialogContent, IconButton, Checkbox, TextField, Chip, Box, Card, CardContent, Typography, Grid, Button, Tabs, Tab, Tooltip, TableSortLabel } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import MemoryIcon from '@mui/icons-material/Memory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSpring, animated } from '@react-spring/web';

// Couleurs pour la criticité
const criticityColors = {
  Haute: "bg-red-200 text-red-800",
  Moyenne: "bg-orange-200 text-orange-800",
  Faible: "bg-green-200 text-green-800",
};

const maturityOptions = ["0", "1", "2", "3", "4", "5", "N/A"];

// Ajout des types explicites pour les paramètres et les états
interface CriteriaRow { ref: string; desc: string; }
interface ResponsibilityRow { resp: string; limit: string; }
interface TestRow { type: string; nature: string; objectif: string; }
interface ActionRow { projet: string; action: string; criticite: "Haute" | "Moyenne" | "Faible"; charge: string; chargee: string; taux: string; eval: string; }
interface PracticeRow { bonne: string; defaillance: string; }
interface MaturityRow { domaine: string; sousDomaine: string; reference: string; enonce: string; valeur: string; commentaire: string; }
interface IndicatorRow { indicateur: string; y2023: string; y2024: string; variation: string; }

const domainTabs = [
  {
    label: "Organisationnelles",
    full: "Mesures de sécurité organisationnelles (37)",
    icon: <SecurityIcon fontSize="small" />,
    description: "Gouvernance, gestion des actifs, conformité..."
  },
  {
    label: "Personnel",
    full: "Mesures de sécurité applicables au personnel (8)",
    icon: <PeopleIcon fontSize="small" />,
    description: "Ressources humaines, sensibilisation, confidentialité..."
  },
  {
    label: "Physiques",
    full: "Mesures de sécurité physique (14)",
    icon: <HomeWorkIcon fontSize="small" />,
    description: "Sécurité des locaux, matériel, accès physiques..."
  },
  {
    label: "Technologiques",
    full: "Mesures de sécurité technologiques (34)",
    icon: <MemoryIcon fontSize="small" />,
    description: "Réseaux, applications, systèmes, cryptographie..."
  },
];

const probabilityOptions = [
  "Très faible", "Faible", "Moyenne", "Élevée", "Très élevée"
];

export function AuditSynthesisSection({ form }: { form: any }) {
  // Tableau 1 : Critères/Référentiels
  const [criteria, setCriteria] = useState<CriteriaRow[]>([{ ref: "", desc: "" }]);
  // Tableau 2 : Responsabilité et limites
  const [responsibility, setResponsibility] = useState<ResponsibilityRow[]>([{ resp: "", limit: "" }]);
  // Tableau 3 : Types de tests
  const [tests, setTests] = useState<TestRow[]>([{ type: "", nature: "", objectif: "" }]);
  // Tableau 4 : Plan d'action
  const [actions, setActions] = useState<ActionRow[]>([
    { projet: "", action: "", criticite: "Moyenne", charge: "", chargee: "", taux: "", eval: "" },
  ]);
  // Tableau 5 : Présentation de l'évolution des indicateurs de sécurité
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<string[]>([currentYear.toString(), (currentYear - 1).toString()].sort());
  const initialValues: Record<string, string> = {};
  years.forEach(y => { initialValues[y] = ""; });
  const [indicators, setIndicators] = useState<any[]>([
    { indicateur: "", values: { ...initialValues } },
  ]);
  const [yearToAdd, setYearToAdd] = useState<string>("");

  // Tableau 6 : Bonnes pratiques et défaillances
  const [practices, setPractices] = useState<PracticeRow[]>([{ bonne: "", defaillance: "" }]);
  // Tableau 7 : État de maturité
  const [maturity, setMaturity] = useState<MaturityRow[]>([
    { domaine: "", sousDomaine: "", reference: "", enonce: "", valeur: "N/A", commentaire: "" },
  ]);

  // Pour la sélection des domaines
  const allDomaines = Array.from(new Set(securityControlsData.map(c => c.domaine)));
  const [activeDomaine, setActiveDomaine] = useState<string>(allDomaines[0]);
  const [search, setSearch] = useState<string>("");
  const [selectedRefs, setSelectedRefs] = useState<string[]>([]);
  const [openDetail, setOpenDetail] = useState<SecurityControl | null>(null);
  const [maturityValues, setMaturityValues] = useState<Record<string, { valeur: string; commentaire: string }>>({});
  const handleValeurChange = (ref: string, valeur: string) => {
    setMaturityValues(prev => ({ ...prev, [ref]: { ...prev[ref], valeur } }));
  };
  const handleCommentChange = (ref: string, commentaire: string) => {
    setMaturityValues(prev => ({ ...prev, [ref]: { ...prev[ref], commentaire } }));
  };
  const controlsForActiveDomaine = useMemo(() =>
    securityControlsData.filter(c => c.domaine === activeDomaine && (
      c.nomControle.toLowerCase().includes(search.toLowerCase()) ||
      c.reference.toLowerCase().includes(search.toLowerCase()) ||
      (c.objectif || "").toLowerCase().includes(search.toLowerCase())
    )), [activeDomaine, search]);

  // Fonctions d'ajout de ligne
  const addRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, row: T) => setter((prev) => [...prev, row]);

  const getAvailableYears = () => {
    const allYears = [];
    for (let y = 1950; y <= currentYear; y++) {
      if (!years.includes(y.toString())) {
        allYears.push(y.toString());
      }
    }
    return allYears;
  };

  const addYear = () => {
    if (yearToAdd && !years.includes(yearToAdd) && parseInt(yearToAdd) <= currentYear) {
      const newYears = [...years, yearToAdd].sort();
      setYears(newYears);
      setIndicators(indicators.map(row => ({ ...row, values: { ...row.values, [yearToAdd]: "" } })));
      setYearToAdd("");
    }
  };
  const removeYear = (year: string) => {
    if (years.length <= 2) return;
    setYears(years.filter(y => y !== year));
    setIndicators(indicators.map(row => {
      const newValues = { ...row.values };
      delete newValues[year];
      return { ...row, values: newValues };
    }));
  };
  const addIndicatorRow = () => {
    const values: Record<string, string> = {};
    years.forEach(y => { values[y] = ""; });
    setIndicators([...indicators, { indicateur: "", values }]);
  };
  const handleIndicatorChange = (i: number, year: string, value: string) => {
    const c = [...indicators];
    c[i].values[year] = value.replace(/[^\d.,-]/g, ""); // Only allow numbers, dot, comma, minus
    setIndicators(c);
  };
  const handleIndicateurNameChange = (i: number, value: string) => {
    const c = [...indicators];
    c[i].indicateur = value;
    setIndicators(c);
  };
  const removeIndicatorRow = (i: number) => {
    setIndicators(indicators.filter((_, idx) => idx !== i));
  };
  const getVariation = (row: any) => {
    const first = parseFloat(row.values[years[0]].replace(",", "."));
    const last = parseFloat(row.values[years[years.length - 1]].replace(",", "."));
    if (isNaN(first) || isNaN(last) || first === 0) return "";
    const variation = ((last - first) / first) * 100;
    return `${variation.toFixed(2)} %`;
  };

  const handleSelect = (ref: string) => {
    setSelectedRefs(prev => prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref]);
  };

  // === REFACTORED MATURITY TABLE ===
  const valueColors: Record<string, string> = {
    '0': 'bg-red-800 text-white',
    '1': 'bg-red-500 text-white',
    '2': 'bg-orange-400 text-white',
    '3': 'bg-yellow-300 text-gray-900',
    '4': 'bg-green-300 text-gray-900',
    '5': 'bg-green-700 text-white',
    'N/A': 'bg-gray-400 text-white',
  };

  function getValueColor(value: string) {
    return valueColors[value] || '';
  }

  const [orderBy, setOrderBy] = useState<'reference'|'nomControle'|'categorieControle'|'valeur'>('reference');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const sortedControls = useMemo(() => {
    const arr = [...controlsForActiveDomaine];
    arr.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (orderBy === 'valeur') {
        aVal = maturityValues[a.reference]?.valeur || '';
        bVal = maturityValues[b.reference]?.valeur || '';
      } else {
        aVal = (a as any)[orderBy] || '';
        bVal = (b as any)[orderBy] || '';
      }
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [controlsForActiveDomaine, orderBy, order, maturityValues]);

  const selectedCount = sortedControls.filter(ctrl => maturityValues[ctrl.reference]?.valeur).length;
  const avgMaturity = (() => {
    const vals = sortedControls.map(ctrl => parseInt(maturityValues[ctrl.reference]?.valeur)).filter(v => !isNaN(v));
    if (!vals.length) return 0;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  })();

  const springProps = useSpring({ opacity: 1, from: { opacity: 0 }, reset: true, config: { duration: 350 } });

  const [showVulnTable, setShowVulnTable] = useState(false);
  const [vulnData, setVulnData] = useState<Record<string, any>>({});
  const vulnControls = sortedControls.filter(ctrl => maturityValues[ctrl.reference]?.valeur === '0');

  function handleVulnFieldChange(ref: string, field: string, value: string) {
    setVulnData(prev => ({ ...prev, [ref]: { ...prev[ref], [field]: value } }));
  }

  // === VULNÉRABILITÉS GLOBALES ===
  const domainOrder = [
    "Mesures de sécurité organisationnelles (37)",
    "Mesures de sécurité applicables au personnel (8)",
    "Mesures de sécurité physique (14)",
    "Mesures de sécurité technologiques (34)"
  ];
  const allVulnControls = useMemo(() =>
    securityControlsData
      .filter(ctrl => maturityValues[ctrl.reference]?.valeur === '0')
      .sort((a, b) => {
        const da = domainOrder.indexOf(a.domaine);
        const db = domainOrder.indexOf(b.domaine);
        if (da !== db) return da - db;
        return a.reference.localeCompare(b.reference);
      })
  , [maturityValues]);

  return (
    <div className="space-y-10">
      {/* Tableau 1 */}
      <section>
        <h3 className="font-bold mb-2">Critères/Référentiels</h3>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Critère/Référentiel</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((row, i) => (
              <tr key={i}>
                <td><input className="w-full" value={row.ref} onChange={e => {
                  const c = [...criteria]; c[i].ref = e.target.value; setCriteria(c);
                }} /></td>
                <td><input className="w-full" value={row.desc} onChange={e => {
                  const c = [...criteria]; c[i].desc = e.target.value; setCriteria(c);
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="text-blue-600" onClick={() => addRow(setCriteria, { ref: "", desc: "" })}>+ Ajouter</button>
      </section>

      {/* Tableau 2 */}
      <section>
        <h3 className="font-bold mb-2">Responsabilité de l'Auditeur et Limites de l'Audit</h3>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Responsabilité de l'Auditeur</th>
              <th>Limites de l'Audit</th>
            </tr>
          </thead>
          <tbody>
            {responsibility.map((row, i) => (
              <tr key={i}>
                <td><input className="w-full" value={row.resp} onChange={e => {
                  const c = [...responsibility]; c[i].resp = e.target.value; setResponsibility(c);
                }} /></td>
                <td><input className="w-full" value={row.limit} onChange={e => {
                  const c = [...responsibility]; c[i].limit = e.target.value; setResponsibility(c);
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="text-blue-600" onClick={() => addRow(setResponsibility, { resp: "", limit: "" })}>+ Ajouter</button>
      </section>

      {/* Tableau 3 */}
      <section>
        <h3 className="font-bold mb-2">Types et Nature des Tests Réalisés</h3>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Type de test</th>
              <th>Nature du test</th>
              <th>Objectif</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((row, i) => (
              <tr key={i}>
                <td><input className="w-full" value={row.type} onChange={e => {
                  const c = [...tests]; c[i].type = e.target.value; setTests(c);
                }} /></td>
                <td><input className="w-full" value={row.nature} onChange={e => {
                  const c = [...tests]; c[i].nature = e.target.value; setTests(c);
                }} /></td>
                <td><input className="w-full" value={row.objectif} onChange={e => {
                  const c = [...tests]; c[i].objectif = e.target.value; setTests(c);
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="text-blue-600" onClick={() => addRow(setTests, { type: "", nature: "", objectif: "" })}>+ Ajouter</button>
      </section>

      {/* Tableau 4 */}
      <section>
        <h3 className="font-bold mb-2">Plan d'Action</h3>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Projet</th>
              <th>Action</th>
              <th>Criticité</th>
              <th>Chargé de l'action</th>
              <th>Charge (H/J)</th>
              <th>Taux de réalisation</th>
              <th>Évaluation</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((row, i) => (
              <tr key={i}>
                <td><input className="w-full" value={row.projet} onChange={e => {
                  const c = [...actions]; c[i].projet = e.target.value; setActions(c);
                }} /></td>
                <td><input className="w-full" value={row.action} onChange={e => {
                  const c = [...actions]; c[i].action = e.target.value; setActions(c);
                }} /></td>
                <td>
                  <select className={`w-full ${(criticityColors as Record<string, string>)[row.criticite] || ""}`} value={row.criticite} onChange={e => {
                    const c = [...actions]; c[i].criticite = e.target.value as ActionRow["criticite"]; setActions(c);
                  }}>
                    <option value="Haute">Haute</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Faible">Faible</option>
                  </select>
                </td>
                <td><input className="w-full" value={row.chargee} onChange={e => {
                  const c = [...actions]; c[i].chargee = e.target.value; setActions(c);
                }} /></td>
                <td><input className="w-full" value={row.charge} onChange={e => {
                  const c = [...actions]; c[i].charge = e.target.value; setActions(c);
                }} /></td>
                <td><input className="w-full" value={row.taux} onChange={e => {
                  const c = [...actions]; c[i].taux = e.target.value; setActions(c);
                }} /></td>
                <td><input className="w-full" value={row.eval} onChange={e => {
                  const c = [...actions]; c[i].eval = e.target.value; setActions(c);
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="text-blue-600" onClick={() => addRow(setActions, { projet: "", action: "", criticite: "Moyenne", charge: "", chargee: "", taux: "", eval: "" })}>+ Ajouter</button>
      </section>

      {/* Tableau 5 : Présentation de l'évolution des indicateurs de sécurité */}
      <section>
        <h3 className="font-bold mb-2">Présentation de l'évolution des indicateurs de sécurité</h3>
        <div className="flex gap-2 mb-2 flex-wrap items-center">
          {years.map((year, idx) => (
            <span key={year} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
              {year}
              {years.length > 2 && (
                <button type="button" className="ml-1 text-red-500" onClick={() => removeYear(year)} title="Supprimer l'année">×</button>
              )}
            </span>
          ))}
          <select
            className="border rounded px-2 py-1 mr-2"
            value={yearToAdd}
            onChange={e => setYearToAdd(e.target.value)}
          >
            <option value="">+ Ajouter une année</option>
            {getAvailableYears().map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            type="button"
            className="text-blue-600"
            onClick={addYear}
            disabled={!yearToAdd}
          >Ajouter</button>
        </div>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Indicateur de sécurité</th>
              {years.map(year => <th key={year}>{year} (%)</th>)}
              <th>Variation (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((row, i) => (
              <tr key={i}>
                <td><input className="w-full" value={row.indicateur} onChange={e => handleIndicateurNameChange(i, e.target.value)} /></td>
                {years.map(year => (
                  <td key={year}>
                    <input
                      className="w-full"
                      value={row.values[year] || ""}
                      onChange={e => handleIndicatorChange(i, year, e.target.value)}
                      placeholder="%"
                      type="number"
                      min="0"
                      max="100"
                    />
                  </td>
                ))}
                <td>{getVariation(row)}</td>
                <td><button type="button" className="text-red-500" onClick={() => removeIndicatorRow(i)}>Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="text-blue-600" onClick={addIndicatorRow}>+ Ajouter un indicateur</button>
      </section>

      {/* Tableau 6 : Synthèse des Bonnes Pratiques et Défaillances */}
      <section>
        <h3 className="font-bold mb-2">Synthèse des Bonnes Pratiques et Défaillances</h3>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Bonnes pratiques identifiées</th>
              <th>Défaillances enregistrées</th>
            </tr>
          </thead>
          <tbody>
            {practices.map((row, i) => (
              <tr key={i}>
                <td><input className="w-full" value={row.bonne} onChange={e => {
                  const c = [...practices]; c[i].bonne = e.target.value; setPractices(c);
                }} /></td>
                <td><input className="w-full" value={row.defaillance} onChange={e => {
                  const c = [...practices]; c[i].defaillance = e.target.value; setPractices(c);
                }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="text-blue-600" onClick={() => addRow(setPractices, { bonne: "", defaillance: "" })}>+ Ajouter</button>
      </section>

      {/* Tableau 7 : État de Maturité de la Sécurité du SI */}
      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChartIcon className="text-blue-600" /> État de Maturité de la Sécurité du SI
        </h3>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', background: '#fafbfc', borderRadius: 2, mb: 2, px: 1 }}>
          <Tabs
            value={allDomaines.indexOf(activeDomaine)}
            onChange={(_, idx) => setActiveDomaine(allDomaines[idx])}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Domaines de sécurité"
            sx={{ minHeight: 56 }}
            TabIndicatorProps={{ style: { height: 4, background: '#2563eb', borderRadius: 2 } }}
          >
            {domainTabs.map((tab, idx) => (
              <Tab
                key={tab.full}
                icon={tab.icon}
                iconPosition="start"
                label={<span className="font-semibold text-base">{tab.label}</span>}
                sx={{ minHeight: 56, alignItems: 'center', mx: 2, px: 3, borderRadius: 2, transition: 'background 0.2s', '&.Mui-selected': { background: '#e0e7ff', color: '#1e40af' } }}
              />
            ))}
          </Tabs>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 2, color: '#64748b', fontWeight: 500 }}>
            {domainTabs[allDomaines.indexOf(activeDomaine)]?.description}
          </Typography>
        </Box>
        <div>
          <Box mb={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              label="Rechercher un contrôle..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 320 }}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip title="Nombre de contrôles évalués">
                <Chip label={`Évalués : ${selectedCount}/${sortedControls.length}`} color="primary" />
              </Tooltip>
              <Tooltip title="Moyenne de maturité (hors N/A)">
                <Chip label={`Moyenne : ${avgMaturity}`} color="success" />
              </Tooltip>
            </Box>
          </Box>
          {/* Mini-graphique jauge (barre de progression) */}
          <Box mb={2} width={320}>
            <Typography variant="caption" color="textSecondary">Maturité globale</Typography>
            <Box height={12} borderRadius={6} bgcolor="#e5e7eb" overflow="hidden">
              <Box height={12} borderRadius={6} bgcolor="#22c55e" width={`${(Number(avgMaturity)/5)*100 || 0}%`} style={{ transition: 'width 0.5s' }} />
            </Box>
          </Box>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border rounded-lg bg-white text-sm sticky-header">
              <thead className="bg-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 border cursor-pointer" onClick={() => setOrderBy('reference')}><TableSortLabel active={orderBy==='reference'} direction={order}>{'Référence'}</TableSortLabel></th>
                  <th className="px-2 py-2 border cursor-pointer" onClick={() => setOrderBy('nomControle')}><TableSortLabel active={orderBy==='nomControle'} direction={order}>{'Nom du contrôle'}</TableSortLabel></th>
                  <th className="px-2 py-2 border cursor-pointer" onClick={() => setOrderBy('categorieControle')}><TableSortLabel active={orderBy==='categorieControle'} direction={order}>{'Catégorie'}</TableSortLabel></th>
                  <th className="px-2 py-2 border cursor-pointer" onClick={() => setOrderBy('valeur')}><TableSortLabel active={orderBy==='valeur'} direction={order}>{'Valeur attribuée'} <InfoOutlinedIcon fontSize="inherit" className="ml-1 text-gray-400" /></TableSortLabel></th>
                  <th className="px-2 py-2 border">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {sortedControls.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-8">Aucun contrôle pour ce domaine</td></tr>
                ) : (
                  sortedControls.map((ctrl, i) => (
                    <tr key={ctrl.reference} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/50"}>
                      <td className="px-2 py-1 border font-mono whitespace-nowrap">{ctrl.reference}</td>
                      <td className="px-2 py-1 border">{ctrl.nomControle}</td>
                      <td className="px-2 py-1 border"><Chip label={ctrl.categorieControle} size="small" color="info" /></td>
                      <td className="px-2 py-1 border">
                        <Box display="flex" alignItems="center" gap={1}>
                          <select
                            className={`rounded px-2 py-1 font-bold border ${getValueColor(maturityValues[ctrl.reference]?.valeur || '')}`}
                            value={maturityValues[ctrl.reference]?.valeur || ''}
                            onChange={e => handleValeurChange(ctrl.reference, e.target.value)}
                            style={{ minWidth: 70 }}
                          >
                            <option value="">Choisir</option>
                            <option value="0" className="bg-red-800 text-white">0</option>
                            <option value="1" className="bg-red-500 text-white">1</option>
                            <option value="2" className="bg-orange-400 text-white">2</option>
                            <option value="3" className="bg-yellow-300 text-gray-900">3</option>
                            <option value="4" className="bg-green-300 text-gray-900">4</option>
                            <option value="5" className="bg-green-700 text-white">5</option>
                            <option value="N/A" className="bg-gray-400 text-white">N/A</option>
                          </select>
                          {maturityValues[ctrl.reference]?.valeur && (
                            <span className={`inline-block w-4 h-4 rounded-full border ${getValueColor(maturityValues[ctrl.reference]?.valeur)}`} />
                          )}
                        </Box>
                      </td>
                      <td className="px-2 py-1 border">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={maturityValues[ctrl.reference]?.commentaire || ''}
                          onChange={e => handleCommentChange(ctrl.reference, e.target.value)}
                          placeholder="Commentaire..."
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bouton et tableau des vulnérabilités globales */}
      <Box mt={4}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setShowVulnTable(v => !v)}
          startIcon={<InfoOutlinedIcon />}
          sx={{ fontWeight: 600, mb: 2 }}
        >
          {showVulnTable ? "Masquer le tableau des vulnérabilités" : `Générer le tableau des vulnérabilités (${allVulnControls.length})`}
        </Button>
        {showVulnTable && (
          <div className="overflow-x-auto rounded-lg shadow border mt-2">
            <table className="w-full bg-white text-sm sticky-header">
              <thead className="bg-red-50 sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 border">#</th>
                  <th className="px-2 py-2 border">Domaine</th>
                  <th className="px-2 py-2 border">Référence</th>
                  <th className="px-2 py-2 border">Nom du contrôle</th>
                  <th className="px-2 py-2 border">Description des vulnérabilités</th>
                  <th className="px-2 py-2 border">Preuve(s) d'audit</th>
                  <th className="px-2 py-2 border">Actifs impactés</th>
                  <th className="px-2 py-2 border">Impact d'exploitation</th>
                  <th className="px-2 py-2 border">Probabilité d'exploitation</th>
                  <th className="px-2 py-2 border">Recommandation</th>
                </tr>
              </thead>
              <tbody>
                {allVulnControls.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-gray-400 py-8">Aucune vulnérabilité détectée (valeur attribuée à 0)</td></tr>
                ) : (
                  allVulnControls.map((ctrl, i) => (
                    <tr key={ctrl.reference} className={i % 2 === 0 ? "bg-white" : "bg-red-50/50"}>
                      <td className="px-2 py-1 border font-bold">{i + 1}</td>
                      <td className="px-2 py-1 border whitespace-nowrap">{ctrl.domaine.replace(/ \(\d+\)/, "")}</td>
                      <td className="px-2 py-1 border font-mono whitespace-nowrap">{ctrl.reference}</td>
                      <td className="px-2 py-1 border">{ctrl.nomControle}</td>
                      <td className="px-2 py-1 border">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={vulnData[ctrl.reference]?.description || ''}
                          onChange={e => handleVulnFieldChange(ctrl.reference, 'description', e.target.value)}
                          placeholder="Décrire la vulnérabilité..."
                        />
                      </td>
                      <td className="px-2 py-1 border">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={vulnData[ctrl.reference]?.preuve || ''}
                          onChange={e => handleVulnFieldChange(ctrl.reference, 'preuve', e.target.value)}
                          placeholder="Preuve(s) d'audit..."
                        />
                      </td>
                      <td className="px-2 py-1 border">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={vulnData[ctrl.reference]?.actifs || ''}
                          onChange={e => handleVulnFieldChange(ctrl.reference, 'actifs', e.target.value)}
                          placeholder="Actifs impactés..."
                        />
                      </td>
                      <td className="px-2 py-1 border">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={vulnData[ctrl.reference]?.impact || ''}
                          onChange={e => handleVulnFieldChange(ctrl.reference, 'impact', e.target.value)}
                          placeholder="Impact d'exploitation..."
                        />
                      </td>
                      <td className="px-2 py-1 border">
                        <select
                          className="rounded px-2 py-1 border"
                          value={vulnData[ctrl.reference]?.probabilite || ''}
                          onChange={e => handleVulnFieldChange(ctrl.reference, 'probabilite', e.target.value)}
                        >
                          <option value="">Choisir</option>
                          {probabilityOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1 border">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={vulnData[ctrl.reference]?.recommandation || ''}
                          onChange={e => handleVulnFieldChange(ctrl.reference, 'recommandation', e.target.value)}
                          placeholder="Recommandation..."
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Box>
    </div>
  );
}

export default AuditSynthesisSection; 