# Gundermann Wartungsportal

Klickbarer Prototyp für ein eigenes Wartungs- und Prüfberichtsportal für Lüftungsanlagen, Brandschutzklappen, Klima und Rauchmelder. Der Aufbau orientiert sich an Foxtag, damit der Umstieg leicht fällt.

**Status:** Prototyp. Die Seite läuft komplett im Browser, ohne Server. Alle mitgelieferten Kunden und Anlagen sind erfunden.

## Ansichten

| Ansicht | Für wen | Was passiert dort |
|---|---|---|
| **Büro (Web)** | Büro, Administratoren | Kunden und Anlagen pflegen, Aufträge planen und Technikern zuteilen, Karte mit fälligen Objekten, Berichte, Störungen, Benutzer und Rechte |
| **Techniker (App)** | Techniker, Administratoren | Zugeteilte Aufträge sehen, Komponenten mit Checklisten prüfen, Fotos, Unterschriften, Bericht ans Büro zurückschicken |

Ablauf: Büro plant → Auftrag erscheint in der App → Techniker prüft und schickt zurück → Bericht liegt im Kundenordner und geht per E-Mail ans Büro.

## Datenstruktur

Kunde (Kundennummer) → Objekt (W-Nummer) → Anlage → Gruppen → Komponenten (1.1, 4.2 …)

- Komponenten-Typen mit Prüfintervall: [V] vierteljährlich, [H] halbjährlich, [J] jährlich, [Z] alle 2 Jahre
- Checklisten je Typ mit den Feldtypen Überschrift, i.O./n.i.O./n.v., Ja/Nein, Checkbox, Text, Messwert mit Grenzwert
- Störungen entstehen automatisch aus „n.i.O.“ oder überschrittenen Grenzwerten
- Aufträge mit Status In Planung → Geplant → Auftrag läuft → Erledigt → Abgerechnet

## Benutzen

`index.html` im Browser öffnen oder die GitHub-Pages-Seite des Repositorys aufrufen. Oben lässt sich zwischen Büro- und Techniker-Ansicht sowie zwischen Benutzern umschalten.

## Eigene Daten aus Foxtag

Unter **Kunden & Anlagen → Foxtag-Export importieren** lassen sich die Excel-Exporte aus Foxtag (Anlagen, Kunden, Komponenten je Anlage) oder eine Gesamtdatei (.json) einlesen.

Importierte Daten bleiben nur im Browser des jeweiligen Geräts (IndexedDB) und werden nirgendwo hochgeladen. **Kundendaten gehören nicht in dieses Repository.** JSON- und Excel-Dateien sind deshalb in `.gitignore` ausgeschlossen.

## Was für den echten Betrieb noch fehlt

- Server mit gemeinsamer Datenbank für alle Geräte
- Anmeldung mit der Firmen-E-Mail (z. B. Microsoft 365 / Active Directory) und Rechteverwaltung auf dem Server
- Offline-Modus der App mit Abgleich
- Echte PDF-Erzeugung und E-Mail-Versand über den eigenen Mailserver
- Straßenkarte mit genauer Adresse, QR-Scan mit der Handykamera
