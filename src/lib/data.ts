// Types et interfaces pour l'API
export * from './api';

// Données de fallback pour le développement
export const fallbackData = {
  faculties: [
    { id: 1, name: 'Sciences et Technologies', label: 'Sci & Tech' },
    { id: 2, name: 'Sciences Économiques et de Gestion', label: 'Éco & Gestion' },
    { id: 3, name: 'Droit et Sciences Politiques', label: 'Droit & Pol' },
    { id: 4, name: 'Médecine', label: 'Médecine' },
    { id: 5, name: 'Sciences Sociales', label: 'Sci Sociales' },
  ],
  
  departments: [
    { id: 6, name: 'Informatique', label: 'Info', parent_id: 1 },
    { id: 7, name: 'Génie Civil', label: 'Génie Civil', parent_id: 1 },
    { id: 8, name: 'Économie', label: 'Économie', parent_id: 2 },
    { id: 9, name: 'Gestion', label: 'Gestion', parent_id: 2 },
    { id: 10, name: 'Droit Privé', label: 'Droit Privé', parent_id: 3 },
    { id: 11, name: 'Droit Public', label: 'Droit Public', parent_id: 3 },
  ],
  
  promotions: [
    { id: 1, title: 'BAC1 SYSTEMES INFORMATIQUES', label: 'BAC1 INFO', level: 1, entityId: 6 },
    { id: 2, title: 'BAC2 SYSTEMES INFORMATIQUES', label: 'BAC2 INFO', level: 2, entityId: 6 },
    { id: 3, title: 'BAC3 SYSTEMES INFORMATIQUES', label: 'BAC3 INFO', level: 3, entityId: 6 },
    { id: 4, title: 'BAC1 GENIE CIVIL', label: 'BAC1 GC', level: 1, entityId: 7 },
    { id: 5, title: 'BAC1 ECONOMIE', label: 'BAC1 ECO', level: 1, entityId: 8 },
  ]
};
