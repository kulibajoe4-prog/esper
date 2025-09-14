# iPresence Insights - UCB

Système de gestion des présences étudiantes pour l'Université Catholique de Bukavu (UCB).

## 🚀 Fonctionnalités

- **Gestion des présences en temps réel** : Enregistrement automatique avec détection des retards
- **Recherche d'étudiants** : Intégration avec l'API UCB pour récupérer les informations étudiantes
- **Tableaux de bord analytiques** : Statistiques détaillées et visualisations
- **Structure académique** : Gestion des facultés, départements et promotions
- **API REST complète** : Backend PHP avec base de données MySQL
- **Interface moderne** : Design responsive avec Next.js et Tailwind CSS

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI
- **Recharts** - Graphiques et visualisations
- **Lucide React** - Icônes

### Backend
- **PHP 8+** - API REST native
- **MySQL 8+** - Base de données
- **PDO** - Accès sécurisé à la base de données

## 📋 Prérequis

- Node.js 18+ et npm
- PHP 8+ avec extensions PDO et MySQL
- MySQL 8+ ou MariaDB 10+
- Serveur web (Apache/Nginx) avec mod_rewrite

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd ipresence-insights
```

### 2. Configuration de la base de données
```bash
# Créer la base de données
mysql -u root -p < api/database.sql

# Configurer les paramètres dans api/config.php
```

### 3. Configuration du backend
```bash
# Copier les fichiers API vers votre serveur web
cp -r api/ /var/www/html/ipresence/

# Configurer les permissions
chmod 755 /var/www/html/ipresence/
chmod 644 /var/www/html/ipresence/api.php
```

### 4. Installation du frontend
```bash
# Installer les dépendances
npm install

# Configurer l'URL de l'API dans src/lib/api.ts
# Modifier API_BASE_URL selon votre configuration

# Démarrer en développement
npm run dev
```

## 🔧 Configuration

### Variables d'environnement (api/config.php)
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'ipresence_ucb');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### Configuration CORS
Modifiez `CORS_ALLOWED_ORIGINS` dans `api/config.php` pour inclure votre domaine frontend.

## 📚 API Endpoints

### Étudiants
- `GET /api.php?action=getStudent&matricule={matricule}` - Récupérer un étudiant
- `GET /api.php?action=getStudents` - Liste des étudiants

### Structure académique
- `GET /api.php?action=getStructure` - Facultés, départements, promotions

### Présences
- `POST /api.php?action=markPresence` - Marquer une présence
- `GET /api.php?action=getPresences` - Récupérer les présences

### Statistiques
- `GET /api.php?action=getStats` - Statistiques globales

## 🎯 Utilisation

1. **Recherche d'étudiant** : Entrez le matricule pour récupérer les informations
2. **Marquage de présence** : Cliquez sur "Marquer présent" pour enregistrer
3. **Consultation des statistiques** : Visualisez les données dans le tableau de bord
4. **Génération de rapports** : Exportez les données aux formats PDF, Excel, CSV

## 🔒 Sécurité

- Requêtes préparées PDO contre l'injection SQL
- Validation et sanitisation des données d'entrée
- Headers de sécurité configurés
- Gestion des erreurs sécurisée

## 📊 Base de données

### Tables principales
- `students` - Informations des étudiants
- `promotions` - Promotions académiques
- `entities` - Facultés et départements
- `presences` - Enregistrements de présence
- `courses` - Cours et horaires

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

---

Développé avec ❤️ pour l'Université Catholique de Bukavu (UCB)
