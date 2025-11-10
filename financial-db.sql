-- ============================================
-- PERSONAL FINANCIAL CONTROL SYSTEM
-- Database Schema (PostgreSQL)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE transaction_type AS ENUM ('income', 'expense');

CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'pix', 'nupay', 'cash', 'bank_transfer');

CREATE TYPE transaction_status AS ENUM ('pending', 'paid', 'cancelled');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_document VARCHAR(14) UNIQUE NOT NULL, -- CPF: 11 digits or CNPJ: 14 digits
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_document ON users(user_document);

-- ============================================
-- CATEGORIES TABLE (New - for better organization)
-- ============================================

CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    category_type transaction_type NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color for UI (#RRGGBB)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_name, category_type)
);

CREATE INDEX idx_categories_user ON categories(user_id);

-- ============================================
-- PAYMENT DESTINATIONS TABLE
-- ============================================

CREATE TABLE payment_destinations (
    destination_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_document VARCHAR(14), -- CNPJ or CPF
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_document)
);

CREATE INDEX idx_destinations_user ON payment_destinations(user_id);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================

CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    destination_id UUID REFERENCES payment_destinations(destination_id) ON DELETE SET NULL,
    
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    payment_method payment_method NOT NULL,
    
    -- Installment information
    installments INTEGER DEFAULT 1 CHECK (installments > 0),
    current_installment INTEGER DEFAULT 1 CHECK (current_installment > 0),
    parent_transaction_id UUID REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    
    description TEXT,
    transaction_status transaction_status DEFAULT 'pending',
    
    -- Dates
    transaction_date DATE NOT NULL, -- Date of the transaction
    due_date DATE, -- Due date for payments
    payment_date TIMESTAMP, -- Actual payment date
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_installment_relation CHECK (
        (current_installment = 1 AND parent_transaction_id IS NULL) OR
        (current_installment > 1 AND parent_transaction_id IS NOT NULL)
    )
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_status ON transactions(transaction_status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_destination ON transactions(destination_id);
CREATE INDEX idx_transactions_parent ON transactions(parent_transaction_id);

-- ============================================
-- ACCOUNT BALANCE TABLE
-- ============================================

CREATE TABLE account_balance (
    balance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    balance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_balance_user_date ON account_balance(user_id, balance_date DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON payment_destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USEFUL VIEWS FOR REPORTS
-- ============================================

-- View: Monthly Summary
CREATE VIEW monthly_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    transaction_type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transactions
WHERE transaction_status = 'paid'
GROUP BY user_id, DATE_TRUNC('month', transaction_date), transaction_type;

-- View: Expenses by Category
CREATE VIEW expenses_by_category AS
SELECT 
    t.user_id,
    c.category_name,
    DATE_TRUNC('month', t.transaction_date) as month,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_amount
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.category_id
WHERE t.transaction_type = 'expense' AND t.transaction_status = 'paid'
GROUP BY t.user_id, c.category_name, DATE_TRUNC('month', t.transaction_date);

-- View: Payment Methods Summary
CREATE VIEW payment_methods_summary AS
SELECT 
    user_id,
    payment_method,
    DATE_TRUNC('month', transaction_date) as month,
    COUNT(*) as usage_count,
    SUM(amount) as total_amount
FROM transactions
WHERE transaction_status = 'paid'
GROUP BY user_id, payment_method, DATE_TRUNC('month', transaction_date);

-- ============================================
-- SAMPLE DATA INSERT (Optional)
-- ============================================

-- Insert sample user
INSERT INTO users (user_name, user_document, email) 
VALUES ('Your Name', '12345678900', 'your.email@example.com');

-- Insert sample categories
INSERT INTO categories (user_id, category_name, category_type, color) 
VALUES 
    ((SELECT user_id FROM users LIMIT 1), 'Salary', 'income', '#4CAF50'),
    ((SELECT user_id FROM users LIMIT 1), 'Food', 'expense', '#FF5722'),
    ((SELECT user_id FROM users LIMIT 1), 'Transportation', 'expense', '#2196F3'),
    ((SELECT user_id FROM users LIMIT 1), 'Entertainment', 'expense', '#9C27B0'),
    ((SELECT user_id FROM users LIMIT 1), 'Bills', 'expense', '#FF9800');