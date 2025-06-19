// src/pages/LoginPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { produtos } from '../data/produtos';

export default function LoginPage() {
  const [idInput, setIdInput] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login, carregandoContratados, autenticado } = useAuth();
  const navigate = useNavigate();

  // Se já estiver autenticado, redireciona para "/"
  useEffect(() => {
    if (autenticado) {
      navigate('/', { replace: true });
    }
  }, [autenticado, navigate]);

  // Máscara para CPF em tempo real
  const formatarCPF = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e) => {
    setCpfInput(formatarCPF(e.target.value));
  };

  // Validação em tempo real dos campos
  const validacao = useMemo(() => {
    const idValido = idInput.trim().length > 0;
    const cpfLimpo = cpfInput.replace(/\D/g, '');
    const cpfValido = cpfLimpo.length === 11;

    return {
      idValido,
      cpfValido,
      formularioValido: idValido && cpfValido,
      mensagemId: !idValido && idInput.length > 0 ? 'ID é obrigatório' : '',
      mensagemCpf:
        !cpfValido && cpfInput.length > 0 ? 'CPF deve ter 11 dígitos' : '',
    };
  }, [idInput, cpfInput]);

  // Quando o usuário submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // 1) Validação local
    if (!validacao.formularioValido) {
      setErro('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setCarregando(true);
    try {
      // 2) Tenta logar; se falhar, lança no AuthContext
      const sucesso = await login(idInput.trim(), cpfInput);

      if (!sucesso) {
        // Caso seu login retorne false em vez de lançar, trate aqui:
        setErro('ID ou CPF incorreto. Verifique e tente novamente.');
      }
      // Se logou com sucesso → o useEffect acima redireciona
    } catch (err) {
      console.error('[AuthContext] Erro durante login:', err);
      // 3) Exibe a mensagem exata da exceção
      const msg =
        err.message && err.message.length > 0
          ? err.message
          : 'Erro interno. Tente novamente mais tarde.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  // Limpa a mensagem de erro assim que o usuário modifica algum input
  useEffect(() => {
    if (erro && (idInput || cpfInput)) {
      setErro('');
    }
  }, [idInput, cpfInput, erro]);

  const desabilitarFormulario = carregando || carregandoContratados;

  // Prepara todas as URLs de imagens de produto para o slider de fundo
  const backgroundImages = useMemo(() => {
    const todasAsUrls = produtos.reduce((arr, p) => arr.concat(p.imagens), []);
    return [...todasAsUrls, ...todasAsUrls]; // duplica para efeito de loop
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* ===== Três Linhas de Slider de Fundo ===== */}
      <div style={styles.backgroundSlider}>
        {/* Linha 1 – rolagem lenta */}
        <div style={styles.sliderRow}>
          <div
            style={{
              ...styles.sliderTrack,
              animation: 'scroll 30s linear infinite',
            }}
          >
            {backgroundImages.map((srcImg, idx) => (
              <div key={`row1-${idx}`} style={styles.slideWrapper}>
                <img
                  src={srcImg}
                  alt={`Produto ${idx}`}
                  style={styles.sliderImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Linha 2 – rolagem média (reverse) */}
        <div style={styles.sliderRow}>
          <div
            style={{
              ...styles.sliderTrack,
              animation: 'scroll 20s linear infinite reverse',
            }}
          >
            {backgroundImages.map((srcImg, idx) => (
              <div key={`row2-${idx}`} style={styles.slideWrapper}>
                <img
                  src={srcImg}
                  alt={`Produto ${idx}`}
                  style={styles.sliderImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Linha 3 – rolagem mais rápida */}
        <div style={styles.sliderRow}>
          <div
            style={{
              ...styles.sliderTrack,
              animation: 'scroll 15s linear infinite',
            }}
          >
            {backgroundImages.map((srcImg, idx) => (
              <div key={`row3-${idx}`} style={styles.slideWrapper}>
                <img
                  src={srcImg}
                  alt={`Produto ${idx}`}
                  style={styles.sliderImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Card de Login Centralizado ===== */}
      <div style={styles.cardWrapper}>
        <img src="/img/logo_mcm.png" alt="Logo MCM" style={styles.logo} />
        <h2 style={styles.titulo}>MCM Store</h2>

        <form onSubmit={handleSubmit} style={styles.formStyle}>
          {/* Campo ID do Contratado */}
          <div style={styles.campoStyle}>
            <label htmlFor="idContratado" style={styles.labelStyle}>
              ID do Contratado:
            </label>
            <input
              id="idContratado"
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              style={{
                ...styles.inputStyle,
                borderColor: validacao.mensagemId ? '#e74c3c' : '#ddd',
              }}
              disabled={desabilitarFormulario}
              placeholder="Digite seu ID"
              autoComplete="username"
            />
            {validacao.mensagemId && (
              <span style={styles.mensagemErroStyle}>
                {validacao.mensagemId}
              </span>
            )}
          </div>

          {/* Campo CPF */}
          <div style={styles.campoStyle}>
            <label htmlFor="cpf" style={styles.labelStyle}>
              CPF:
            </label>
            <input
              id="cpf"
              type="text"
              value={cpfInput}
              onChange={handleCpfChange}
              style={{
                ...styles.inputStyle,
                borderColor: validacao.mensagemCpf ? '#e74c3c' : '#ddd',
              }}
              disabled={desabilitarFormulario}
              placeholder="000.000.000-00"
              maxLength={14}
              autoComplete="off"
            />
            {validacao.mensagemCpf && (
              <span style={styles.mensagemErroStyle}>
                {validacao.mensagemCpf}
              </span>
            )}
          </div>

          {/* ===== Aqui exibimos qualquer erro de login dentro do próprio card ===== */}
          {erro && (
            <div style={styles.erroStyle}>
              {erro}
            </div>
          )}

          {carregandoContratados && (
            <div style={styles.infoStyle}>
              <span style={styles.loadingSpinner}>⏳</span>
              Carregando dados do sistema...
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.botaoStyle,
              opacity:
                desabilitarFormulario || !validacao.formularioValido
                  ? 0.6
                  : 1,
              cursor:
                desabilitarFormulario || !validacao.formularioValido
                  ? 'not-allowed'
                  : 'pointer',
            }}
            disabled={desabilitarFormulario || !validacao.formularioValido}
          >
            {carregando ? (
              <>
                <span style={styles.loadingSpinner}>⏳</span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div style={styles.footerInfo}>
          <small style={styles.textoAjuda}>
            Precisa de ajuda? Entre em contato com o suporte.
          </small>
        </div>
      </div>
    </div>
  );
}

// ====== STYLES INLINE ======
const styles = {
  // Container que cobre toda a viewport
  pageContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#000',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },

  // Container para as três linhas de sliders
  backgroundSlider: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
    display: 'flex',
    flexDirection: 'column',
  },

  // Cada linha de slider ocupa 1/3 da altura da viewport
  sliderRow: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },

  // Track que se move horizontalmente dentro de cada linha
  sliderTrack: {
    display: 'flex',
    width: '200%', // duplicamos a largura para permitir loop
    height: '100%',
  },

  // Cada slide ocupa 20vw de largura (ou seja, 5 slides visíveis ao mesmo tempo)
  slideWrapper: {
    flex: '0 0 20vw',
    width: '20vw',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Exibe cada imagem inteira, sem cortar, ajustada ao slide
  sliderImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    opacity: 0.3,
  },

  // Card de login centralizado
  cardWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '360px',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    zIndex: 2, // acima do slider
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Logo dentro do card (certifique-se de ter /public/img/logo_mcm.png)
  logo: {
    width: '120px',
    marginBottom: '20px',
  },

  titulo: {
    color: '#333',
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },

  formStyle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  campoStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  labelStyle: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#555',
  },
  inputStyle: {
    padding: '12px 16px',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    backgroundColor: '#fff',
  },
  mensagemErroStyle: {
    fontSize: '0.85rem',
    color: '#e74c3c',
    marginTop: '4px',
  },
  erroStyle: {
    position: 'relative',
    zIndex: 3,               // garante que fique acima de tudo
    color: '#e74c3c',
    fontSize: '0.95rem',
    padding: '12px 16px',
    backgroundColor: '#fdf2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    textAlign: 'center',
    marginTop: '10px',
  },
  infoStyle: {
    color: '#3498db',
    fontSize: '0.95rem',
    padding: '12px 16px',
    backgroundColor: '#f0f8ff',
    border: '1px solid #bee5eb',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  loadingSpinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },

  botaoStyle: {
    padding: '14px 20px',
    backgroundColor: '#FE5A17',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    width: '100%',
  },

  footerInfo: {
    textAlign: 'center',
    marginTop: '20px',
  },
  textoAjuda: {
    color: '#888',
    fontSize: '0.85rem',
  },

  // Keyframes para animação do slider
  keyframes: `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `,
};

// Injeta os keyframes de animação no CSS em tempo de execução
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(styles.keyframes, styleSheet.cssRules.length);
