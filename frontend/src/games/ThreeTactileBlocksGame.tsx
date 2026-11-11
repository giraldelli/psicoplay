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
  Maximize2
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
    coresBlocos: [0x70A1FF, 0xFF6B81, 0x7BED9F, 0xFFA502, 0x9B59B6],
    corChao: 0xCED6E0,
  },
  {
    id: 'arvore',
    titulo: 'Floresta & Natureza',
    subtitulo: 'Torre Viva Verdejante',
    descricao: 'Empilhe copas e troncos suaves criando uma grande árvore vertical.',
    icone: Trees,
    corPrimaria: '#16A34A',
    corSecundaria: '#DCFCE7',
    coresBlocos: [0x55EFC4, 0x00B894, 0x81ECEC, 0x00CEC9, 0x2ECC71],
    corChao: 0xA3CB38,
  },
  {
    id: 'castelo',
    titulo: 'Castelo Real Mágico',
    subtitulo: 'Ameias e Pedras Nobres',
    descricao: 'Erga torres fortificadas com pedras antigas, torres e ameias mágicas.',
    icone: Castle,
    corPrimaria: '#9333EA',
    corSecundaria: '#F3E8FF',
    coresBlocos: [0xA29BFE, 0x6C5CE7, 0xDFE6E9, 0xB2BEC3, 0xD6A2E8],
    corChao: 0x636E72,
  },
  {
    id: 'doces',
    titulo: 'Confeitaria de Bolos',
    subtitulo: 'Camadas Doces & Confeitos',
    descricao: 'Crie uma torre deliciosa com coberturas de chantilly e morangos.',
    icone: Cake,
    corPrimaria: '#E11D48',
    corSecundaria: '#FFE4E6',
    coresBlocos: [0xFF9FF3, 0xFECA57, 0xFF6B6B, 0x48DBFB, 0xF8A5C2],
    corChao: 0xF7D794,
  },
];

interface BlocoEmpilhado {
  posicaoX: number;
  posicaoY: number;
  posicaoZ: number;
  largura: number;
  altura: number;
  profundidade: number;
  mesh: THREE.Group;
}

export const ThreeTactileBlocksGame: React.FC<ThreeTactileBlocksGameProps> = ({
  onTap,
  onComplete,
}) => {
  // Estados da interface e fluxo
  const [faseJogo, setFaseJogo] = useState<'selecao' | 'contagem' | 'jogando' | 'vitoria'>('selecao');
  const [temaEscolhido, setTemaEscolhido] = useState<TipoDeBloco>('edificio');
  const [segundosContagem, setSegundosContagem] = useState(3);
  const [alturaTorre, setAlturaTorre] = useState(0);
  const [pontosPrecisao, setPontosPrecisao] = useState(100);
  const [mensagemFeedback, setMensagemFeedback] = useState<string | null>(null);

  // Referências do Three.js e DOM
  const montagemRef = useRef<HTMLDivElement>(null);
  const cenaRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const renderizadorRef = useRef<THREE.WebGLRenderer | null>(null);
  const grupoTorreRef = useRef<THREE.Group | null>(null);
  const particulasRef = useRef<THREE.Points | null>(null);

  // Referências para física e ciclo de animação
  const frameAnimacaoRef = useRef<number | null>(null);
  const tempoInicioRef = useRef<number>(Date.now());
  const blocoSuspensoMeshRef = useRef<THREE.Group | null>(null);
  const cordaLinhaRef = useRef<THREE.Line | null>(null);
  const blocoCaindoRef = useRef<THREE.Group | null>(null);
  const velocidadeQuedaRef = useRef<number>(0);
  const estaCaindoRef = useRef<boolean>(false);
  const blocosEmpilhadosRef = useRef<BlocoEmpilhado[]>([]);
  const alturaAtualTorreRef = useRef<number>(0);
  const posicaoTopoRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const cameraYAlvoRef = useRef<number>(4.5);
  const guindasteYAlvoRef = useRef<number>(9.5);
  const temaAtualRef = useRef<TipoDeBloco>('edificio');

  // Dimensões padrão dos blocos
  const LARGURA_BLOCO = 2.0;
  const ALTURA_BLOCO = 1.0;
  const PROFUNDIDADE_BLOCO = 2.0;

  // Criação estilizada dos blocos tridimensionais de acordo com o tema
  const criarMeshDoBloco = useCallback((tema: TipoDeBloco, indiceAndar: number): THREE.Group => {
    const grupo = new THREE.Group();
    const configTema = TEMAS_DISPONIVEIS.find((item) => item.id === tema) || TEMAS_DISPONIVEIS[0];
    const corPrincipal = configTema.coresBlocos[indiceAndar % configTema.coresBlocos.length];

    if (tema === 'edificio') {
      // Corpo do Prédio
      const geometriaCorpo = new THREE.BoxGeometry(LARGURA_BLOCO, ALTURA_BLOCO, PROFUNDIDADE_BLOCO);
      const materialCorpo = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshCorpo = new THREE.Mesh(geometriaCorpo, materialCorpo);
      grupo.add(meshCorpo);

      // Janelas decorativas frontais
      const geometriaJanela = new THREE.BoxGeometry(0.35, 0.35, 0.05);
      const materialJanela = new THREE.MeshBasicMaterial({ color: 0xFFFDF0 });

      [-0.5, 0.5].forEach((posicaoHorizontal) => {
        const meshJanela = new THREE.Mesh(geometriaJanela, materialJanela);
        meshJanela.position.set(posicaoHorizontal, 0.1, PROFUNDIDADE_BLOCO / 2 + 0.03);
        grupo.add(meshJanela);
      });

      // Moldura superior do andar
      const geometriaBorda = new THREE.BoxGeometry(LARGURA_BLOCO + 0.1, 0.1, PROFUNDIDADE_BLOCO + 0.1);
      const materialBorda = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const meshBorda = new THREE.Mesh(geometriaBorda, materialBorda);
      meshBorda.position.y = ALTURA_BLOCO / 2;
      grupo.add(meshBorda);

    } else if (tema === 'arvore') {
      // Tronco central
      const geometriaTronco = new THREE.CylinderGeometry(0.4, 0.45, ALTURA_BLOCO, 16);
      const materialTronco = new THREE.MeshLambertMaterial({ color: 0x8B5A2B });
      const meshTronco = new THREE.Mesh(geometriaTronco, materialTronco);
      grupo.add(meshTronco);

      // Camada de folhagem suave
      const geometriaFolhas = new THREE.CylinderGeometry(0.9, 1.2, 0.7, 8);
      const materialFolhas = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshFolhas = new THREE.Mesh(geometriaFolhas, materialFolhas);
      meshFolhas.position.y = 0.15;
      grupo.add(meshFolhas);

      // Pequenas folhas decorativas em volta
      const geometriaPequena = new THREE.SphereGeometry(0.28, 8, 8);
      const materialDetalhe = new THREE.MeshLambertMaterial({ color: 0xA8E6CF });
      [-0.7, 0.7].forEach((posicaoHorizontal) => {
        const esfera = new THREE.Mesh(geometriaPequena, materialDetalhe);
        esfera.position.set(posicaoHorizontal, 0.1, 0);
        grupo.add(esfera);
      });

    } else if (tema === 'castelo') {
      // Bloco de pedra sólida
      const geometriaPedra = new THREE.BoxGeometry(LARGURA_BLOCO, ALTURA_BLOCO, PROFUNDIDADE_BLOCO);
      const materialPedra = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshPedra = new THREE.Mesh(geometriaPedra, materialPedra);
      grupo.add(meshPedra);

      // Ameias / Torres nos quatro cantos
      const geometriaAmeia = new THREE.BoxGeometry(0.4, 0.35, 0.4);
      const materialAmeia = new THREE.MeshLambertMaterial({ color: 0x485460 });
      [
        [-0.75, -0.75],
        [0.75, -0.75],
        [-0.75, 0.75],
        [0.75, 0.75],
      ].forEach(([cantoX, cantoZ]) => {
        const ameia = new THREE.Mesh(geometriaAmeia, materialAmeia);
        ameia.position.set(cantoX, ALTURA_BLOCO / 2 + 0.15, cantoZ);
        grupo.add(ameia);
      });

      // Portal em arco frontal simples
      const geometriaPorta = new THREE.BoxGeometry(0.5, 0.6, 0.05);
      const materialPorta = new THREE.MeshLambertMaterial({ color: 0x2D3436 });
      const meshPorta = new THREE.Mesh(geometriaPorta, materialPorta);
      meshPorta.position.set(0, -0.2, PROFUNDIDADE_BLOCO / 2 + 0.03);
      grupo.add(meshPorta);

    } else {
      // Bolo confeitado doce
      const geometriaBolo = new THREE.CylinderGeometry(1.0, 1.1, ALTURA_BLOCO, 24);
      const materialBolo = new THREE.MeshLambertMaterial({ color: corPrincipal });
      const meshBolo = new THREE.Mesh(geometriaBolo, materialBolo);
      grupo.add(meshBolo);

      // Cobertura ondulada
      const geometriaCobertura = new THREE.CylinderGeometry(1.05, 1.05, 0.2, 24);
      const materialCobertura = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const meshCobertura = new THREE.Mesh(geometriaCobertura, materialCobertura);
      meshCobertura.position.y = ALTURA_BLOCO / 2;
      grupo.add(meshCobertura);

      // Morango no topo central
      const geometriaMorango = new THREE.SphereGeometry(0.2, 12, 12);
      const materialMorango = new THREE.MeshLambertMaterial({ color: 0xFF3838 });
      const meshMorango = new THREE.Mesh(geometriaMorango, materialMorango);
      meshMorango.position.set(0, ALTURA_BLOCO / 2 + 0.2, 0);
      grupo.add(meshMorango);
    }

    return grupo;
  }, []);

  // Criação de partículas suaves para comemoração de encaixe perfeito
  const criarEfeitoParticulas = useCallback((posicaoX: number, posicaoY: number, posicaoZ: number) => {
    if (!cenaRef.current) return;

    const quantidadeParticulas = 35;
    const geometria = new THREE.BufferGeometry();
    const posicoes = new Float32Array(quantidadeParticulas * 3);
    const velocidades: THREE.Vector3[] = [];

    for (let indice = 0; indice < quantidadeParticulas; indice++) {
      posicoes[indice * 3] = posicaoX + (Math.random() - 0.5) * 0.5;
      posicoes[indice * 3 + 1] = posicaoY + (Math.random() - 0.5) * 0.5;
      posicoes[indice * 3 + 2] = posicaoZ + (Math.random() - 0.5) * 0.5;

      velocidades.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          Math.random() * 0.08 + 0.04,
          (Math.random() - 0.5) * 0.08
        )
      );
    }

    geometria.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
    const material = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.18,
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
        velocidades[indice].y -= 0.002; // gravidade suave
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
    }

    const novoBloco = criarMeshDoBloco(tema, alturaAndar);
    const alturaGuindaste = guindasteYAlvoRef.current;
    novoBloco.position.set(0, alturaGuindaste - 1.8, 0);

    cenaRef.current.add(novoBloco);
    blocoSuspensoMeshRef.current = novoBloco;
    estaCaindoRef.current = false;
    blocoCaindoRef.current = null;
    velocidadeQuedaRef.current = 0;
  }, [criarMeshDoBloco]);

  // Função principal para soltar o bloco pendurado (disparada por toque ou clique)
  const executarSoltarBloco = useCallback(() => {
    if (faseJogo !== 'jogando' || estaCaindoRef.current || !blocoSuspensoMeshRef.current) {
      return;
    }

    onTap(); // Notifica HUD da terapeuta (registra toque do paciente)
    estaCaindoRef.current = true;
    blocoCaindoRef.current = blocoSuspensoMeshRef.current;
    blocoSuspensoMeshRef.current = null;
    velocidadeQuedaRef.current = 0.05;
  }, [faseJogo, onTap]);

  // Iniciar a contagem regressiva de 3 segundos
  const executarIniciarComContagem = useCallback((tema: TipoDeBloco) => {
    setTemaEscolhido(tema);
    temaAtualRef.current = tema;
    setFaseJogo('contagem');
    setSegundosContagem(3);
    setMensagemFeedback(null);
  }, []);

  // Efeito da contagem regressiva de 3 segundos
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
        setAlturaTorre(0);
        alturaAtualTorreRef.current = 0;
        posicaoTopoRef.current = { x: 0, z: 0 };
        cameraYAlvoRef.current = 4.5;
        guindasteYAlvoRef.current = 9.5;
        blocosEmpilhadosRef.current = [];

        if (cameraRef.current) {
          cameraRef.current.position.set(0, 4.5, 9.5);
          cameraRef.current.lookAt(0, 2.0, 0);
        }

        prepararProximoBloco(temaAtualRef.current, 0);
      }, 1000);
      return () => clearTimeout(temporizadorFinal);
    }
  }, [faseJogo, segundosContagem, prepararProximoBloco]);

  // Reiniciar jogo
  const executarReiniciar = useCallback(() => {
    // Limpar blocos empilhados
    if (grupoTorreRef.current) {
      while (grupoTorreRef.current.children.length > 0) {
        grupoTorreRef.current.remove(grupoTorreRef.current.children[0]);
      }
    }

    blocosEmpilhadosRef.current = [];
    alturaAtualTorreRef.current = 0;
    posicaoTopoRef.current = { x: 0, z: 0 };
    setAlturaTorre(0);
    setPontosPrecisao(100);
    setMensagemFeedback(null);
    cameraYAlvoRef.current = 4.5;
    guindasteYAlvoRef.current = 9.5;

    if (cameraRef.current) {
      cameraRef.current.position.set(0, 4.5, 9.5);
      cameraRef.current.lookAt(0, 2.0, 0);
    }

    prepararProximoBloco(temaAtualRef.current, 0);
  }, [prepararProximoBloco]);

  // Voltar para seleção de tema
  const executarVoltarSelecao = useCallback(() => {
    setFaseJogo('selecao');
    setMensagemFeedback(null);
    if (grupoTorreRef.current) {
      while (grupoTorreRef.current.children.length > 0) {
        grupoTorreRef.current.remove(grupoTorreRef.current.children[0]);
      }
    }
    if (blocoSuspensoMeshRef.current && cenaRef.current) {
      cenaRef.current.remove(blocoSuspensoMeshRef.current);
      blocoSuspensoMeshRef.current = null;
    }
    blocosEmpilhadosRef.current = [];
  }, []);

  // Inicialização da Cena Three.js
  useEffect(() => {
    const elementoContainer = montagemRef.current;
    if (!elementoContainer) return;

    const largura = elementoContainer.clientWidth || 640;
    const altura = elementoContainer.clientHeight || 420;

    // 1. Cena
    const cena = new THREE.Scene();
    cena.background = new THREE.Color(0xF4F1EA); // Tom suave e calmo
    cenaRef.current = cena;

    // 2. Câmera Perspectiva
    const camera = new THREE.PerspectiveCamera(45, largura / altura, 0.1, 100);
    camera.position.set(0, 4.5, 9.5);
    camera.lookAt(0, 2.0, 0);
    cameraRef.current = camera;

    // 3. Renderizador WebGL otimizado
    const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderizador.setSize(largura, altura);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderizadorRef.current = renderizador;

    // Remove elementos antigos se houver
    while (elementoContainer.firstChild) {
      elementoContainer.removeChild(elementoContainer.firstChild);
    }
    elementoContainer.appendChild(renderizador.domElement);

    // 4. Iluminação Sensorial Suave (Acolhedora, sem reflexos agressivos)
    const luzAmbiente = new THREE.AmbientLight(0xFFF9F0, 1.4);
    cena.add(luzAmbiente);

    const luzDirecional = new THREE.DirectionalLight(0xFFFFFF, 0.85);
    luzDirecional.position.set(6, 14, 8);
    cena.add(luzDirecional);

    const luzSecundaria = new THREE.DirectionalLight(0xDEEEF8, 0.4);
    luzSecundaria.position.set(-6, 8, -5);
    cena.add(luzSecundaria);

    // 5. Base / Plataforma de Construção
    const geometriaBase = new THREE.CylinderGeometry(2.8, 3.2, 0.4, 32);
    const materialBase = new THREE.MeshLambertMaterial({ color: 0xDDD3C4 });
    const meshBase = new THREE.Mesh(geometriaBase, materialBase);
    meshBase.position.y = -0.2;
    cena.add(meshBase);

    // Borda decorativa da base
    const geometriaAnel = new THREE.TorusGeometry(3.0, 0.08, 16, 48);
    const materialAnel = new THREE.MeshBasicMaterial({ color: 0xC8BCAF });
    const meshAnel = new THREE.Mesh(geometriaAnel, materialAnel);
    meshAnel.rotation.x = Math.PI / 2;
    meshAnel.position.y = -0.02;
    cena.add(meshAnel);

    // 6. Grupo da Torre
    const grupoTorre = new THREE.Group();
    cena.add(grupoTorre);
    grupoTorreRef.current = grupoTorre;

    // 7. Cabo / Corda do Guindaste
    const materialLinha = new THREE.LineBasicMaterial({ color: 0x555555, linewidth: 2 });
    const geometriaLinha = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, 8, 0),
    ]);
    const cordaLinha = new THREE.Line(geometriaLinha, materialLinha);
    cena.add(cordaLinha);
    cordaLinhaRef.current = cordaLinha;

    // 8. Braço superior do guindaste (visual leve de apoio)
    const grupoGuindasteVisual = new THREE.Group();
    const geometriaBraco = new THREE.BoxGeometry(6.0, 0.15, 0.15);
    const materialBraco = new THREE.MeshLambertMaterial({ color: 0x7F8C8D });
    const meshBraco = new THREE.Mesh(geometriaBraco, materialBraco);
    grupoGuindasteVisual.add(meshBraco);

    const geometriaRoldana = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
    const materialRoldana = new THREE.MeshLambertMaterial({ color: 0x34495E });
    const meshRoldana = new THREE.Mesh(geometriaRoldana, materialRoldana);
    meshRoldana.rotation.z = Math.PI / 2;
    grupoGuindasteVisual.add(meshRoldana);
    cena.add(grupoGuindasteVisual);

    // 9. Loop de Animação e Física
    const animar = () => {
      frameAnimacaoRef.current = requestAnimationFrame(animar);

      const tempoAtual = (Date.now() - tempoInicioRef.current) * 0.001;

      // Movimentação suave do guindaste visual acompanhando a altura da torre
      grupoGuindasteVisual.position.y = guindasteYAlvoRef.current + 0.2;

      // Oscilação pendular suave do bloco suspenso (inspirado em City Bloxx)
      const velocidadeOscilacao = 1.8;
      const amplitudeOscilacao = 2.4;
      const posicaoBalancoX = Math.sin(tempoAtual * velocidadeOscilacao) * amplitudeOscilacao;

      // Atualiza cabo do guindaste
      if (cordaLinhaRef.current) {
        const alturaTopoGuindaste = guindasteYAlvoRef.current;
        let posicaoPontaX = posicaoBalancoX;
        let posicaoPontaY = alturaTopoGuindaste - 1.8;

        if (blocoCaindoRef.current) {
          // Quando está caindo, a corda recolhe suavemente
          posicaoPontaX = 0;
          posicaoPontaY = alturaTopoGuindaste - 0.2;
        }

        const posicoesCorda = new Float32Array([
          0, alturaTopoGuindaste, 0,
          posicaoPontaX, posicaoPontaY, 0,
        ]);
        cordaLinhaRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(posicoesCorda, 3));
      }

      // Se houver bloco pendurado, ele acompanha o balanço
      if (blocoSuspensoMeshRef.current && !estaCaindoRef.current) {
        const alturaSuspensa = guindasteYAlvoRef.current - 1.8;
        blocoSuspensoMeshRef.current.position.set(posicaoBalancoX, alturaSuspensa, 0);
        // Leve inclinação pendular para dar sensação física realista e gostosa
        blocoSuspensoMeshRef.current.rotation.z = -Math.cos(tempoAtual * velocidadeOscilacao) * 0.08;
      }

      // Física do bloco caindo
      if (blocoCaindoRef.current && estaCaindoRef.current) {
        velocidadeQuedaRef.current += 0.015; // gravidade gradual
        blocoCaindoRef.current.position.y -= velocidadeQuedaRef.current;

        // Suaviza a rotação de volta ao reto ao cair
        blocoCaindoRef.current.rotation.z *= 0.95;

        // Altura alvo de pouso: topo da torre atual
        const alturaAlvoPouso = alturaAtualTorreRef.current * ALTURA_BLOCO;

        if (blocoCaindoRef.current.position.y <= alturaAlvoPouso + ALTURA_BLOCO / 2) {
          // Chegou na altura de colisão com o andar anterior
          blocoCaindoRef.current.position.y = alturaAlvoPouso + ALTURA_BLOCO / 2;

          const posicaoBlocoX = blocoCaindoRef.current.position.x;
          const centroAlvoX = posicaoTopoRef.current.x;
          const diferencaDistancia = Math.abs(posicaoBlocoX - centroAlvoX);

          const toleranciaSucesso = LARGURA_BLOCO * 0.75; // Até 1.5 unidades de distância é considerado estável

          if (diferencaDistancia <= toleranciaSucesso) {
            // ENCAIXE BEM SUCEDIDO!
            const encaixePerfeito = diferencaDistancia < 0.25;

            if (encaixePerfeito) {
              setMensagemFeedback('Perfeito! Alinhamento 100%!');
              criarEfeitoParticulas(posicaoBlocoX, alturaAlvoPouso + ALTURA_BLOCO, 0);
            } else if (diferencaDistancia < 0.6) {
              setMensagemFeedback('Muito bom! Torre firme!');
            } else {
              setMensagemFeedback('Equilibrado! Continue construindo!');
            }

            // Transfere o bloco caindo para o grupo da torre
            if (grupoTorreRef.current) {
              grupoTorreRef.current.add(blocoCaindoRef.current);
            }

            // Registra novo andar
            const novoAndar = alturaAtualTorreRef.current + 1;
            alturaAtualTorreRef.current = novoAndar;
            setAlturaTorre(novoAndar);
            posicaoTopoRef.current = { x: posicaoBlocoX, z: 0 };

            // Atualiza precisão calculada
            setPontosPrecisao((precisaoAnterior) => {
              const precisaoDesteBloco = Math.max(50, Math.round(100 - (diferencaDistancia / toleranciaSucesso) * 45));
              return Math.round((precisaoAnterior * (novoAndar - 1) + precisaoDesteBloco) / novoAndar);
            });

            // Eleva a câmera e o guindaste gradualmente conforme a torre cresce
            cameraYAlvoRef.current = 4.5 + novoAndar * 0.95;
            guindasteYAlvoRef.current = 9.5 + novoAndar * 1.0;

            // Se atingir 10 andares, conclui meta terapêutica
            if (novoAndar >= 10) {
              onComplete();
            }

            // Prepara o próximo bloco após um breve respiro sensorial
            estaCaindoRef.current = false;
            blocoCaindoRef.current = null;
            setTimeout(() => {
              prepararProximoBloco(temaAtualRef.current, novoAndar);
            }, 350);

          } else {
            // BLOCO DESLIZOU / ERRO SEM FRUSTRAÇÃO
            setMensagemFeedback('Quase lá! Vamos tentar o próximo andar com calma.');
            
            // Animação de queda suave para o chão sem susto
            const blocoQueda = blocoCaindoRef.current;
            estaCaindoRef.current = false;
            blocoCaindoRef.current = null;

            let passosDeslize = 30;
            const animarQuedaFora = () => {
              if (passosDeslize <= 0 || !cenaRef.current) {
                if (cenaRef.current && blocoQueda) {
                  cenaRef.current.remove(blocoQueda);
                }
                return;
              }
              passosDeslize--;
              blocoQueda.position.y -= 0.15;
              blocoQueda.position.x += posicaoBlocoX > centroAlvoX ? 0.08 : -0.08;
              blocoQueda.rotation.z += 0.08;
              requestAnimationFrame(animarQuedaFora);
            };
            animarQuedaFora();

            // Libera um novo bloco após 600ms
            setTimeout(() => {
              prepararProximoBloco(temaAtualRef.current, alturaAtualTorreRef.current);
            }, 600);
          }
        }
      }

      // Interpolação suave (lerp) da câmera para acompanhar o crescimento da torre
      if (cameraRef.current) {
        cameraRef.current.position.y += (cameraYAlvoRef.current - cameraRef.current.position.y) * 0.05;
        cameraRef.current.lookAt(0, cameraYAlvoRef.current - 2.5, 0);
      }

      // Renderização
      renderizador.render(cena, camera);
    };

    animar();

    // Redimensionamento responsivo do Canvas
    const tratarRedimensionamento = () => {
      if (!elementoContainer || !cameraRef.current || !renderizadorRef.current) return;
      const novaLargura = elementoContainer.clientWidth;
      const novaAltura = elementoContainer.clientHeight;
      cameraRef.current.aspect = novaLargura / novaAltura;
      cameraRef.current.updateProjectionMatrix();
      renderizadorRef.current.setSize(novaLargura, novaAltura);
    };

    window.addEventListener('resize', tratarRedimensionamento);

    return () => {
      window.removeEventListener('resize', tratarRedimensionamento);
      if (frameAnimacaoRef.current) {
        cancelAnimationFrame(frameAnimacaoRef.current);
      }
      if (elementoContainer.contains(renderizador.domElement)) {
        elementoContainer.removeChild(renderizador.domElement);
      }
      renderizador.dispose();
    };
  }, [criarEfeitoParticulas, onComplete, prepararProximoBloco]);

  // Tema atualmente ativo
  const temaAtualConfig = TEMAS_DISPONIVEIS.find((item) => item.id === temaEscolhido) || TEMAS_DISPONIVEIS[0];

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] w-full max-w-4xl mx-auto p-4 sm:p-6 bg-[#FCFBF9] rounded-3xl border border-[#EDE4DA] shadow-xs select-none relative overflow-hidden">
      
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

        {/* Botões de Ação Rápida */}
        <div className="flex items-center gap-2">
          {faseJogo === 'jogando' && (
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
        </div>
      </div>

      {/* Conteúdo Dinâmico Baseado na Fase */}
      {faseJogo === 'selecao' ? (
        /* TELA DE SELEÇÃO DE TIPO DE BLOCO */
        <div className="w-full flex-1 flex flex-col items-center justify-center py-6 animate-fade-in">
          <div className="text-center max-w-lg mb-6">
            <span className="text-xs font-bold text-[#2D6A4F] bg-[#E8F8F2] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              Passo 1 de 2: Escolha o seu Estilo
            </span>
            <h3 className="text-2xl font-extrabold text-[#1E293B]">
              Qual tipo de bloco você quer empilhar?
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Toque no modelo desejado. O jogo iniciará automaticamente após 3 segundos!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            {TEMAS_DISPONIVEIS.map((tema) => {
              const IconeTema = tema.icone;
              return (
                <button
                  key={tema.id}
                  onClick={() => executarIniciarComContagem(tema.id)}
                  className="group relative flex items-start gap-4 p-5 rounded-2xl border-2 border-[#EDE4DA] bg-white hover:border-[#3E8EBF] hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
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
      ) : (
        /* TELA DE JOGO COM CANVAS THREE.JS */
        <div className="w-full flex-1 flex flex-col items-center justify-between my-2 relative">
          
          {/* Painel Superior de Estatísticas da Torre */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-[#F7F3EE] rounded-2xl border border-[#EDE4DA] text-xs font-bold text-[#475569] mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Tema:</span>
              <span className="text-[#1E293B] flex items-center gap-1">
                <temaAtualConfig.icone className="w-3.5 h-3.5" style={{ color: temaAtualConfig.corPrimaria }} />
                {temaAtualConfig.titulo}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[#2D6A4F]">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>Andares: {alturaTorre}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[#3E8EBF]">
                <Sparkles className="w-4 h-4 text-[#3E8EBF]" />
                <span>Precisão: {pontosPrecisao}%</span>
              </div>
            </div>
          </div>

          {/* Área do Canvas 3D Interativo */}
          <div
            className="w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-[#EDE4DA] shadow-inner bg-[#F4F1EA] relative cursor-pointer touch-none"
            onClick={executarSoltarBloco}
            onTouchStart={(evento) => {
              evento.preventDefault();
              executarSoltarBloco();
            }}
            style={{ touchAction: 'none' }}
          >
            {/* Montagem do Three.js WebGL */}
            <div ref={montagemRef} className="w-full h-full" />

            {/* Overlay da Contagem Regressiva de 3 Segundos */}
            {faseJogo === 'contagem' && (
              <div className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-xs flex flex-col items-center justify-center z-20 animate-fade-in pointer-events-none">
                <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-[#3E8EBF] animate-pulse">
                  <span className="text-5xl font-black text-[#1E293B]">
                    {segundosContagem}
                  </span>
                </div>
                <p className="text-white font-extrabold text-sm sm:text-base mt-4 tracking-wide drop-shadow-md">
                  Preparando o guindaste...
                </p>
              </div>
            )}

            {/* Mensagem Flutuante de Feedback Tranquilizador */}
            {mensagemFeedback && faseJogo === 'jogando' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 px-4 py-2 rounded-2xl border border-[#EDE4DA] shadow-md text-xs sm:text-sm font-extrabold text-[#1E293B] flex items-center gap-2 pointer-events-none z-10 animate-fade-in">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>{mensagemFeedback}</span>
              </div>
            )}

            {/* Dica Flutuante no Canvas */}
            {faseJogo === 'jogando' && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#1E293B]/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-white/90 pointer-events-none flex items-center gap-1.5 z-10">
                <ArrowDownCircle className="w-3.5 h-3.5 text-[#A8E6CF]" />
                <span>Toque na tela ou no botão abaixo para soltar</span>
              </div>
            )}
          </div>

          {/* Botão Gigante Tátil de Soltar Bloco (Acessibilidade Celular e Computador) */}
          {faseJogo === 'jogando' && (
            <div className="w-full mt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={executarSoltarBloco}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#2D6A4F] hover:bg-[#24543F] active:scale-98 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border-b-4 border-[#1B4332]"
              >
                <ArrowDownCircle className="w-6 h-6 text-[#A8E6CF]" />
                <span>SOLTAR BLOCO NO GUINDASTE</span>
              </button>

              <button
                onClick={executarVoltarSelecao}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-[#F7F3EE] hover:bg-[#EDE4DA] text-xs font-bold text-[#475569] border border-[#EDE4DA] transition-all cursor-pointer"
              >
                Mudar Estilo
              </button>
            </div>
          )}

          {/* Banner de Celebração quando alcança 10 andares */}
          {alturaTorre >= 10 && (
            <div className="w-full mt-3 p-3 bg-[#E8F8F2] rounded-2xl border border-[#A8E6CF] flex items-center justify-between text-xs font-bold text-[#2D6A4F] animate-fade-in">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#2D6A4F]" />
                <span>Parabéns! Torre com {alturaTorre} andares construída com sucesso!</span>
              </div>
              <button
                onClick={executarReiniciar}
                className="px-3 py-1 bg-white rounded-xl border border-[#A8E6CF] text-[11px] hover:bg-[#F0FFF4] transition-all"
              >
                Construir Outra
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
