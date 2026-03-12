-- ==========================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE
-- Plateforme Lead & Prospect (Panda Services)
-- ==========================================

-- Activer l'extension pour les UUIDs si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table principale : Leads & Prospects (Companies)
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    sector VARCHAR(100),
    score VARCHAR(50) DEFAULT 'N/A', -- 'Faible', 'Moyen', 'Élevé'
    status VARCHAR(50) DEFAULT 'Nouveau', -- 'Nouveau', 'Enrichissement...', 'Enrichi', 'Prospect', 'RDV', 'Proposition', 'Mission', 'Perdu'
    responsible VARCHAR(100),
    last_contact DATE,
    next_action VARCHAR(255),
    next_action_date DATE,
    notes TEXT,
    opportunities TEXT,
    potential_missions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table pour l'enrichissement (One-to-One avec companies)
CREATE TABLE public.enrichments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    last_enriched DATE DEFAULT CURRENT_DATE,
    summary TEXT,
    
    -- Identité
    identity_size VARCHAR(100),
    identity_location VARCHAR(150),
    identity_founded VARCHAR(50),
    
    -- Environnement Tech
    tech_stack TEXT,
    tech_maturity VARCHAR(50),
    tech_team VARCHAR(50),
    
    -- Recrutement
    recruitment_offers VARCHAR(50),
    recruitment_freq VARCHAR(50),
    
    -- Contacts de l'entreprise
    contact_email VARCHAR(150),
    contact_linkedin VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(company_id)
);

-- 3. Table des décisionnaires (One-to-Many avec companies)
CREATE TABLE public.decision_makers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150),
    phone VARCHAR(50),
    email VARCHAR(150),
    linkedin VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Table d'historique des interactions (One-to-Many avec companies)
CREATE TABLE public.interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    interaction_date DATE DEFAULT CURRENT_DATE,
    interaction_type VARCHAR(50) NOT NULL, -- 'Appel', 'Email', 'RDV', 'Note'
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- TRIGGERS POUR LA MISE À JOUR DE `updated_at`
-- ==========================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_modtime
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_enrichments_modtime
    BEFORE UPDATE ON public.enrichments
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ==========================================
-- SÉCURITÉ (Row Level Security - RLS)
-- ==========================================

-- A décommenter et configurer si vous souhaitez restreindre l'accès en fonction des utilisateurs authentifiés
-- ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.enrichments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.decision_makers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
