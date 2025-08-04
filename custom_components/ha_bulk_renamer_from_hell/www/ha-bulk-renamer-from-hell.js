class BulkEntityRenamer extends HTMLElement {
  constructor() {
    super();
    this.changeLog = [];
  }

  set hass(hass) {
    this.innerHTML = `
      <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .search-section { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .bulk-actions { margin: 15px 0; display: flex; gap: 10px; flex-wrap: wrap; }
        .entity-item { 
          display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; 
          margin: 5px 0; border-radius: 4px; background: white;
        }
        .entity-item:hover { background: #f9f9f9; }
        .entity-checkbox { margin-right: 10px; }
        .entity-info { flex: 1; margin-right: 10px; }
        .entity-id { font-weight: bold; color: #333; }
        .entity-name { color: #666; font-size: 0.9em; }
        .new-id-input { width: 300px; padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
        .preview-section { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .change-log { background: #f0f8ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .warning { color: #ffc107; }
        button { padding: 8px 16px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: black; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
      </style>
      <div class="container">
  <div id="loading-indicator" style="display:none; text-align:center; margin:10px 0; color:#007bff; font-weight:bold;">Lade...</div>
  <div id="error-banner" style="display:none; background:#dc3545; color:white; padding:10px; border-radius:5px; margin-bottom:10px;"></div>
        <div class="header">
          <h1>HA Bulk Renamer from Hell 🤘</h1>
          <p>Bulk-Umbenennung von Home Assistant Entities mit Vorschau und Änderungsprotokoll</p>
        </div>
        
        <div class="search-section">
          <h3>🔍 Entity-Suche</h3>
          <input id="filter" placeholder="Filter eingeben (z.B. light, sensor, eg...)" style="width: 300px; padding: 8px;" />
          <button id="load" class="btn-primary">Entities laden</button>
          <div style="margin-top: 10px; color: #666;">
            💡 Tipp: Suche nach Typ (light, sensor), Bereich (eg, wohnzimmer) oder beliebigem Text
          </div>
        </div>
        
        <div id="results-section" style="display: none;">
          <h3>📋 Gefundene Entities</h3>
          <div class="bulk-actions">
            <button id="select-all" class="btn-secondary">Alle auswählen</button>
            <button id="select-none" class="btn-secondary">Alle abwählen</button>
            <button id="preview" class="btn-warning">Vorschau anzeigen</button>
            <span style="margin-left: 20px; font-weight: bold;" id="selection-count">0 ausgewählt</span>
          </div>
          
          <div class="bulk-actions">
            <h4>🔧 Bulk-Operationen:</h4>
            <input id="find-text" placeholder="Suchen..." style="width: 150px;" />
            <input id="replace-text" placeholder="Ersetzen mit..." style="width: 150px;" />
            <button id="apply-replace" class="btn-secondary">Auf Auswahl anwenden</button>
          </div>
          
          <div id="entity-list"></div>
          
          <div id="preview-section" class="preview-section" style="display: none;">
            <h4>👀 Vorschau der Änderungen</h4>
            <div id="preview-content"></div>
            <button id="apply" class="btn-success">✅ Änderungen anwenden</button>
            <button id="cancel-preview" class="btn-secondary">Abbrechen</button>
          </div>
        </div>
        
        <div id="change-log-section" class="change-log" style="display: none;">
          <h3>📝 Änderungsprotokoll</h3>
          <div id="change-log-content"></div>
          <button id="clear-log" class="btn-danger">Protokoll löschen</button>
        </div>
      </div>
    `;

    // Load entities handler
    this.querySelector("#load").onclick = async () => {
      const filterValue = this.querySelector("#filter").value.trim();
      const errorBanner = this.querySelector("#error-banner");
      errorBanner.style.display = "none";
      errorBanner.textContent = "";
      if (!filterValue) {
        errorBanner.textContent = "Bitte einen Filter eingeben!";
        errorBanner.style.display = "block";
        return;
      }
      const loading = this.querySelector("#loading-indicator");
      loading.style.display = "block";
      this.querySelector("#load").disabled = true;
      try {
        const resp = await hass.callWS({
          type: "ha_bulk_renamer_from_hell/get_entities",
          filter: filterValue
        });
        if (resp.entities && resp.entities.length > 0) {
          this.renderEntityList(resp.entities);
          this.querySelector("#results-section").style.display = "block";
        } else {
          errorBanner.textContent = `Keine Entities mit Filter '${filterValue}' gefunden.`;
          errorBanner.style.display = "block";
        }
      } catch (error) {
        errorBanner.textContent = `Fehler beim Laden der Entities: ${error.message}`;
        errorBanner.style.display = "block";
      } finally {
        loading.style.display = "none";
        this.querySelector("#load").disabled = false;
      }
    };
    
    // Bulk selection handlers
    this.querySelector("#select-all").onclick = () => this.selectAll(true);
    this.querySelector("#select-none").onclick = () => this.selectAll(false);
    
    // Find & Replace handler
    this.querySelector("#apply-replace").onclick = () => this.applyFindReplace();
    
    // Preview handler
    this.querySelector("#preview").onclick = () => this.showPreview();
    
    // Apply changes handler
    this.querySelector("#apply").onclick = () => this.applyChanges(hass);
    
    // Cancel preview handler
    this.querySelector("#cancel-preview").onclick = () => {
      this.querySelector("#preview-section").style.display = "none";
    };
    
    // Clear log handler
    this.querySelector("#clear-log").onclick = () => {
      this.changeLog = [];
      this.updateChangeLog();
    };
  }
  
  renderEntityList(entities) {
    const list = entities.map(entity => `
      <div class="entity-item">
        <input type="checkbox" class="entity-checkbox" data-id="${entity.entity_id}" onchange="this.getRootNode().host.updateSelectionCount()" />
        <div class="entity-info">
          <div class="entity-id">${entity.entity_id}</div>
          <div class="entity-name">${entity.name || 'Kein Name'}</div>
        </div>
        <input class="new-id-input" placeholder="Neue Entity-ID" value="${entity.entity_id}" />
      </div>
    `).join("");
    
    this.querySelector("#entity-list").innerHTML = list;
    this.updateSelectionCount();
  }
  
  selectAll(select) {
    const checkboxes = this.querySelectorAll(".entity-checkbox");
    checkboxes.forEach(cb => cb.checked = select);
    this.updateSelectionCount();
  }
  
  updateSelectionCount() {
    const selected = this.querySelectorAll(".entity-checkbox:checked").length;
    this.querySelector("#selection-count").textContent = `${selected} ausgewählt`;
  }
  
  applyFindReplace() {
    const findText = this.querySelector("#find-text").value;
    const replaceText = this.querySelector("#replace-text").value;
    
    if (!findText) {
      alert("Bitte Suchtext eingeben!");
      return;
    }
    
    const selectedItems = this.querySelectorAll(".entity-checkbox:checked");
    selectedItems.forEach(checkbox => {
      const item = checkbox.closest(".entity-item");
      const input = item.querySelector(".new-id-input");
      input.value = input.value.replace(new RegExp(findText, 'g'), replaceText);
    });
  }
  
  showPreview() {
    const changes = this.getChanges();
    
    if (changes.length === 0) {
      alert("Keine Änderungen zum Anzeigen. Bitte Entities auswählen und neue IDs eingeben.");
      return;
    }
    
    const previewHtml = changes.map(change => `
      <div style="padding: 5px; border-bottom: 1px solid #ddd;">
        <span class="entity-id">${change.oldId}</span> 
        <span style="margin: 0 10px;">→</span> 
        <span class="success">${change.newId}</span>
      </div>
    `).join("");
    
    this.querySelector("#preview-content").innerHTML = `
      <p><strong>${changes.length} Änderungen geplant:</strong></p>
      ${previewHtml}
    `;
    
    this.querySelector("#preview-section").style.display = "block";
  }
  
  getChanges() {
    const changes = [];
    const selectedItems = this.querySelectorAll(".entity-checkbox:checked");
    
    selectedItems.forEach(checkbox => {
      const item = checkbox.closest(".entity-item");
      const oldId = checkbox.dataset.id;
      const newId = item.querySelector(".new-id-input").value.trim();
      
      if (newId && newId !== oldId) {
        changes.push({ oldId, newId });
      }
    });
    
    return changes;
  }
  
  async applyChanges(hass) {
    const changes = this.getChanges();
    const errorBanner = this.querySelector("#error-banner");
    errorBanner.style.display = "none";
    errorBanner.textContent = "";
    if (changes.length === 0) {
      errorBanner.textContent = "Keine Änderungen zum Anwenden!";
      errorBanner.style.display = "block";
      return;
    }
    const loading = this.querySelector("#loading-indicator");
    loading.style.display = "block";
    this.querySelector("#apply").disabled = true;
    try {
      const resp = await hass.callWS({
        type: "ha_bulk_renamer_from_hell/rename_entities",
        rename_map: renameMap
      });
      // Log the operation
      const timestamp = new Date().toLocaleString('de-DE');
      this.changeLog.push({
        timestamp,
        successful: resp.successful_renames || [],
        errors: resp.errors || {},
        totalRequested: resp.total_requested || 0,
        successfulCount: resp.successful_count || 0,
        errorCount: resp.error_count || 0
      });
      this.updateChangeLog();
      this.querySelector("#change-log-section").style.display = "block";
      this.querySelector("#preview-section").style.display = "none";
      // Show result
      if (resp.error_count > 0) {
        const errorList = Object.entries(resp.errors).map(([id, error]) => `${id}: ${error}`).join('\n');
        errorBanner.textContent = `Umbenennung teilweise erfolgreich:\n✅ ${resp.successful_count} erfolgreich\n❌ ${resp.error_count} Fehler\n\nFehler:\n${errorList}`;
        errorBanner.style.display = "block";
      } else {
        errorBanner.textContent = `🎉 Alle ${resp.successful_count} Entities erfolgreich umbenannt!`;
        errorBanner.style.display = "block";
      }
    } catch (error) {
      errorBanner.textContent = `Fehler beim Umbenennen: ${error.message}`;
      errorBanner.style.display = "block";
    } finally {
      loading.style.display = "none";
      this.querySelector("#apply").disabled = false;
    }
  }
  
  updateChangeLog() {
    if (this.changeLog.length === 0) {
      this.querySelector("#change-log-section").style.display = "none";
      return;
    }
    
    const logHtml = this.changeLog.map((entry, index) => `
      <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 4px;">
        <h5>Operation ${index + 1} - ${entry.timestamp}</h5>
        <p><strong>Ergebnis:</strong> ${entry.successfulCount} erfolgreich, ${entry.errorCount} Fehler</p>
        
        ${entry.successful.length > 0 ? `
          <details>
            <summary class="success">✅ Erfolgreich (${entry.successful.length})</summary>
            ${entry.successful.map(s => `<div>${s.old_id} → ${s.new_id}</div>`).join('')}
          </details>
        ` : ''}
        
        ${Object.keys(entry.errors).length > 0 ? `
          <details>
            <summary class="error">❌ Fehler (${Object.keys(entry.errors).length})</summary>
            ${Object.entries(entry.errors).map(([id, error]) => `<div>${id}: ${error}</div>`).join('')}
          </details>
        ` : ''}
      </div>
    `).reverse().join("");
    
    this.querySelector("#change-log-content").innerHTML = logHtml;
  }
}

customElements.define("ha-bulk-renamer-from-hell", BulkEntityRenamer);
