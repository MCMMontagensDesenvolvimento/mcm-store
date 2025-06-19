import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [carregandoContratados, setCarregandoContratados] = useState(false);

  // Ref para armazenar o Map de contratados (key → objeto contratado)
  const contratadosMapRef = useRef(null);
  // Ref para controlar se já está fazendo fetch
  const fetchingRef = useRef(false);

  /**
   * Carrega a lista de contratados UMA VEZ e monta um Map para busca rápida.
   * A chave do Map será `${ID}-${CPF}` (ambos sem pontuação).
   */
  async function inicializaMapaContratados() {
    // 1) Se já tiver sido carregado, retorna imediatamente
    if (contratadosMapRef.current) {
      return contratadosMapRef.current;
    }

    // 2) Se já está fazendo fetch, aguarda até terminar
    if (fetchingRef.current) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (contratadosMapRef.current) {
            clearInterval(checkInterval);
            resolve(contratadosMapRef.current);
          }
          if (!fetchingRef.current && !contratadosMapRef.current) {
            clearInterval(checkInterval);
            reject(new Error('Falha ao carregar contratados'));
          }
        }, 100);
      });
    }

    // 3) Se não estiver carregado, faz a requisição
    try {
      fetchingRef.current = true;
      setCarregandoContratados(true);

      console.log('[AuthContext] Iniciando carregamento dos contratados...');
      const resposta = await fetch('/api/apdata/contratados/ativos', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!resposta.ok) {
        // lança erro com status HTTP
        throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`);
      }

      const retornoBruto = await resposta.json();
      const listaContratados = Array.isArray(retornoBruto.data)
        ? retornoBruto.data
        : Array.isArray(retornoBruto)
        ? retornoBruto
        : [];

      console.log(
        `[AuthContext] ${listaContratados.length} contratados recebidos da API`
      );

      // 4) Monta o Map: chave = "ID-CPF", valor = objeto completo
      const novoMapa = new Map();
      listaContratados.forEach((contratado) => {
        try {
          const idContrato = contratado.CON_CdiContratado;
          const cpfContrato = contratado.CON_NusCICNumero;
          if (idContrato && cpfContrato) {
            const idNormalizado = String(idContrato).trim();
            const cpfNormalizado = String(cpfContrato).replace(/\D/g, '');
            if (idNormalizado && cpfNormalizado) {
              const chave = `${idNormalizado}-${cpfNormalizado}`;
              novoMapa.set(chave, contratado);
            }
          }
        } catch (err) {
          console.warn(
            '[AuthContext] Erro ao processar um contratado:',
            err
          );
        }
      });

      contratadosMapRef.current = novoMapa;
      console.log(
        `[AuthContext] Map inicializado com ${novoMapa.size} registros válidos`
      );
      return novoMapa;
    } catch (err) {
      console.error('[AuthContext] Erro ao carregar contratados:', err);
      throw err;
    } finally {
      fetchingRef.current = false;
      setCarregandoContratados(false);
    }
  }

  /**
   * Tenta autenticar pelo ID do contratado (CON_CdiContratado) e CPF (CON_NusCICNumero).
   * Lança exceções em todos os casos de falha:
   *   - ID ou CPF em branco → "ID e CPF são obrigatórios"
   *   - ID ou CPF inválido (após trim/digitos) → "ID e CPF devem ser válidos"
   *   - HTTP error → "HTTP XXX: texto"
   *   - Contratado não encontrado → "ID ou CPF incorreto"
   */
  async function login(idInput, cpfInput) {
    if (!idInput || !cpfInput) {
      throw new Error('ID e CPF são obrigatórios');
    }

    const idDigitado = String(idInput).trim();
    const cpfDigitado = String(cpfInput).replace(/\D/g, '');

    if (!idDigitado || !cpfDigitado) {
      throw new Error('ID e CPF devem ser válidos');
    }

    try {
      console.log(
        `[AuthContext] Tentando login com ID: ${idDigitado} e CPF: ${cpfDigitado.substring(
          0,
          3
        )}***`
      );

      // Garante que o Map esteja inicializado
      const mapa = await inicializaMapaContratados();
      const chaveProcurada = `${idDigitado}-${cpfDigitado}`;
      const encontrado = mapa.get(chaveProcurada);

      if (encontrado) {
        console.log('[AuthContext] Login bem-sucedido');
        setAutenticado(true);
        setUsuario(encontrado);
        try {
          localStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
        } catch (err) {
          console.warn('[AuthContext] Erro ao salvar no localStorage:', err);
        }
        return true;
      } else {
        console.log('[AuthContext] Credenciais não encontradas');
        // Em vez de "return false", lança um erro que será capturado em LoginPage
        throw new Error('ID ou CPF incorreto');
      }
    } catch (err) {
      console.error('[AuthContext] Erro durante login:', err);
      throw err;
    }
  }

  function logout() {
    console.log('[AuthContext] Fazendo logout');
    setAutenticado(false);
    setUsuario(null);
    try {
      localStorage.removeItem('usuarioLogado');
    } catch (err) {
      console.warn('[AuthContext] Erro ao limpar localStorage:', err);
    }
  }

  // Auto‐login ao montar: tenta recuperar sessão de localStorage
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem('usuarioLogado');
      if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);
        setUsuario(usuario);
        setAutenticado(true);
        console.log('[AuthContext] Sessão recuperada do localStorage');
      }
    } catch (err) {
      console.error('[AuthContext] Erro ao recuperar sessão:', err);
      localStorage.removeItem('usuarioLogado');
    }
  }, []);

  const value = {
    autenticado,
    usuario,
    carregandoContratados,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
