# DataVisualisation

## Übersicht

Diese Anwendung visualisiert Daten mithilfe von Charts und Statistik-Boxen. Die Daten werden über Mosquitto als Broker auf eine VM bereitgestellt. Die Angular-Anwendung greift über einen WebSocket auf diese Daten vom Broker zu und visualisiert sie in verschiedenen Diagrammen und Statistik-Karten.

## Technologien

Die folgenden Technologien werden in diesem Projekt verwendet:

- **Angular**
- **Angular Material**
- **TypeScript**
- **ngx-charts**

## Features

- **Datenvisualisierung**:

  - Die Daten werden mit ngx-charts angezeigt, insbesondere mithilfe von Line Charts.
  - Statistiken werden mit Number Cards dargestellt.

- **MQTT Integration**:
  - Ein `mqttService` wird genutzt, um die Daten über den WebSocket vom Broker zu erhalten.
  - Die Daten werden im Local Storage des Browsers gespeichert, um sie weiterhin nutzen zu können, auch wenn keine Live-Verbindung besteht.

## Datenfluss

1. **Datenbereitstellung**:

   - Die Daten werden auf eine VM über Mosquitto als Broker zur Verfügung gestellt.

2. **Datenabfrage**:

   - Die Angular-Anwendung greift über einen WebSocket auf die Daten vom Broker zu.

3. **Datenvisualisierung**:

   - Mit ngx-charts werden die Daten in Line Charts visualisiert.
   - Statistiken werden mithilfe von Number Cards angezeigt.

4. **Persistenz**:
   - Die Daten werden im Local Storage des Browsers gespeichert, um eine kontinuierliche Nutzung zu gewährleisten.

## Installation und Nutzung

1. **Repository klonen**:
   ```bash
   git clone https://github.com/dein-username/DataVisualisation.git
   ```
2. **Abhängigkeiten installieren**:
   ```
   cd data-visualisation
   npm install
   ```
3. **Anwendung starten**:
   ```
   ng serve --open
   ```
