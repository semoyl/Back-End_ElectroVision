DROP database IF EXISTS db_saep;
CREATE DATABASE db_saep;
USE db_saep;

CREATE TABLE tbl_historico (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    resumo TEXT
);

CREATE TABLE tbl_funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    chave VARCHAR(30),
    cpf VARCHAR(14),
    email VARCHAR(100)
);

CREATE TABLE tbl_produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especificacao VARCHAR(255),
    qtd INT DEFAULT 0,
    prateleira VARCHAR(50)
);

CREATE TABLE tbl_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_historico INT NOT NULL,
    id_produto INT NOT NULL,
    id_funcionario INT NOT NULL,
    FOREIGN KEY (id_historico) REFERENCES tbl_historico(id_historico)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES tbl_produto(id_produto)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_funcionario) REFERENCES tbl_funcionario(id_funcionario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inserindo dados de teste
INSERT INTO tbl_funcionario (nome, chave, cpf, email) VALUES 
('Admin', 'admin123', '000.000.000-00', 'admin@electrovision.com'),
('João Silva', 'joao456', '111.111.111-11', 'joao@electrovision.com');

INSERT INTO tbl_produto (nome, especificacao, qtd, prateleira) VALUES 
('Resistor 10k', 'Resistor de 10k ohms', 100, 'A1'),
('Capacitor 100uF', 'Capacitor eletrolítico 100uF', 50, 'B2'),
('LED Vermelho', 'LED 5mm vermelho', 200, 'C3');