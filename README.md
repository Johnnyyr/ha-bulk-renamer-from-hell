# HA Bulk Renamer from Hell 🤘

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub release](https://img.shields.io/github/release/Johnnyyr/ha-bulk-renamer-from-hell.svg)](https://github.com/Johnnyyr/ha-bulk-renamer-from-hell/releases/)

Ein metal-inspiriertes Home Assistant Custom Component für das Bulk-Umbenennen von Entities mit moderner GUI und vollständiger Nachverfolgung.

## 🔥 Features

- **🔍 Intelligente Suche**: Filtere Entities nach Typ, Namen oder Bereichen
- **☑️ Bulk-Auswahl**: Wähle mehrere Entities gleichzeitig aus
- **🔧 Find & Replace**: Massenersetzung in Entity-IDs
- **👀 Vorschau**: Sieh alle Änderungen vor dem Anwenden
- **📝 Änderungsprotokoll**: Vollständige Historie aller Umbenennungen
- **⚡ Robuste Validierung**: Verhindert Fehler und Duplikate
- **🇩🇪 Deutsche Oberfläche**: Vollständig lokalisiert

## 📦 Installation

### Via HACS (empfohlen)
1. Öffne HACS in Home Assistant
2. Gehe zu "Integrations"
3. Klicke auf die drei Punkte oben rechts
4. Wähle "Custom repositories"
5. Füge `https://github.com/Johnnyyr/ha-bulk-renamer-from-hell` hinzu
6. Kategorie: "Integration"
7. Installiere "HA Bulk Renamer from Hell"
8. Starte Home Assistant neu

### Manuelle Installation
1. Lade die neueste Version herunter
2. Kopiere den `custom_components/ha_bulk_renamer_from_hell` Ordner in dein HA `custom_components` Verzeichnis
3. Starte Home Assistant neu

## 🚀 Verwendung

1. Nach der Installation findest du **"HA Bulk Renamer from Hell"** in der Sidebar
2. Gib einen Filter ein (z.B. `light`, `sensor`, `eg`)
3. Wähle die Entities aus, die du umbenennen möchtest
4. Bearbeite die neuen Entity-IDs oder nutze Find & Replace
5. Klicke auf "Vorschau" um die Änderungen zu prüfen
6. Wende die Änderungen an und verfolge sie im Protokoll

## 🎯 Beispiele

### Alle Lichter in einem Bereich umbenennen:
- Filter: `light.eg_`
- Find & Replace: `eg_` → `erdgeschoss_`
- Ergebnis: `light.eg_wohnzimmer` → `light.erdgeschoss_wohnzimmer`

### Sensoren standardisieren:
- Filter: `sensor`
- Bulk-Auswahl und individuelle Anpassung der Namen

## ⚠️ Wichtige Hinweise

- **Nur für Administratoren**: Das Panel erfordert Admin-Rechte
- **Backup empfohlen**: Erstelle vor größeren Änderungen ein Backup
- **Entity Registry**: Nur Entities im Entity Registry können umbenannt werden
- **Eindeutige IDs**: Neue Entity-IDs müssen eindeutig sein

## 🏷️ Mindestanforderungen & Einschränkungen

- **Home Assistant Version:** Getestet ab **2023.6** (ältere Versionen werden nicht unterstützt)
- **HACS:** Empfohlen ab Version 1.30
- **Panel-Entfernung:** Das Panel kann über den Service `ha_bulk_renamer_from_hell.remove_panel` entfernt werden
- **Bekannte Einschränkungen:**
  - Keine Unterstützung für Entities außerhalb des Entity Registry
  - Keine automatische Rücknahme von Umbenennungen
  - Panel und Umbenennung nur für Admin-User sichtbar
  - Sehr große Installationen (>1000 Entities) können zu längeren Ladezeiten führen

## 🐛 Fehlerbehebung

### Logs aktivieren:
```yaml
# configuration.yaml
logger:
  logs:
    custom_components.ha_bulk_renamer_from_hell: debug
```

### Häufige Probleme:
- **"Entity not found"**: Entity existiert nicht im Registry
- **"Entity ID already exists"**: Neue ID ist bereits vergeben
- **Keine Entities gefunden**: Filter zu spezifisch oder keine passenden Entities

## 🤝 Beitragen

Beiträge sind willkommen! Bitte:
1. Forke das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- Home Assistant Community für die großartige Plattform
- HACS für die einfache Distribution von Custom Components
- Alle Tester und Contributor

---

**Gefällt dir das Projekt? Gib ihm einen ⭐ auf GitHub!**
