import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Building2, 
  Trees, 
  Castle, 
  Cake, 
  RotateCcw, 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  ArrowDownCircle,
  Trophy,
  Maximize2,
  Minimize2,
  Wind,
  AlertTriangle
} from 'lucide-react';

interface ThreeTactileBlocksGameProps {
  onTap: () => void;
  onComplete: () => void;
}

export type TipoDeBloco = 'edificio' | 'arvore' | 'castelo' | 'doces';

interface ConfiguracaoTema {
  id: TipoDeBloco;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  corPrimaria: string;
  corSecundaria: string;
  coresBlocos: number[];
  corChao: number;
}

const TEMAS_DISPONIVEIS: ConfiguracaoTema[] = [
  {
    id: 'edificio',
    titulo: 'Edifício Urbano',
    subtitulo: 'Prédios e Janelinhas',
    descricao: 'Construa andares residenciais coloridos com janelinhas aconchegantes.',
    icone: Building2,
    corPrimaria: '#2563EB',
    corSecundaria: '#DBEAFE',
    coresBlocos: [0x3B82F6, 0xEF4444, 0x10B981, 0xF59E0B, 0x8B5CF6],
    corChao: 0xCBD5E1,
  },
  {
    id: 'arvore',
    titulo: 'Floresta & Natureza',
    subtitulo: 'Torre Viva Verdejante',
    descricao: 'Empilhe copas e troncos suaves criando uma grande árvore vertical.',
    icone: Trees,
    corPrimaria: '#16A34A',
    corSecundaria: '#DCFCE7',
    coresBlocos: [0x10B981, 0x059669, 0x34D399, 0x047857, 0x6EE7B7],
    corChao: 0x84CC16,
  },
  {
    id: 'castelo',
    titulo: 'Castelo Real Mágico',
    subtitulo: 'Ameias e Pedras Nobres',
    descricao: 'Erga torres fortificadas com pedras antigas, torres e ameias mágicas.',
    icone: Castle,
    corPrimaria: '#9333EA',
    corSecundaria: '#F3E8FF',
    coresBlocos: [0x8B5CF6, 0x6D28D9, 0x94A3B8, 0x64748B, 0xA855F7],
    corChao: 0x475569,
  },
  {
    id: 'doces',
    titulo: 'Confeitaria de Bolos',
    subtitulo: 'Camadas Doces & Confeitos',
    descricao: 'Crie uma torre deliciosa com coberturas de chantilly e morangos.',
    icone: Cake,
    corPrimaria: '#E11D48',
    corSecundaria: '#FFE4E6',
    coresBlocos: [0xF43F5E, 0xFB7185, 0xFBBF24, 0x38BDF8, 0xEC4899],
    corChao: 0xFDE68A,
  },
];

export const ThreeTactileBlocksGame: React.FC<ThreeTactileBlocksGameProps> = ({
  onTap,
  onComplete,
}) => {
  // Estados da interface React
  const [faseJogo, setFaseJogo] = useState<'selecao' | 'contagem' | 'jogando' | 'queda_torre' | 'vitoria'>('selecao');
  const [temaEscolhido, setTemaEscolhido] = useState<TipoDeBloco>('edificio');
  const [segundosContagem, setSegundosContagem] = useState(3);
  const [alturaTorre, setAlturaTorre] = useState(0);
  const [pontosPrecisao, setPontosPrecisao] = useState(100);
  const [mensagemFeedback, setMensagemFeedback] = useState<string | null>(null);
  const [estaEmTelaCheia, setEstaEmTelaCheia] = useState(false);
  const [balancoVentoPercentual, setBalancoVentoPercentual] = useState(0);

  // Armazenamento estável de callbacks em Refs
  const onTapRef = useRef(onTap);
  useEffect(() => {
    onTapRef.current = onTap;
  }, [onTap]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Referência atômica da fase do jogo
  const faseJogoRef = useRef<'selecao' | 'contagem' | 'jogando' | 'queda_torre' | 'vitoria'>('selecao');
  useEffect(() => {
    faseJogoRef.current = faseJogo;
  }, [faseJogo]);

  // Referências DOM
  const containerPrincipalRef = useRef<HTMLDivElement>(null);
  const montagemRef = useRef<HTMLDivElement>(null);

  // Referências Three.js
  const cenaRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const renderizadorRef = useRef<THREE.WebGLRenderer | null>(null);
  const grupoTorreRef = useRef<THREE.Group | null>(null);
  const particulasRef = useRef<THREE.Points | null>(null);
  const grupoGuindasteVisualRef = useRef<THREE.Group | null>(null);
  const grupoGanchoRef = useRef<THREE.Group | null>(null);
  const garraEsquerdaRef = useRef<THREE.Mesh | null>(null);
  const garraDireitaRef = useRef<THREE.Mesh | null>(null);
  const ultimoBlocoMeshRef = useRef<THREE.Group | null>(null);

  // Referências de Física
  const frameAnimacaoRef = useRef<number | null>(null);
  const tempoInicioRef = useRef<number>(Date.now());
  const blocoSuspensoMeshRef = useRef<THREE.Group | null>(null);
  const cordaLinhaRef = useRef<THREE.Line | null>(null);
  const blocoCaindoRef = useRef<THREE.Group | null>(null);
  const estaCaindoRef = useRef<boolean>(false);
  const alturaAtualTorreRef = useRef<number>(0);
  const posicaoTopoRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const temaAtualRef = useRef<TipoDeBloco>('edificio');

  // Câmera dinâmica e Guindaste com recuo progressivo (Zoom-Out)
  const cameraYAlvoRef = useRef<number>(2.4);
  const cameraZAlvoRef = useRef<number>(8.5);
  const guindasteYAlvoRef = useRef<number>(4.8);

  // Queda vertical e dinâmica da torre
  const posicaoQuedaXRef = useRef<number>(0);
  const velocidadeQuedaVerticalRef = useRef<number>(0);
  const instabilidadeAcumuladaRef = useRef<number>(0);
  const estaCaindoTorreRef = useRef<boolean>(false);
  const velocidadeTombamentoTorreRef = useRef<number>(0);
  const direcaoTombamentoTorreRef = useRef<number>(1);

  // DIMENSÕES DOS OBJETOS REDUZIDAS EM 25% (ESCALA 0.75x)
  const LARGURA_BLOCO = 1.5;         // Antes: 2.0 -> 25% menor = 1.5
  const ALTURA_BLOCO = 0.75;         // Antes: 1.0 -> 25% menor = 0.75
  const PROFUNDIDADE_BLOCO = 1.5;    // Antes: 2.0 -> 25% menor = 1.5
  const RAIO_BASE_ESTREITA = 1.0;    // Antes: 1.35 -> 25% menor = ~1.0
  const COMPRIMENTO_CABO = 1.65;     // Antes: 2.2 -> 25% menor = 1.65

  // Limite máximo de instabilidade acumulada para a torre tombar
  const LIMITE_MAXIMO_INSTABILIDADE = 2.4;

  // Construtor estilizado do Mesh do bloco (escalado em 25% menor)
  const criarMeshDoBloco = useCallback((tema: TipoDeBloco, indiceAndar: number): THREE.Group => {
    const grupo = new THREE.Group();
    const configTema = TEMAS_DISPONIVEIS.find((item) => item.id === tema) || TEMAS_DISPONIVEIS[0];
    const corPrincipal = configTema.coresBlocos[indiceAndar % configTema.coresBlocos.length];

    if (tema === 'edificio') {
      const geometriaCorpo = new THREE.BoxGeometry(LARGURA_BLOCO, ALTURA_BLOCO, PROFUNDIDADE_BLOCO);
      const materialCorpo = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshCorpo = new THREE.Mesh(geometriaCorpo, materialCorpo);
      grupo.add(meshCorpo);

      const geometriaJanela = new THREE.BoxGeometry(0.26, 0.26, 0.04);
      const materialJanela = new THREE.MeshBasicMaterial({ color: 0xFFFDF0 });

      [-0.38, 0.38].forEach((posicaoHorizontal) => {
        const meshJanela = new THREE.Mesh(geometriaJanela, materialJanela);
        meshJanela.position.set(posicaoHorizontal, 0.08, PROFUNDIDADE_BLOCO / 2 + 0.02);
        grupo.add(meshJanela);
      });

      const geometriaBorda = new THREE.BoxGeometry(LARGURA_BLOCO + 0.08, 0.08, PROFUNDIDADE_BLOCO + 0.08);
      const materialBorda = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const meshBorda = new THREE.Mesh(geometriaBorda, materialBorda);
      meshBorda.position.y = ALTURA_BLOCO / 2;
      grupo.add(meshBorda);

    } else if (tema === 'arvore') {
      const geometriaTronco = new THREE.CylinderGeometry(0.3, 0.34, ALTURA_BLOCO, 16);
      const materialTronco = new THREE.MeshLambertMaterial({ color: 0x8B5A2B });
      const meshTronco = new THREE.Mesh(geometriaTronco, materialTronco);
      grupo.add(meshTronco);

      const geometriaFolhas = new THREE.CylinderGeometry(0.68, 0.94, 0.56, 12);
      const materialFolhas = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshFolhas = new THREE.Mesh(geometriaFolhas, materialFolhas);
      meshFolhas.position.y = 0.12;
      grupo.add(meshFolhas);

      const geometriaPequena = new THREE.SphereGeometry(0.22, 10, 10);
      const materialDetalhe = new THREE.MeshLambertMaterial({ color: 0xA7F3D0 });
      [-0.52, 0.52].forEach((posicaoHorizontal) => {
        const esfera = new THREE.Mesh(geometriaPequena, materialDetalhe);
        esfera.position.set(posicaoHorizontal, 0.08, 0);
        grupo.add(esfera);
      });

    } else if (tema === 'castelo') {
      const geometriaPedra = new THREE.BoxGeometry(LARGURA_BLOCO, ALTURA_BLOCO, PROFUNDIDADE_BLOCO);
      const materialPedra = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshPedra = new THREE.Mesh(geometriaPedra, materialPedra);
      grupo.add(meshPedra);

      const geometriaAmeia = new THREE.BoxGeometry(0.3, 0.26, 0.3);
      const materialAmeia = new THREE.MeshLambertMaterial({ color: 0x334155 });
      [
        [-0.56, -0.56],
        [0.56, -0.56],
        [-0.56, 0.56],
        [0.56, 0.56],
      ].forEach(([cantoX, cantoZ]) => {
        const ameia = new THREE.Mesh(geometriaAmeia, materialAmeia);
        ameia.position.set(cantoX, ALTURA_BLOCO / 2 + 0.11, cantoZ);
        grupo.add(ameia);
      });

      const geometriaPorta = new THREE.BoxGeometry(0.38, 0.45, 0.04);
      const materialPorta = new THREE.MeshLambertMaterial({ color: 0x1E293B });
      const meshPorta = new THREE.Mesh(geometriaPorta, materialPorta);
      meshPorta.position.set(0, -0.15, PROFUNDIDADE_BLOCO / 2 + 0.02);
      grupo.add(meshPorta);

    } else {
      const geometriaBolo = new THREE.CylinderGeometry(0.75, 0.82, ALTURA_BLOCO, 24);
      const materialBolo = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshBolo = new THREE.Mesh(geometriaBolo, materialBolo);
      grupo.add(meshBolo);

      const geometriaCobertura = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 24);
      const materialCobertura = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const meshCobertura = new THREE.Mesh(geometriaCobertura, materialCobertura);
      meshCobertura.position.y = ALTURA_BLOCO / 2;
      grupo.add(meshCobertura);

      const geometriaMorango = new THREE.SphereGeometry(0.15, 12, 12);
      const materialMorango = new THREE.MeshLambertMaterial({ color: 0xEF4444 });
      const meshMorango = new THREE.Mesh(geometriaMorango, materialMorango);
      meshMorango.position.set(0, ALTURA_BLOCO / 2 + 0.15, 0);
      grupo.add(meshMorango);
    }

    // Alça metálica no topo do bloco
    const geometriaAlca = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
    const materialAlca = new THREE.MeshLambertMaterial({ color: 0x4B5563 });
    const meshAlca = new THREE.Mesh(geometriaAlca, materialAlca);
    meshAlca.position.set(0, ALTURA_BLOCO / 2 + 0.11, 0);
    grupo.add(meshAlca);

    return grupo;
  }, []);

  // Efeito de partículas
  const criarEfeitoParticulas = useCallback((posicaoX: number, posicaoY: number, posicaoZ: number) => {
    if (!cenaRef.current) return;

    const quantidadeParticulas = 35;
    const geometria = new THREE.BufferGeometry();
    const posicoes = new Float32Array(quantidadeParticulas * 3);
    const velocidades: THREE.Vector3[] = [];

    for (let indice = 0; indice < quantidadeParticulas; indice++) {
      posicoes[indice * 3] = posicaoX + (Math.random() - 0.5) * 0.4;
      posicoes[indice * 3 + 1] = posicaoY + (Math.random() - 0.5) * 0.4;
      posicoes[indice * 3 + 2] = posicaoZ + (Math.random() - 0.5) * 0.4;

      velocidades.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.07,
          Math.random() * 0.07 + 0.03,
          (Math.random() - 0.5) * 0.07
        )
      );
    }

    geometria.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
    const material = new THREE.PointsMaterial({
      color: 0xF59E0B,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
    });

    const sistemaParticulas = new THREE.Points(geometria, material);
    cenaRef.current.add(sistemaParticulas);
    particulasRef.current = sistemaParticulas;

    let framesRestantes = 40;
    const animarParticulas = () => {
      if (framesRestantes <= 0) {
        if (cenaRef.current && sistemaParticulas) {
          cenaRef.current.remove(sistemaParticulas);
          geometria.dispose();
          material.dispose();
        }
        return;
      }

      framesRestantes--;
      const atributosPosicao = geometria.attributes.position as THREE.BufferAttribute;
      const arrayAtual = atributosPosicao.array as Float32Array;

      for (let indice = 0; indice < quantidadeParticulas; indice++) {
        arrayAtual[indice * 3] += velocidades[indice].x;
        arrayAtual[indice * 3 + 1] += velocidades[indice].y;
        arrayAtual[indice * 3 + 2] += velocidades[indice].z;
        velocidades[indice].y -= 0.002;
      }

      atributosPosicao.needsUpdate = true;
      material.opacity = framesRestantes / 40;
      requestAnimationFrame(animarParticulas);
    };

    animarParticulas();
  }, []);

  // Prepara o próximo bloco no guindaste
  const prepararProximoBloco = useCallback((tema: TipoDeBloco, alturaAndar: number) => {
    if (!cenaRef.current) return;

    if (blocoSuspensoMeshRef.current) {
      cenaRef.current.remove(blocoSuspensoMeshRef.current);
      blocoSuspensoMeshRef.current = null;
    }

    const novoBloco = criarMeshDoBloco(tema, alturaAndar);
    const alturaGuindaste = guindasteYAlvoRef.current;
    novoBloco.position.set(0, alturaGuindaste - COMPRIMENTO_CABO - 0.55, 0);

    cenaRef.current.add(novoBloco);
    blocoSuspensoMeshRef.current = novoBloco;
    estaCaindoRef.current = false;
    blocoCaindoRef.current = null;
    velocidadeQuedaVerticalRef.current = 0;

    if (garraEsquerdaRef.current && garraDireitaRef.current) {
      garraEsquerdaRef.current.rotation.z = 0;
      garraDireitaRef.current.rotation.z = 0;
    }
  }, [criarMeshDoBloco, COMPRIMENTO_CABO]);

  // Soltura vertical pura
  const executarSoltarBloco = useCallback(() => {
    if (faseJogoRef.current !== 'jogando' || estaCaindoRef.current || !blocoSuspensoMeshRef.current) {
      return;
    }

    onTapRef.current();

    const bloco = blocoSuspensoMeshRef.current;
    estaCaindoRef.current = true;
    blocoCaindoRef.current = bloco;
    blocoSuspensoMeshRef.current = null;

    // Trava a coordenada horizontal no ponto da soltura para queda estritamente vertical
    posicaoQuedaXRef.current = bloco.position.x;
    velocidadeQuedaVerticalRef.current = 0.01;
    bloco.rotation.z = 0;

    if (garraEsquerdaRef.current && garraDireitaRef.current) {
      garraEsquerdaRef.current.rotation.z = 0.45;
      garraDireitaRef.current.rotation.z = -0.45;
    }
  }, []);

  const executarSoltarBlocoRef = useRef(executarSoltarBloco);
  useEffect(() => {
    executarSoltarBlocoRef.current = executarSoltarBloco;
  }, [executarSoltarBloco]);

  // Contagem regressiva
  const executarIniciarComContagem = useCallback((tema: TipoDeBloco) => {
    setTemaEscolhido(tema);
    temaAtualRef.current = tema;
    setFaseJogo('contagem');
    faseJogoRef.current = 'contagem';
    setSegundosContagem(3);
    setMensagemFeedback(null);
    instabilidadeAcumuladaRef.current = 0;
    estaCaindoTorreRef.current = false;

    prepararProximoBloco(tema, 0);
  }, [prepararProximoBloco]);

  useEffect(() => {
    if (faseJogo !== 'contagem') return;

    if (segundosContagem > 1) {
      const temporizador = setTimeout(() => {
        setSegundosContagem((valorAnterior) => valorAnterior - 1);
      }, 1000);
      return () => clearTimeout(temporizador);
    } else {
      const temporizadorFinal = setTimeout(() => {
        setFaseJogo('jogando');
        faseJogoRef.current = 'jogando';
        setAlturaTorre(0);
        alturaAtualTorreRef.current = 0;
        posicaoTopoRef.current = { x: 0, z: 0 };
        instabilidadeAcumuladaRef.current = 0;
        estaCaindoTorreRef.current = false;
        ultimoBlocoMeshRef.current = null;

        cameraYAlvoRef.current = 2.4;
        cameraZAlvoRef.current = 8.5;
        guindasteYAlvoRef.current = 4.8;

        if (cameraRef.current) {
          cameraRef.current.position.set(0, 2.4, 8.5);
          cameraRef.current.lookAt(0, 1.4, 0);
        }

        if (grupoTorreRef.current) {
          while (grupoTorreRef.current.children.length > 0) {
            grupoTorreRef.current.remove(grupoTorreRef.current.children[0]);
          }
          grupoTorreRef.current.rotation.z = 0;
          grupoTorreRef.current.position.set(0, 0, 0);
        }

        prepararProximoBloco(temaAtualRef.current, 0);
      }, 1000);
      return () => clearTimeout(temporizadorFinal);
    }
  }, [faseJogo, segundosContagem, prepararProximoBloco]);

  // Teclado
  useEffect(() => {
    const tratarTeclado = (evento: KeyboardEvent) => {
      if (evento.code === 'Space' || evento.key === ' ' || evento.code === 'Enter') {
        evento.preventDefault();
        executarSoltarBlocoRef.current();
      }
    };

    window.addEventListener('keydown', tratarTeclado);
    return () => {
      window.removeEventListener('keydown', tratarTeclado);
    };
  }, []);

  // Reiniciar
  const executarReiniciar = useCallback(() => {
    if (grupoTorreRef.current) {
      while (grupoTorreRef.current.children.length > 0) {
        grupoTorreRef.current.remove(grupoTorreRef.current.children[0]);
      }
      grupoTorreRef.current.rotation.z = 0;
      grupoTorreRef.current.position.set(0, 0, 0);
    }

    alturaAtualTorreRef.current = 0;
    posicaoTopoRef.current = { x: 0, z: 0 };
    instabilidadeAcumuladaRef.current = 0;
    estaCaindoTorreRef.current = false;
    velocidadeTombamentoTorreRef.current = 0;
    ultimoBlocoMeshRef.current = null;

    setFaseJogo('jogando');
    faseJogoRef.current = 'jogando';
    setAlturaTorre(0);
    setPontosPrecisao(100);
    setMensagemFeedback(null);
    setBalancoVentoPercentual(0);

    cameraYAlvoRef.current = 2.4;
    cameraZAlvoRef.current = 8.5;
    guindasteYAlvoRef.current = 4.8;

    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2.4, 8.5);
      cameraRef.current.lookAt(0, 1.4, 0);
    }

    prepararProximoBloco(temaAtualRef.current, 0);
  }, [prepararProximoBloco]);

  // Voltar para seleção
  const executarVoltarSelecao = useCallback(() => {
    setFaseJogo('selecao');
    faseJogoRef.current = 'selecao';
    setMensagemFeedback(null);
    setBalancoVentoPercentual(0);
    instabilidadeAcumuladaRef.current = 0;
    estaCaindoTorreRef.current = false;
    ultimoBlocoMeshRef.current = null;

    if (grupoTorreRef.current) {
      while (grupoTorreRef.current.children.length > 0) {
        grupoTorreRef.current.remove(grupoTorreRef.current.children[0]);
      }
      grupoTorreRef.current.rotation.z = 0;
      grupoTorreRef.current.position.set(0, 0, 0);
    }
    if (blocoSuspensoMeshRef.current && cenaRef.current) {
      cenaRef.current.remove(blocoSuspensoMeshRef.current);
      blocoSuspensoMeshRef.current = null;
    }
  }, []);

  // Tela Cheia
  const executarAlternarTelaCheia = useCallback(() => {
    const container = containerPrincipalRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          setEstaEmTelaCheia(true);
        });
      } else {
        setEstaEmTelaCheia(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setEstaEmTelaCheia(false);
    }
  }, []);

  useEffect(() => {
    const tratarMudancaFullscreen = () => {
      setEstaEmTelaCheia(Boolean(document.fullscreenElement));
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    document.addEventListener('fullscreenchange', tratarMudancaFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', tratarMudancaFullscreen);
    };
  }, []);

  // INICIALIZAÇÃO DA CENA THREE.JS
  useEffect(() => {
    const elementoContainer = montagemRef.current;
    if (!elementoContainer) return;

    const largura = elementoContainer.clientWidth || 800;
    const altura = elementoContainer.clientHeight || 550;

    // 1. Cena
    const cena = new THREE.Scene();
    cena.background = new THREE.Color(0xF4F1EA);
    cenaRef.current = cena;

    // 2. Câmera Perspectiva
    const camera = new THREE.PerspectiveCamera(45, largura / altura, 0.1, 100);
    camera.position.set(0, 2.4, 8.5);
    camera.lookAt(0, 1.4, 0);
    cameraRef.current = camera;

    // 3. Renderizador WebGL
    const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderizador.setSize(largura, altura);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderizadorRef.current = renderizador;

    while (elementoContainer.firstChild) {
      elementoContainer.removeChild(elementoContainer.firstChild);
    }
    elementoContainer.appendChild(renderizador.domElement);

    const domCanvas = renderizador.domElement;
    domCanvas.style.touchAction = 'none';
    const dispararCliqueCanvas = (evento: Event) => {
      evento.preventDefault();
      executarSoltarBlocoRef.current();
    };
    domCanvas.addEventListener('pointerdown', dispararCliqueCanvas);

    // 4. Iluminação
    const luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 1.4);
    cena.add(luzAmbiente);

    const luzDirecional = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    luzDirecional.position.set(5, 10, 7);
    cena.add(luzDirecional);

    const luzHemisferio = new THREE.HemisphereLight(0xFFFFFF, 0xE2E8F0, 0.7);
    cena.add(luzHemisferio);

    // 5. Chão / Base Estreita (25% menor)
    const geometriaBase = new THREE.CylinderGeometry(RAIO_BASE_ESTREITA, RAIO_BASE_ESTREITA + 0.25, 0.38, 32);
    const materialBase = new THREE.MeshLambertMaterial({ color: 0xDDD3C4 });
    const meshBase = new THREE.Mesh(geometriaBase, materialBase);
    meshBase.position.y = -0.19;
    cena.add(meshBase);

    const geometriaAnel = new THREE.TorusGeometry(RAIO_BASE_ESTREITA + 0.04, 0.05, 16, 48);
    const materialAnel = new THREE.MeshBasicMaterial({ color: 0xC8BCAF });
    const meshAnel = new THREE.Mesh(geometriaAnel, materialAnel);
    meshAnel.rotation.x = Math.PI / 2;
    meshAnel.position.y = 0.01;
    cena.add(meshAnel);

    const geometriaChaoFundo = new THREE.PlaneGeometry(60, 60);
    const materialChaoFundo = new THREE.MeshBasicMaterial({ color: 0xEDE7DF });
    const meshChaoFundo = new THREE.Mesh(geometriaChaoFundo, materialChaoFundo);
    meshChaoFundo.rotation.x = -Math.PI / 2;
    meshChaoFundo.position.y = -2.0;
    cena.add(meshChaoFundo);

    // 6. Grupo da Torre
    const grupoTorre = new THREE.Group();
    grupoTorre.position.set(0, 0, 0);
    cena.add(grupoTorre);
    grupoTorreRef.current = grupoTorre;

    // 7. Cabo do Guindaste
    const materialLinha = new THREE.LineBasicMaterial({ color: 0x374151, linewidth: 2 });
    const geometriaLinha = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 4.8, 0),
      new THREE.Vector3(0, 3.15, 0),
    ]);
    const cordaLinha = new THREE.Line(geometriaLinha, materialLinha);
    cena.add(cordaLinha);
    cordaLinhaRef.current = cordaLinha;

    // 8. Braço do Guindaste (25% menor)
    const grupoGuindasteVisual = new THREE.Group();
    const geometriaBraco = new THREE.BoxGeometry(5.25, 0.18, 0.18);
    const materialBraco = new THREE.MeshLambertMaterial({ color: 0xF59E0B });
    const meshBraco = new THREE.Mesh(geometriaBraco, materialBraco);
    grupoGuindasteVisual.add(meshBraco);

    const geometriaCabine = new THREE.BoxGeometry(0.6, 0.45, 0.45);
    const materialCabine = new THREE.MeshLambertMaterial({ color: 0xD97706 });
    const meshCabine = new THREE.Mesh(geometriaCabine, materialCabine);
    meshCabine.position.set(-1.8, 0.25, 0);
    grupoGuindasteVisual.add(meshCabine);

    const geometriaRoldana = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 20);
    const materialRoldana = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const meshRoldana = new THREE.Mesh(geometriaRoldana, materialRoldana);
    meshRoldana.rotation.z = Math.PI / 2;
    grupoGuindasteVisual.add(meshRoldana);

    grupoGuindasteVisual.position.y = 4.8 + 0.15;
    cena.add(grupoGuindasteVisual);
    grupoGuindasteVisualRef.current = grupoGuindasteVisual;

    // 9. Gancho Mecânico Articulado
    const grupoGancho = new THREE.Group();
    const geometriaGanchoCentral = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 12);
    const materialGancho = new THREE.MeshLambertMaterial({ color: 0x2C3E50 });
    const meshGanchoCentral = new THREE.Mesh(geometriaGanchoCentral, materialGancho);
    grupoGancho.add(meshGanchoCentral);

    const geometriaGarra = new THREE.BoxGeometry(0.06, 0.26, 0.12);
    const garraEsquerda = new THREE.Mesh(geometriaGarra, materialGancho);
    garraEsquerda.position.set(-0.2, -0.1, 0);
    grupoGancho.add(garraEsquerda);
    garraEsquerdaRef.current = garraEsquerda;

    const garraDireita = new THREE.Mesh(geometriaGarra, materialGancho);
    garraDireita.position.set(0.2, -0.1, 0);
    grupoGancho.add(garraDireita);
    garraDireitaRef.current = garraDireita;

    cena.add(grupoGancho);
    grupoGanchoRef.current = grupoGancho;

    // 10. Bloco inicial
    prepararProximoBloco(temaAtualRef.current, 0);

    // 11. Loop Principal de Animação e Física
    const animar = () => {
      frameAnimacaoRef.current = requestAnimationFrame(animar);

      const tempoAtual = (Date.now() - tempoInicioRef.current) * 0.001;

      // Movimentação vertical do guindaste
      if (grupoGuindasteVisualRef.current) {
        grupoGuindasteVisualRef.current.position.y = guindasteYAlvoRef.current + 0.15;
      }

      const alturaTopoGuindaste = guindasteYAlvoRef.current;

      // 1. MOVIMENTO PENDULAR DO BLOCO SUSPENSO
      const velocidadeOscilacao = 1.9;
      const amplitudeAngulo = 0.82;
      const anguloPendulo = Math.sin(tempoAtual * velocidadeOscilacao) * amplitudeAngulo;

      const posicaoBalancoX = Math.sin(anguloPendulo) * COMPRIMENTO_CABO;
      const alturaGanchoSuspenso = alturaTopoGuindaste - Math.cos(anguloPendulo) * COMPRIMENTO_CABO;

      if (grupoGanchoRef.current) {
        if (!estaCaindoRef.current) {
          grupoGanchoRef.current.position.set(posicaoBalancoX, alturaGanchoSuspenso, 0);
          grupoGanchoRef.current.rotation.z = -anguloPendulo;
        } else {
          grupoGanchoRef.current.position.y += (alturaTopoGuindaste - 0.3 - grupoGanchoRef.current.position.y) * 0.1;
        }
      }

      // Cabo do guindaste
      if (cordaLinhaRef.current && grupoGanchoRef.current) {
        const posicoesCorda = new Float32Array([
          0, alturaTopoGuindaste, 0,
          grupoGanchoRef.current.position.x, grupoGanchoRef.current.position.y + 0.1, 0,
        ]);
        cordaLinhaRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(posicoesCorda, 3));
        cordaLinhaRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Bloco preso ao guindaste
      if (blocoSuspensoMeshRef.current && !estaCaindoRef.current) {
        blocoSuspensoMeshRef.current.position.set(
          posicaoBalancoX - Math.sin(anguloPendulo) * 0.55,
          alturaGanchoSuspenso - Math.cos(anguloPendulo) * 0.55,
          0
        );
        blocoSuspensoMeshRef.current.rotation.z = -anguloPendulo;
      }

      // 2. OSCILAÇÃO HARMÔNICA E QUEDA DA TORRE POR VENTO/INSTABILIDADE
      if (grupoTorreRef.current) {
        if (estaCaindoTorreRef.current) {
          // A TORRE ULTRAPASSOU O LIMITE E TOMBOU!
          velocidadeTombamentoTorreRef.current += 0.008;
          grupoTorreRef.current.rotation.z += direcaoTombamentoTorreRef.current * velocidadeTombamentoTorreRef.current;
          grupoTorreRef.current.position.y -= velocidadeTombamentoTorreRef.current * 0.4;
        } else {
          // Balanço normal pelo vento proporcional à instabilidade acumulada
          const desalinhamentoTotal = instabilidadeAcumuladaRef.current;
          const totalAndares = alturaAtualTorreRef.current;

          // Proporção de instabilidade (0 a 1)
          const fatorInstabilidade = Math.min(1.0, desalinhamentoTotal / LIMITE_MAXIMO_INSTABILIDADE);
          const percentualInstabilidade = Math.round(fatorInstabilidade * 100);
          setBalancoVentoPercentual(percentualInstabilidade);

          // Se passar de 100% (ultrapassou o limite máximo), a torre TOMBA!
          if (desalinhamentoTotal >= LIMITE_MAXIMO_INSTABILIDADE && totalAndares > 1) {
            estaCaindoTorreRef.current = true;
            direcaoTombamentoTorreRef.current = posicaoTopoRef.current.x >= 0 ? -1 : 1;
            velocidadeTombamentoTorreRef.current = 0.02;
            setFaseJogo('queda_torre');
            faseJogoRef.current = 'queda_torre';
          } else {
            // Amplitude do vento limitada
            const amplitudeVento = 0.004 + (fatorInstabilidade * 0.12) + (totalAndares * 0.002);
            const anguloSway = Math.sin(tempoAtual * 1.8) * amplitudeVento;
            grupoTorreRef.current.rotation.z = anguloSway;
          }
        }
      }

      // 3. QUEDA LIVRE PURAMENTE VERTICAL
      if (blocoCaindoRef.current && estaCaindoRef.current) {
        const bloco = blocoCaindoRef.current;

        // Posição X rigorosamente constante (queda vertical pura)
        bloco.position.x = posicaoQuedaXRef.current;
        bloco.rotation.z = 0;

        // Aceleração constante
        velocidadeQuedaVerticalRef.current += 0.012;
        bloco.position.y -= velocidadeQuedaVerticalRef.current;

        // Posição do topo em coordenadas de mundo
        let centroAlvoMundoX = 0;
        let alturaAlvoMundoY = 0.38; // Topo da base

        if (alturaAtualTorreRef.current > 0 && ultimoBlocoMeshRef.current) {
          const vetorPosicaoMundo = new THREE.Vector3();
          ultimoBlocoMeshRef.current.getWorldPosition(vetorPosicaoMundo);
          centroAlvoMundoX = vetorPosicaoMundo.x;
          alturaAlvoMundoY = vetorPosicaoMundo.y + ALTURA_BLOCO;
        }

        // Colisão com a superfície imediatamente inferior
        if (bloco.position.y <= alturaAlvoMundoY) {
          bloco.position.y = alturaAlvoMundoY;

          const deslocamentoMundo = bloco.position.x - centroAlvoMundoX;
          const diferencaDistancia = Math.abs(deslocamentoMundo);

          // Margem mínima de contato (15% de sobreposição)
          const limiteApoioMinimo = alturaAtualTorreRef.current === 0 
            ? RAIO_BASE_ESTREITA * 0.85 
            : LARGURA_BLOCO * 0.85;

          if (diferencaDistancia <= limiteApoioMinimo) {
            // ENCAIXE VÁLIDO: O bloco gruda à torre permanentemente
            const encaixePerfeito = diferencaDistancia < 0.2;

            if (encaixePerfeito) {
              setMensagemFeedback('Perfeito! Alinhamento 100%!');
              criarEfeitoParticulas(bloco.position.x, alturaAlvoMundoY + ALTURA_BLOCO / 2, 0);
            } else if (diferencaDistancia < 0.5) {
              setMensagemFeedback('Muito bom! Torre crescendo!');
            } else {
              setMensagemFeedback('Belo encaixe! A torre balança no vento!');
            }

            // Gruda o bloco ao grupo da torre
            if (grupoTorreRef.current) {
              grupoTorreRef.current.worldToLocal(bloco.position);
              bloco.rotation.z = 0;
              grupoTorreRef.current.add(bloco);
              ultimoBlocoMeshRef.current = bloco;
            }

            // Squash & stretch de impacto
            bloco.scale.set(1.06, 0.88, 1.06);
            let framesDeformacao = 6;
            const restaurarEscala = () => {
              if (framesDeformacao <= 0) {
                bloco.scale.set(1, 1, 1);
                return;
              }
              framesDeformacao--;
              bloco.scale.y += (1 - bloco.scale.y) * 0.35;
              bloco.scale.x += (1 - bloco.scale.x) * 0.35;
              bloco.scale.z += (1 - bloco.scale.z) * 0.35;
              requestAnimationFrame(restaurarEscala);
            };
            restaurarEscala();

            const novoAndar = alturaAtualTorreRef.current + 1;
            alturaAtualTorreRef.current = novoAndar;
            setAlturaTorre(novoAndar);
            posicaoTopoRef.current = { x: bloco.position.x, z: 0 };

            // Acumula instabilidade gerada pelo desalinhamento
            instabilidadeAcumuladaRef.current += diferencaDistancia;

            // Pontuação de precisão
            setPontosPrecisao((precisaoAnterior) => {
              const precisaoDesteBloco = Math.max(50, Math.round(100 - (diferencaDistancia / limiteApoioMinimo) * 45));
              return Math.round((precisaoAnterior * (novoAndar - 1) + precisaoDesteBloco) / novoAndar);
            });

            // DESAPROXIMAÇÃO DA CÂMERA (ZOOM-OUT):
            // Garante que pelo menos 5 andares da torre + o guindaste e o próximo bloco fiquem sempre visíveis!
            cameraZAlvoRef.current = 8.5 + Math.min(novoAndar, 15) * 0.32;
            cameraYAlvoRef.current = Math.max(2.4, 0.8 + novoAndar * ALTURA_BLOCO);
            guindasteYAlvoRef.current = 4.8 + novoAndar * ALTURA_BLOCO;

            if (novoAndar >= 10) {
              onCompleteRef.current();
            }

            estaCaindoRef.current = false;
            blocoCaindoRef.current = null;
            setTimeout(() => {
              prepararProximoBloco(temaAtualRef.current, novoAndar);
            }, 350);

          } else {
            // ERROU O BLOCO (Cai no abismo)
            setMensagemFeedback('Passou direto! Tente o próximo andar com calma.');
            
            const blocoQueda = bloco;
            estaCaindoRef.current = false;
            blocoCaindoRef.current = null;

            const animarQuedaAbismo = () => {
              if (blocoQueda.position.y < -12.0 || !cenaRef.current) {
                if (cenaRef.current && blocoQueda) {
                  cenaRef.current.remove(blocoQueda);
                }
                return;
              }
              blocoQueda.position.y -= 0.18;
              requestAnimationFrame(animarQuedaAbismo);
            };
            animarQuedaAbismo();

            setTimeout(() => {
              prepararProximoBloco(temaAtualRef.current, alturaAtualTorreRef.current);
            }, 500);
          }
        }
      }

      // 4. INTERPOLAÇÃO SUAVE DA CÂMERA (Y E Z PARA ZOOM-OUT PANORÂMICO)
      if (cameraRef.current) {
        cameraRef.current.position.y += (cameraYAlvoRef.current - cameraRef.current.position.y) * 0.05;
        cameraRef.current.position.z += (cameraZAlvoRef.current - cameraRef.current.position.z) * 0.05;
        cameraRef.current.lookAt(0, cameraRef.current.position.y - 0.8, 0);
      }

      renderizador.render(cena, camera);
    };

    animar();

    // ResizeObserver
    const observador = new ResizeObserver((entradas) => {
      for (const entrada of entradas) {
        const { width: novaLargura, height: novaAltura } = entrada.contentRect;
        if (novaLargura > 0 && novaAltura > 0 && cameraRef.current && renderizadorRef.current) {
          cameraRef.current.aspect = novaLargura / novaAltura;
          cameraRef.current.updateProjectionMatrix();
          renderizadorRef.current.setSize(novaLargura, novaAltura);
        }
      }
    });

    observador.observe(elementoContainer);

    return () => {
      observador.disconnect();
      domCanvas.removeEventListener('pointerdown', dispararCliqueCanvas);
      if (frameAnimacaoRef.current) {
        cancelAnimationFrame(frameAnimacaoRef.current);
      }
      if (elementoContainer.contains(renderizador.domElement)) {
        elementoContainer.removeChild(renderizador.domElement);
      }
      renderizador.dispose();
    };
  }, [prepararProximoBloco, criarEfeitoParticulas, COMPRIMENTO_CABO, RAIO_BASE_ESTREITA, LARGURA_BLOCO, ALTURA_BLOCO]);

  const temaAtualConfig = TEMAS_DISPONIVEIS.find((item) => item.id === temaEscolhido) || TEMAS_DISPONIVEIS[0];

  return (
    <div
      ref={containerPrincipalRef}
      className={`w-full transition-all duration-300 flex flex-col justify-between select-none ${
        estaEmTelaCheia
          ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-[#FCFBF9] h-screen w-screen max-w-none rounded-none'
          : 'max-w-5xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs min-h-[640px]'
      }`}
    >
      
      {/* Cabeçalho do Jogo */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#EDE4DA]">
        <div>
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#3E8EBF] bg-[#D4ECF9] px-2.5 py-0.5 rounded-full inline-block mb-1">
            Oficina Sensorial 3D • Estilo City Bloxx
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] flex items-center gap-2">
            Torre Tridimensional com Guindaste
          </h2>
        </div>

        {/* Botões de Ação do Cabeçalho */}
        <div className="flex items-center gap-2">
          {(faseJogo === 'jogando' || faseJogo === 'queda_torre') && (
            <>
              <button
                onClick={executarReiniciar}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F3EE] hover:bg-[#EDE4DA] text-xs font-bold text-[#1E293B] border border-[#EDE4DA] transition-all cursor-pointer"
                title="Recomeçar torre do início"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#3E8EBF]" />
                <span className="hidden sm:inline">Recomeçar</span>
              </button>

              <button
                onClick={executarVoltarSelecao}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDE7F6] hover:bg-[#D1C4E9] text-xs font-bold text-[#5E35B1] border border-[#D1C4E9] transition-all cursor-pointer"
                title="Mudar o tema dos blocos"
              >
                <Palette className="w-3.5 h-3.5 text-[#5E35B1]" />
                <span className="hidden sm:inline">Trocar Tema</span>
              </button>
            </>
          )}

          {/* Botão de Tela Cheia */}
          <button
            onClick={executarAlternarTelaCheia}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F8F2] hover:bg-[#A8E6CF] text-xs font-bold text-[#2D6A4F] border border-[#A8E6CF] transition-all cursor-pointer"
            title={estaEmTelaCheia ? 'Sair da tela cheia' : 'Abrir em tela cheia'}
          >
            {estaEmTelaCheia ? (
              <>
                <Minimize2 className="w-4 h-4 text-[#2D6A4F]" />
                <span className="hidden sm:inline">Restaurar</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-[#2D6A4F]" />
                <span className="hidden sm:inline">Tela Cheia</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Painel de Estatísticas Superior com Barra de Vento / Estabilidade */}
      {(faseJogo === 'jogando' || faseJogo === 'queda_torre') && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-3.5 py-2.5 bg-[#F7F3EE] rounded-2xl border border-[#EDE4DA] text-xs font-bold text-[#475569] my-2">
          <div className="flex items-center gap-2">
            <span className="text-[#64748B]">Tema:</span>
            <span className="text-[#1E293B] flex items-center gap-1.5">
              <temaAtualConfig.icone className="w-4 h-4" style={{ color: temaAtualConfig.corPrimaria }} />
              {temaAtualConfig.titulo}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-[#2D6A4F]">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-sm">Andares: {alturaTorre}</span>
            </div>

            {/* Barra Visual de Instabilidade no Vento com Alerta de Risco */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[#64748B]">
                <Wind className="w-3.5 h-3.5 text-[#3E8EBF]" />
                <span>Vento:</span>
              </div>
              <div className="w-24 sm:w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden p-0.5 border border-[#EDE4DA]">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    balancoVentoPercentual > 75 
                      ? 'bg-rose-500 animate-pulse' 
                      : balancoVentoPercentual > 45 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, balancoVentoPercentual))}%` }}
                />
              </div>
              <span className={`text-[11px] font-black ${
                balancoVentoPercentual > 75 ? 'text-rose-600' : 'text-[#475569]'
              }`}>
                {balancoVentoPercentual}%
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[#3E8EBF]">
              <Sparkles className="w-4 h-4 text-[#3E8EBF]" />
              <span className="text-sm">Precisão: {pontosPrecisao}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Área Principal do Jogo com Canvas Three.js */}
      <div className="w-full flex-1 flex flex-col relative my-1 min-h-0">
        
        {/* Contêiner do Canvas WebGL 3D */}
        <div
          className={`w-full rounded-3xl overflow-hidden border-2 border-[#EDE4DA] shadow-inner bg-[#F4F1EA] relative cursor-pointer touch-none ${
            estaEmTelaCheia ? 'flex-1 h-full min-h-[60vh]' : 'h-[460px] sm:h-[540px] lg:h-[580px]'
          }`}
          onPointerDown={() => {
            if (faseJogoRef.current === 'jogando') {
              executarSoltarBlocoRef.current();
            }
          }}
          style={{ touchAction: 'none' }}
        >
          {/* DIV montada do Three.js */}
          <div ref={montagemRef} className="w-full h-full" />

          {/* OVERLAY 1: TELA DE SELEÇÃO DE TEMA */}
          {faseJogo === 'selecao' && (
            <div className="absolute inset-0 bg-[#FCFBF9]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
              <div className="text-center max-w-lg mb-6">
                <span className="text-xs font-bold text-[#2D6A4F] bg-[#E8F8F2] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                  Escolha o seu Estilo
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
                  Qual tipo de bloco você quer empilhar?
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                  Toque no modelo desejado. O jogo iniciará após a contagem de 3 segundos!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {TEMAS_DISPONIVEIS.map((tema) => {
                  const IconeTema = tema.icone;
                  return (
                    <button
                      key={tema.id}
                      onClick={() => executarIniciarComContagem(tema.id)}
                      className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-[#EDE4DA] bg-white hover:border-[#3E8EBF] hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: tema.corSecundaria }}
                      >
                        <IconeTema className="w-7 h-7" style={{ color: tema.corPrimaria }} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block">
                          {tema.subtitulo}
                        </span>
                        <h4 className="text-base font-bold text-[#1E293B] group-hover:text-[#3E8EBF] transition-colors">
                          {tema.titulo}
                        </h4>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                          {tema.descricao}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* OVERLAY 2: CONTAGEM REGRESSIVA DE 3 SEGUNDOS */}
          {faseJogo === 'contagem' && (
            <div className="absolute inset-0 bg-[#1E293B]/35 backdrop-blur-xs flex flex-col items-center justify-center z-20 animate-fade-in pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-[#3E8EBF] animate-pulse">
                <span className="text-6xl font-black text-[#1E293B]">
                  {segundosContagem}
                </span>
              </div>
              <p className="text-white font-extrabold text-base sm:text-lg mt-4 tracking-wide drop-shadow-md">
                Preparando o guindaste...
              </p>
            </div>
          )}

          {/* OVERLAY 3: QUEDA DA TORRE POR VENTO EXCESSIVO */}
          {faseJogo === 'queda_torre' && (
            <div className="absolute inset-0 bg-[#1E293B]/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 animate-fade-in text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 animate-bounce" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                A Torre Balançou Demais e Tombou!
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 mt-2 max-w-md leading-relaxed">
                O vento acumulou muita instabilidade lateral devido aos andares desalinhados.
                Tente empilhar os blocos mais próximos do centro!
              </p>
              
              <div className="flex items-center gap-4 mt-4 bg-white/10 px-4 py-2 rounded-xl text-white text-xs font-bold">
                <span>Andares atingidos: {alturaTorre}</span>
                <span>•</span>
                <span>Precisão: {pontosPrecisao}%</span>
              </div>

              <button
                onClick={executarReiniciar}
                className="mt-6 py-3.5 px-8 rounded-2xl bg-[#2D6A4F] hover:bg-[#24543F] text-white font-black text-sm tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer border-b-4 border-[#1B4332] active:scale-98"
              >
                RECONSTRUIR TORRE COM CALMA
              </button>
            </div>
          )}

          {/* MENSAGEM FLUTUANTE DE FEEDBACK TRANQUILIZADOR */}
          {mensagemFeedback && faseJogo === 'jogando' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 px-5 py-2.5 rounded-2xl border border-[#EDE4DA] shadow-md text-xs sm:text-sm font-extrabold text-[#1E293B] flex items-center gap-2 pointer-events-none z-10 animate-fade-in">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>{mensagemFeedback}</span>
            </div>
          )}

          {/* DICA FLUTUANTE DE TOQUE OU TECLADO */}
          {faseJogo === 'jogando' && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#1E293B]/75 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-semibold text-white/90 pointer-events-none flex items-center gap-2 z-10 shadow-md">
              <ArrowDownCircle className="w-4 h-4 text-[#A8E6CF]" />
              <span>Toque na tela, clique no botão ou aperte Espaço para soltar</span>
            </div>
          )}
        </div>

        {/* BOTÃO TÁTIL DE SOLTAR BLOCO */}
        {faseJogo === 'jogando' && (
          <div className="w-full mt-3 flex flex-col sm:flex-row items-center gap-3">
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                executarSoltarBlocoRef.current();
              }}
              onClick={(e) => {
                e.stopPropagation();
                executarSoltarBlocoRef.current();
              }}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#2D6A4F] hover:bg-[#24543F] active:scale-98 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border-b-4 border-[#1B4332]"
            >
              <ArrowDownCircle className="w-6 h-6 text-[#A8E6CF]" />
              <span>SOLTAR BLOCO NO GUINDASTE</span>
            </button>

            <button
              onClick={executarVoltarSelecao}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#F7F3EE] hover:bg-[#EDE4DA] text-xs font-bold text-[#475569] border border-[#EDE4DA] transition-all cursor-pointer"
            >
              Mudar Estilo
            </button>
          </div>
        )}

        {/* BANNER DE CELEBRAÇÃO QUANDO ALCANÇA 10 ANDARES */}
        {alturaTorre >= 10 && faseJogo === 'jogando' && (
          <div className="w-full mt-3 p-3.5 bg-[#E8F8F2] rounded-2xl border border-[#A8E6CF] flex items-center justify-between text-xs font-bold text-[#2D6A4F] animate-fade-in">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#2D6A4F]" />
              <span>Parabéns! Torre com {alturaTorre} andares construída com sucesso!</span>
            </div>
            <button
              onClick={executarReiniciar}
              className="px-3.5 py-1.5 bg-white rounded-xl border border-[#A8E6CF] text-xs font-bold hover:bg-[#F0FFF4] transition-all"
            >
              Construir Outra
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
