// src/components/FormEnvioEmail.jsx

import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

export function FormEnvioEmail() {
  // Estados locais do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Antes de usar emailjs.send, sempre chame emailjs.init com o seu User ID
  useEffect(() => {
    // Substitua 'YOUR_USER_ID' pelo seu User ID fornecido pelo EmailJS
    emailjs.init('FR9t1wkY_bT3iLNbS');
  }, []);

  // Função que será chamada ao submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações básicas
    if (!nome.trim() || !cpf.trim() || !destinatario.trim()) {
      setMensagem('Por favor, preencha nome, CPF e destinatário antes de enviar.');
      return;
    }

    // (Opcional) Validação simples de e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(destinatario.trim())) {
      setMensagem('E-mail inválido. Informe um endereço de e-mail válido.');
      return;
    }

    setEnviando(true);
    setMensagem('');

    // Parâmetros que o template do EmailJS espera receber
    const templateParams = {
      to_email: destinatario.trim(),            // no template do EmailJS use {{to_email}}
      nome_completo: nome.trim(),               // no template use {{nome_completo}}
      cpf: cpf.replace(/\D/g, ''),              // no template use {{cpf}}
      telefone: telefone.replace(/\D/g, ''),    // no template use {{telefone}}
    };

    emailjs
      .send(
        'service_zt8nmnp',       // <— Substitua pelo seu Service ID (ex.: 'service_abc123')
        'template_0udlgdk',      // <— Substitua pelo seu Template ID (ex.: 'template_xyz456')
        templateParams
        // Não é necessário passar o user ID aqui se você já chamou emailjs.init() no useEffect
      )
      .then((response) => {
        console.log('EmailJS success:', response.status, response.text);
        setMensagem('E-mail enviado com sucesso!');
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        // err.text costuma conter a descrição, mas às vezes só err.message
        const erroText = err.text || err.message || 'Tente novamente mais tarde.';
        setMensagem(`Falha no envio do e-mail: ${erroText}`);
      })
      .finally(() => {
        setEnviando(false);
      });
  };

  return (
    <div style={styles.container}>
      <h3>Enviar pedido por e-mail</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Nome completo:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          CPF:
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Telefone:
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 99999-8888"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Enviar para (e-mail):
          <input
            type="email"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            placeholder="fulano@exemplo.com"
            required
            style={styles.input}
          />
        </label>

        <button
          type="submit"
          disabled={enviando}
          style={{
            ...styles.button,
            cursor: enviando ? 'not-allowed' : 'pointer',
          }}
        >
          {enviando ? 'Enviando...' : 'Enviar E-mail'}
        </button>
      </form>

      {mensagem && (
        <div style={{ marginTop: 12, color: mensagem.startsWith('Falha') ? 'red' : 'green' }}>
          {mensagem}
        </div>
      )}
    </div>
  );
}

// ===== Estilos inline =====
const styles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    fontSize: 16,
    display: 'flex',
    flexDirection: 'column',
    color: '#333',
  },
  input: {
    padding: 8,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 4,
    marginTop: 4,
  },
  button: {
    padding: '12px 16px',
    backgroundColor: '#FE5A17',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    border: 'none',
    borderRadius: 6,
    marginTop: 10,
    transition: 'opacity 0.2s ease',
  },
};
