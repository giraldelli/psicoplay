/**
 * Embaralha os elementos de uma lista usando o algoritmo de Fisher-Yates,
 * retornando uma nova lista sem modificar a original.
 */
export function embaralharLista<TipoElemento>(listaOriginal: readonly TipoElemento[]): TipoElemento[] {
  const listaEmbaralhada = [...listaOriginal];

  for (let indiceAtual = listaEmbaralhada.length - 1; indiceAtual > 0; indiceAtual -= 1) {
    const indiceAleatorio = Math.floor(Math.random() * (indiceAtual + 1));
    const elementoTemporario = listaEmbaralhada[indiceAtual];
    listaEmbaralhada[indiceAtual] = listaEmbaralhada[indiceAleatorio];
    listaEmbaralhada[indiceAleatorio] = elementoTemporario;
  }

  return listaEmbaralhada;
}

/**
 * Embaralha uma lista garantindo que a ordem resultante não coincida
 * com a lista de referência (útil para evitar cards alinhados na mesma posição).
 */
export function embaralharEvitandoAlinhamento<TipoElemento extends { id: string }>(
  listaOriginal: readonly TipoElemento[],
  listaReferencia: readonly TipoElemento[]
): TipoElemento[] {
  if (listaOriginal.length <= 1) {
    return [...listaOriginal];
  }

  let listaCandidata = embaralharLista(listaOriginal);
  const possuiAlgumAlinhamento = (candidata: TipoElemento[]) =>
    candidata.some((item, indice) => listaReferencia[indice]?.id === item.id);

  let tentativas = 0;
  while (possuiAlgumAlinhamento(listaCandidata) && tentativas < 10) {
    listaCandidata = embaralharLista(listaOriginal);
    tentativas += 1;
  }

  if (possuiAlgumAlinhamento(listaCandidata)) {
    const primeiroElemento = listaCandidata[0];
    listaCandidata = [...listaCandidata.slice(1), primeiroElemento];
  }

  return listaCandidata;
}

