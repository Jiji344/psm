import './style.css'
import logoUrl from './assets/logo.png'

// Simple SPA router and state
const App = {
  state: {
    currentView: 'dashboard',
    leads: [
      { 
        id: 101, name: 'Quantum SaaS', domain: 'quantumsaas.com', sector: 'Cloud Infrastructure', score: 'Élevé', status: 'Enrichi',
        enrichment: {
          identity: { size: '50-200 p.', location: 'Paris', founded: '2018' },
          tech: { stack: 'AWS, React, Node', maturity: 'Haut', team: '15-20' },
          recruitment: { offers: '3 actives', freq: 'Régulier' },
          contacts: { email: 'hr@quantum.com', linkedin: 'linkedin.com/quantum' },
          decisionMakers: [
            { name: 'Sophie Martin', role: 'CTO', phone: '+33 6 12 34 56 78', email: 's.martin@quantumsaas.com', linkedin: 'linkedin.com/in/sophiemartin' },
            { name: 'Lucas Dupont', role: 'VP Engineering', phone: '+33 6 98 76 54 32', email: 'l.dupont@quantumsaas.com', linkedin: 'linkedin.com/in/lucasdupont' }
          ]
        }
      },
      { 
        id: 102, name: 'EcoFlow', domain: 'ecoflow.fr', sector: 'Green Tech', score: 'Moyen', status: 'Nouveau',
        enrichment: null
      },
      { 
        id: 103, name: 'CyberGuard', domain: 'cyberguard.io', sector: 'Cybersecurity', score: 'Élevé', status: 'Enrichi',
        enrichment: {
          identity: { size: '10-50 p.', location: 'Lyon', founded: '2021' },
          tech: { stack: 'Azure, Python, Vue', maturity: 'Moyenne', team: '5-10' },
          recruitment: { offers: '1 active', freq: 'Faible' },
          contacts: { email: 'hello@cyberguard.io', linkedin: 'linkedin.com/cyberguard' },
          decisionMakers: [
            { name: 'Julien Morel', role: 'CEO & Fondateur', phone: '+33 6 55 44 33 22', email: 'j.morel@cyberguard.io', linkedin: 'linkedin.com/in/julienmorel' }
          ]
        }
      }
    ],
    prospects: [
      { 
        id: 201, name: 'Astra Biotech', domain: 'astra.bio', score: 'Élevé', responsible: 'Noé P.', lastContact: '10/03/2026', nextAction: 'Rappel devis', nextActionDate: '15/03/2026', status: 'Prospect', notes: 'Cherche une équipe de 5 développeurs React.', sector: 'Biotech',
        enrichment: {
          identity: { size: '200-500 p.', location: 'Bordeaux', founded: '2015' },
          tech: { stack: 'GCP, Angular, Java', maturity: 'Haut', team: '40+' },
          recruitment: { offers: '10 actives', freq: 'Élevé' },
          contacts: { email: 'contact@astra.bio', linkedin: 'linkedin.com/astra' },
          decisionMakers: [
            { name: 'Dr. Marie Lefèvre', role: 'Directrice Générale', phone: '+33 5 56 12 34 56', email: 'm.lefevre@astra.bio', linkedin: 'linkedin.com/in/marielefevre' },
            { name: 'Thomas Bernard', role: 'DSI', phone: '+33 5 56 78 90 12', email: 't.bernard@astra.bio', linkedin: 'linkedin.com/in/thomasbernard' },
            { name: 'Claire Rousseau', role: 'Responsable Achats IT', phone: '+33 5 56 34 56 78', email: 'c.rousseau@astra.bio', linkedin: 'linkedin.com/in/clairerousseau' }
          ]
        }
      }
    ],
    filterResponsible: ''
  },

  init() {
    this.renderLayout();
    this.handleRouting();
    window.addEventListener('popstate', () => this.handleRouting());
  },

  handleRouting() {
    const path = window.location.pathname;
    if (path === '/leads') this.renderLeads();
    else if (path === '/pipeline') this.renderPipeline();
    else if (path === '/scoring') this.renderScoring();
    else this.renderDashboard();
    
    // Update active nav
    document.querySelectorAll('nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });
  },

  renderLayout() {
    document.querySelector('#app').innerHTML = `
      <div class="layout">
        <aside class="sidebar">
          <div class="logo">
            <img src="${logoUrl}" alt="Panda Services Logo">
            <span>PandaLeads</span>
          </div>
          <nav>
            <a href="/" onclick="event.preventDefault(); history.pushState({}, '', '/'); App.handleRouting();">Tableau de bord</a>
            <a href="/leads" onclick="event.preventDefault(); history.pushState({}, '', '/leads'); App.handleRouting();">Gestion des Leads</a>
            <a href="/pipeline" onclick="event.preventDefault(); history.pushState({}, '', '/pipeline'); App.handleRouting();">Pipeline Prospect</a>
            <a href="/scoring" onclick="event.preventDefault(); history.pushState({}, '', '/scoring'); App.handleRouting();">Scoring</a>
          </nav>
        </aside>
        <main class="main-content">
          <header class="top-nav">
            <div class="search-bar">
              <input type="text" placeholder="Rechercher...">
            </div>
            <div class="user-profile">Noé P. (Admin)</div>
          </header>
          <div id="view-content" class="fade-in"></div>
        </main>
      </div>
    `;
  },

  renderDashboard() {
    const container = document.querySelector('#view-content');
    container.innerHTML = `
      <div class="dashboard-grid">
        <div class="glass-card stat-card">
          <h3>Total Leads</h3>
          <div class="stat-value">${this.state.leads.length}</div>
        </div>
        <div class="glass-card stat-card">
          <h3>En cours (Pipeline)</h3>
          <div class="stat-value">${this.state.prospects.length}</div>
        </div>
        <div class="glass-card stat-card">
          <h3>Taux de conversion</h3>
          <div class="stat-value">24%</div>
        </div>
      </div>
      <div class="glass-card" style="margin-top: var(--spacing-xl); padding: var(--spacing-xl);">
        <h2>Activités récentes</h2>
        <p style="color: var(--text-secondary);">Aucune activité récente à afficher.</p>
      </div>
    `;
  },

  renderLeads() {
    const container = document.querySelector('#view-content');
    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-xl);">
        <h1>Gestion des Leads</h1>
        <button class="btn btn-primary" onclick="App.showAddLeadModal()">+ Nouveau Lead</button>
      </div>
      
      <div class="glass-card" style="overflow: hidden;">
        <table class="saas-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Secteur</th>
              <th>Score</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.state.leads.map(lead => {
              const colors = this.getScoreColors(lead.score);
              return `
              <tr>
                <td>
                  <div style="font-weight: 600;">${lead.name}</div>
                  <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 2px;">${lead.domain}</div>
                </td>
                <td>${lead.sector}</td>
                <td>
                  <span class="badge" style="background: ${colors.bg}; color: ${colors.text}">
                    ${lead.score}
                  </span>
                </td>
                <td>
                  <span class="badge" style="background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-medium);">
                    ${lead.status}
                  </span>
                </td>
                <td>
                  <div class="flex gap-sm">
                    <button class="btn btn-outline" onclick="App.showLeadDetails(${lead.id})">Détails</button>
                    <button class="btn btn-secondary" onclick="App.enrichLead(${lead.id})">Enrichir</button>
                    <button class="btn btn-primary" onclick="App.promoteToProspect(${lead.id})">Pipeline</button>
                  </div>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Add Lead Modal -->
      <div id="add-lead-modal" class="modal-overlay">
        <div class="modal-content" style="max-width: 500px;">
          <h2 style="margin-bottom: var(--spacing-sm);">Nouveau Lead</h2>
          <p style="color: var(--text-secondary); margin-bottom: var(--spacing-lg);">Saisissez les informations de base pour commencer l'enrichissement.</p>
          
          <div class="grid gap-md">
            <div>
              <label class="form-label">Nom de l'entreprise</label>
              <input type="text" id="new-lead-name" class="form-input" placeholder="Ex: Acme Corp">
            </div>
            <div>
              <label class="form-label">Site internet / Domaine</label>
              <input type="text" id="new-lead-domain" class="form-input" placeholder="Ex: acme.com">
            </div>
            <div class="flex gap-md" style="margin-top: var(--spacing-md);">
              <button class="btn btn-outline" style="flex: 1;" onclick="App.closeAddLeadModal()">Annuler</button>
              <button class="btn btn-primary" style="flex: 2;" onclick="App.submitAddLead()">Ajouter le lead</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lead Modal (Details) -->
      <div id="lead-modal" class="modal-overlay">
        <div id="lead-modal-content" class="modal-content"></div>
      </div>
    `;
  },

  showLeadDetails(id) {
    const lead = this.state.leads.find(l => l.id === id);
    if (!lead) return;
    const modal = document.getElementById('lead-modal');
    modal.style.display = 'grid';
    this.renderLeadDetailsModal(lead);
  },

  renderLeadDetailsModal(lead) {
    const content = document.getElementById('lead-modal-content');
    const enriched = lead.enrichment;

    content.innerHTML = `
      <button onclick="document.getElementById('lead-modal').style.display='none'" style="position: absolute; top: 16px; right: 20px; background: none; border: none; color: var(--text-tertiary); font-size: 1.5rem; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-tertiary)'">✕</button>
      <div style="margin-bottom: var(--spacing-xl);">
        <h1 style="margin-bottom: 4px;">${lead.name}</h1>
        <a href="https://${lead.domain}" target="_blank" style="color: var(--accent-primary); text-decoration: none; font-weight: 500;">🌐 ${lead.domain}</a>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);">
        <div>
          <h3 style="margin-bottom: var(--spacing-md);">Données d'Identité</h3>
          <div class="glass-card" style="padding: var(--spacing-md);">
            <div class="grid gap-sm" style="font-size: 0.875rem;">
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Taille:</span> <span style="font-weight: 500;">${enriched?.identity.size || 'Non enrichi'}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Localisation:</span> <span style="font-weight: 500;">${enriched?.identity.location || 'Non enrichi'}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Fondation:</span> <span style="font-weight: 500;">${enriched?.identity.founded || 'Non enrichi'}</span></div>
            </div>
          </div>

          <h3 style="margin-top: var(--spacing-xl); margin-bottom: var(--spacing-md);">Environnement Technique</h3>
          <div class="glass-card" style="padding: var(--spacing-md);">
            <div class="grid gap-sm" style="font-size: 0.875rem;">
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Stack:</span> <span style="font-weight: 500;">${enriched?.tech.stack || 'Non enrichi'}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Maturité:</span> <span style="font-weight: 500;">${enriched?.tech.maturity || 'Non enrichi'}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Équipe Interne:</span> <span style="font-weight: 500;">${enriched?.tech.team || 'Non enrichi'}</span></div>
            </div>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: var(--spacing-md);">Recrutement</h3>
          <div class="glass-card" style="padding: var(--spacing-md);">
            <div class="grid gap-sm" style="font-size: 0.875rem;">
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Offres:</span> <span style="font-weight: 500;">${enriched?.recruitment.offers || 'Non enrichi'}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Fréquence:</span> <span style="font-weight: 500;">${enriched?.recruitment.freq || 'Non enrichi'}</span></div>
            </div>
          </div>

          <h3 style="margin-top: var(--spacing-xl); margin-bottom: var(--spacing-md);">Contacts & Social</h3>
          <div class="glass-card" style="padding: var(--spacing-md);">
            <div class="grid gap-sm" style="font-size: 0.875rem;">
              <div class="flex justify-between"><span style="color: var(--text-secondary);">Email:</span> <span style="font-weight: 500;">${enriched?.contacts.email || 'Non enrichi'}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-secondary);">LinkedIn:</span> <a href="#" style="color: var(--accent-primary); font-weight: 500; text-decoration: none;">${enriched?.contacts.linkedin || 'Non enrichi'}</a></div>
            </div>
          </div>

          <h3 style="margin-top: var(--spacing-xl); margin-bottom: var(--spacing-md);">Décisionnaires identifiés</h3>
          <div class="glass-card" style="padding: 12px 16px;">
            ${enriched?.decisionMakers?.length ? enriched.decisionMakers.map((dm, index) => `
              <div style="padding: 12px 0; ${index !== enriched.decisionMakers.length - 1 ? 'border-bottom: 1px solid var(--border-light);' : ''}">
                <div style="font-weight: 600; color: var(--text-primary);">${dm.name} <span style="color: var(--text-tertiary); font-weight: 400; font-size: 0.8rem; margin-left: 4px;">(${dm.role})</span></div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px; display: flex; gap: 12px;">
                  <span><span style="opacity: 0.7">📞</span> ${dm.phone}</span>
                  <span><span style="opacity: 0.7">✉️</span> ${dm.email}</span>
                </div>
                <div style="margin-top: 6px;">
                  <a href="https://${dm.linkedin}" target="_blank" style="font-size: 0.8rem; color: var(--accent-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                    🔗 Voir profil LinkedIn
                  </a>
                </div>
              </div>
            `).join('') : '<p style="color: var(--text-tertiary); font-size: 0.875rem; padding: 4px 0;">Non enrichi</p>'}
          </div>
          
          <button class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-xl);" onclick="App.enrichLead(${lead.id})">↻ Mettre à jour l'enrichissement</button>
        </div>
      </div>
    `;
  },

  enrichLead(id) {
    const lead = this.state.leads.find(l => l.id === id);
    if (!lead) return;
    
    // Simulate enrichment
    lead.status = 'Enrichissement...';
    this.renderLeads();
    
    setTimeout(() => {
      lead.status = 'Enrichi';
      lead.enrichment = {
        identity: { size: '50-100 p.', location: 'Nantes', founded: '2019' },
        tech: { stack: 'Docker, Node, Vue', maturity: 'Moyenne', team: '8' },
        recruitment: { offers: '2 actives', freq: 'Faible' },
        contacts: { email: 'contact@' + lead.domain, linkedin: 'linkedin.com/' + lead.name.toLowerCase().replace(' ', '') },
        decisionMakers: [
          { name: 'Jean-Pierre Duval', role: 'Directeur Technique', phone: '+33 6 45 67 89 01', email: 'jp.duval@' + lead.domain, linkedin: 'linkedin.com/in/jpduval' }
        ]
      };
      this.renderLeads();
      alert(`Données pour ${lead.name} enrichies avec succès !`);
    }, 1500);
  },

  showAddLeadModal() {
    const modal = document.getElementById('add-lead-modal');
    if (modal) modal.style.display = 'grid';
  },

  closeAddLeadModal() {
    const modal = document.getElementById('add-lead-modal');
    if (modal) {
      modal.style.display = 'none';
      document.getElementById('new-lead-name').value = '';
      document.getElementById('new-lead-domain').value = '';
    }
  },

  submitAddLead() {
    const name = document.getElementById('new-lead-name').value.trim();
    const domain = document.getElementById('new-lead-domain').value.trim();
    
    if (!name || !domain) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newLead = {
      id: Date.now(),
      name,
      domain,
      sector: 'À qualifier',
      score: 'N/A',
      status: 'Nouveau',
      enrichment: null
    };

    this.state.leads.push(newLead);
    this.renderLeads();
    this.closeAddLeadModal();
  },

  renderPipeline() {
    const container = document.querySelector('#view-content');
    const statuses = ['Lead', 'Prospect', 'RDV', 'Proposition', 'Mission', 'Perdu'];
    
    // Filtered data
    const filteredProspects = this.state.filterResponsible 
      ? this.state.prospects.filter(p => p.responsible === this.state.filterResponsible)
      : this.state.prospects;

    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-xl);">
        <div>
          <h1>Pipeline Commercial</h1>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">${filteredProspects.length} opportunités actives</p>
        </div>
        <div class="flex gap-md">
          <select id="filter-responsible" class="form-select" style="width: 200px;">
            <option value="">Tous les responsables</option>
            <option value="Noé P." ${this.state.filterResponsible === 'Noé P.' ? 'selected' : ''}>Noé P.</option>
            <option value="Jean M." ${this.state.filterResponsible === 'Jean M.' ? 'selected' : ''}>Jean M.</option>
            <option value="Julie L." ${this.state.filterResponsible === 'Julie L.' ? 'selected' : ''}>Julie L.</option>
          </select>
          <button class="btn btn-outline" onclick="App.state.filterResponsible=''; App.renderPipeline();">Réinitialiser</button>
        </div>
      </div>
      
      <div class="pipeline-board">
        ${statuses.map(status => {
          const colProspects = filteredProspects.filter(p => p.status === status);
          return `
          <div class="pipeline-column">
            <div class="column-header">
              <span>${status}</span>
              <span style="color: var(--text-secondary); font-size: 0.8rem;">${colProspects.length}</span>
            </div>
            <div id="col-${status}" class="pipeline-list">
              ${colProspects.map(p => `
                <div class="glass-card pipeline-card" onclick="App.showProspectDetails(${p.id})">
                  <div class="flex justify-between items-start" style="margin-bottom: 8px;">
                    <div style="font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 180px;">${p.name}</div>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${this.getScoreColor(p.score)}; margin-top: 4px;"></div>
                  </div>
                  
                  <div style="font-size: 0.8rem; color: var(--accent-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 4px;">
                    <span style="opacity: 0.8;">📅</span> ${p.nextAction || 'Pas d\'action'}
                  </div>

                  <div class="flex justify-between items-center" style="border-top: 1px solid var(--border-glass); padding-top: 8px; margin-top: 8px;">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${p.responsible}</span>
                    <span style="font-size: 0.7rem; color: var(--text-secondary); opacity: 0.7;">${p.sector}</span>
                  </div>
                </div>
              `).join('')}
              ${colProspects.length === 0 ? `<div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 0.85rem; border: 1px dashed var(--border-glass); border-radius: 12px;">Vide</div>` : ''}
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <!-- Prospect Details Modal -->
      <div id="prospect-modal" class="modal-overlay">
        <div id="prospect-modal-content" class="modal-content">
          <!-- Content will be injected -->
        </div>
      </div>
    `;

    document.getElementById('filter-responsible').addEventListener('change', (e) => {
      this.state.filterResponsible = e.target.value;
      this.renderPipeline();
    });
  },

  showProspectDetails(id) {
    const prospect = this.state.prospects.find(p => p.id === id);
    if (!prospect) return;

    const modal = document.getElementById('prospect-modal');
    modal.style.display = 'grid';
    this.renderProspectModal(prospect);
  },

  renderProspectModal(prospect) {
    const content = document.getElementById('prospect-modal-content');
    const enriched = prospect.enrichment;

    content.innerHTML = `
      <button onclick="document.getElementById('prospect-modal').style.display='none'" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--text-primary); font-size: 1.5rem; cursor: pointer;">✕</button>
      
      <div class="grid" style="grid-template-columns: 2fr 1fr; gap: var(--spacing-xl);">
        <div>
          <div class="flex items-center gap-md" style="margin-bottom: var(--spacing-lg);">
            <h1 style="margin: 0;">${prospect.name}</h1>
            <span style="background: var(--accent-primary); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">${prospect.status}</span>
          </div>
          
          <!-- Enriched Data Sections -->
          <div class="grid gap-md" style="grid-template-columns: 1fr 1fr; margin-bottom: var(--spacing-xl);">
            <div class="glass-card" style="padding: var(--spacing-md); background: rgba(255,255,255,0.5);">
              <label style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Identité & Localisation</label>
              <div style="margin-top: 8px; font-size: 0.9rem;">
                <div><span style="color: var(--text-secondary);">Taille:</span> ${enriched?.identity.size || 'N/A'}</div>
                <div><span style="color: var(--text-secondary);">Ville:</span> ${enriched?.identity.location || 'N/A'}</div>
                <div><span style="color: var(--text-secondary);">Création:</span> ${enriched?.identity.founded || 'N/A'}</div>
              </div>
            </div>
            <div class="glass-card" style="padding: var(--spacing-md); background: rgba(255,255,255,0.5);">
              <label style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Environnement Tech</label>
              <div style="margin-top: 8px; font-size: 0.9rem;">
                <div><span style="color: var(--text-secondary);">Stack:</span> ${enriched?.tech.stack || 'N/A'}</div>
                <div><span style="color: var(--text-secondary);">Maturité:</span> ${enriched?.tech.maturity || 'N/A'}</div>
                <div><span style="color: var(--text-secondary);">Équipe:</span> ${enriched?.tech.team || 'N/A'}</div>
              </div>
            </div>
            <div class="glass-card" style="padding: var(--spacing-md); background: rgba(255,255,255,0.5);">
              <label style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Recrutement</label>
              <div style="margin-top: 8px; font-size: 0.9rem;">
                <div><span style="color: var(--text-secondary);">Offres:</span> ${enriched?.recruitment.offers || 'N/A'}</div>
                <div><span style="color: var(--text-secondary);">Freq:</span> ${enriched?.recruitment.freq || 'N/A'}</div>
              </div>
            </div>
            <div class="glass-card" style="padding: var(--spacing-md); background: rgba(255,255,255,0.5);">
              <label style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Contact & Web</label>
              <div style="margin-top: 8px; font-size: 0.9rem;">
                <div><a href="https://${prospect.domain}" target="_blank" style="color: var(--accent-primary); text-decoration: none;">🌐 ${prospect.domain}</a></div>
                <div style="margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span style="color: var(--text-secondary);">Email:</span> ${enriched?.contacts.email || 'N/A'}</div>
                <div><a href="#" style="color: var(--accent-primary); font-size: 0.8rem;">🔗 LinkedIn Company</a></div>
              </div>
            </div>
          </div>

          <h3 style="margin-bottom: var(--spacing-md);">Décisionnaires identifiés</h3>
          <div class="glass-card" style="padding: var(--spacing-md); margin-bottom: var(--spacing-xl);">
            ${enriched?.decisionMakers?.length ? enriched.decisionMakers.map(dm => `
              <div style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
                <div style="font-weight: 600;">${dm.name} <span style="color: var(--accent-primary); font-weight: 500; font-size: 0.8rem;">— ${dm.role}</span></div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">📞 ${dm.phone} · ✉️ ${dm.email}</div>
                <a href="https://${dm.linkedin}" target="_blank" style="font-size: 0.8rem; color: var(--accent-primary);">🔗 Profil LinkedIn</a>
              </div>
            `).join('') : '<p style="color: var(--text-secondary);">Aucun décisionnaire identifié.</p>'}
          </div>

          <h3 style="margin-bottom: var(--spacing-md);">Historique & Notes</h3>
          <div class="glass-card" style="padding: var(--spacing-lg); margin-bottom: var(--spacing-xl); min-height: 200px;">
            <p style="color: var(--text-primary); white-space: pre-wrap; margin-bottom: var(--spacing-lg);">${prospect.notes || 'Aucune note.'}</p>
            <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid var(--border-glass);">
               <textarea id="temp-note" placeholder="Ajouter un commentaire..." style="width: 100%; padding: 12px; background: rgba(255,255,255,0.8); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-primary); min-height: 80px;"></textarea>
               <button class="btn btn-outline" style="margin-top: 8px;" onclick="App.addNote(${prospect.id})">Enregistrer la note</button>
            </div>
          </div>
        </div>

        <div style="border-left: 1px solid var(--border-glass); padding-left: var(--spacing-xl);">
          <h3 style="margin-bottom: var(--spacing-md);">Actions Commerciales</h3>
          
          <div class="glass-card" style="padding: var(--spacing-md); border-color: var(--accent-warning); margin-bottom: var(--spacing-lg);">
            <label style="color: var(--accent-warning); font-size: 0.8rem; font-weight: bold; display: block; margin-bottom: 8px;">PROCHAINE ACTION</label>
            <div style="font-weight: 700; margin-bottom: 4px;">${prospect.nextAction || 'À définir'}</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">Échéance: ${prospect.nextActionDate || 'N/A'}</div>
          </div>

          <div style="margin-bottom: var(--spacing-xl);">
            <label style="color: var(--text-secondary); display: block; margin-bottom: 8px;">Responsable</label>
            <select style="width: 100%; padding: 10px; background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 8px; color: var(--text-primary);">
              ${['Noé P.', 'Jean M.', 'Julie L.'].map(r => `<option ${r === prospect.responsible ? 'selected' : ''}>${r}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom: var(--spacing-xl);">
            <label style="color: var(--text-secondary); display: block; margin-bottom: 8px;">Changer de Statut</label>
            <div class="grid gap-sm">
              ${['Lead', 'Prospect', 'RDV', 'Proposition', 'Mission', 'Perdu'].map(s => `
                <button class="btn ${s === prospect.status ? 'btn-primary' : 'btn-outline'}" 
                        style="width: 100%; justify-content: flex-start; padding: 8px 12px; font-size: 0.85rem;"
                        onclick="App.updateProspectStatus(${prospect.id}, '${s}')">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  addNote(id) {
    const noteEl = document.getElementById('temp-note');
    if (!noteEl || !noteEl.value) return;
    
    const prospect = this.state.prospects.find(p => p.id === id);
    if (prospect) {
      prospect.notes = (prospect.notes || '') + '\n\n' + new Date().toLocaleString() + ' : ' + noteEl.value;
      this.renderProspectModal(prospect);
    }
  },

  updateProspectStatus(id, newStatus) {
    this.state.prospects = this.state.prospects.map(p => 
      p.id === id ? { ...p, status: newStatus, lastContact: new Date().toLocaleDateString() } : p
    );
    this.renderPipeline();
    const updatedProspect = this.state.prospects.find(p => p.id === id);
    this.renderProspectModal(updatedProspect);
  },

  getScoreColors(score) {
    if (score === 'Élevé') return { bg: 'rgba(26, 188, 156, 0.1)', text: '#1abc9c' };
    if (score === 'Moyen') return { bg: 'rgba(243, 156, 18, 0.1)', text: '#f39c12' };
    return { bg: 'rgba(231, 76, 60, 0.1)', text: '#e74c3c' };
  },

  getScoreColor(score) {
    if (score === 'Élevé') return 'var(--accent-success)';
    if (score === 'Moyen') return 'var(--accent-warning)';
    return 'var(--accent-danger)';
  },

  renderScoring() {
    const container = document.querySelector('#view-content');
    container.innerHTML = `
      <div style="margin-bottom: var(--spacing-xl);">
        <h1>Configuration du Scoring</h1>
        <p>Définissez les pondérations pour le calcul automatique de la maturité des leads.</p>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);">
        <div class="glass-card" style="padding: var(--spacing-xl);">
          <h3 style="margin-bottom: var(--spacing-lg);">Critères de pondération</h3>
          <div class="grid gap-md">
            ${['Maturité Technique', 'Recrutement Actif', 'Taille Entreprise', 'Secteur Prioritaire'].map(criterion => `
              <div class="flex justify-between items-center">
                <label>${criterion}</label>
                <input type="range" min="0" max="100" value="50" style="width: 150px;">
              </div>
            `).join('')}
          </div>
          <button class="btn btn-primary" style="margin-top: var(--spacing-xl); width: 100%;">Sauvegarder la configuration</button>
        </div>

        <div class="glass-card" style="padding: var(--spacing-xl);">
          <h3 style="margin-bottom: var(--spacing-lg);">Aperçu de la segmentation</h3>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
            <div style="padding: var(--spacing-md); border-left: 4px solid var(--accent-success); background: rgba(63, 185, 80, 0.05);">
              <div style="font-weight: 700; color: var(--accent-success);">SCORE ÉLEVÉ (> 80)</div>
              <div style="font-size: 0.85rem;">Priorité immédiate. Passage auto en prospect.</div>
            </div>
            <div style="padding: var(--spacing-md); border-left: 4px solid var(--accent-warning); background: rgba(210, 153, 34, 0.05);">
              <div style="font-weight: 700; color: var(--accent-warning);">SCORE MOYEN (40-80)</div>
              <div style="font-size: 0.85rem;">Nurturing nécessaire. Qualification manuelle.</div>
            </div>
            <div style="padding: var(--spacing-md); border-left: 4px solid var(--accent-danger); background: rgba(248, 81, 73, 0.05);">
              <div style="font-weight: 700; color: var(--accent-danger);">SCORE FAIBLE (< 40)</div>
              <div style="font-size: 0.85rem;">Veille stratégique uniquement.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Extension: Helper to promote lead to prospect
  promoteToProspect(leadId) {
    const lead = this.state.leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const newProspect = {
      ...lead,
      status: 'Prospect',
      responsible: 'Noé P.',
      lastContact: new Date().toLocaleDateString(),
      pipeline: 'En attente'
    };
    
    this.state.prospects.push(newProspect);
    this.state.leads = this.state.leads.filter(l => l.id !== leadId);
    alert(`${lead.name} a été transféré au Pipeline Prospects.`);
    if (window.location.pathname === '/leads') this.refreshLeadsList();
  }
};

// Global accessor for inline onclick handlers
window.App = App;
App.init();
