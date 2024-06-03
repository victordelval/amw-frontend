# Metodologia

## Visão geral

O detector de minas é um modelo estatístico e computacional conhecido como rede neural artificial, que treinamos para discriminar as minas de quaisquer outros terrenos, alimentando-o com exemplos rotulados à mão de minas e outros recursos importantes, conforme aparecem nas imagens de satélite Sentinel-2. Essa leve rede neural convolucional (clique aqui para saber mais) opera em trechos de dados de 44 x 44 pixels (440 m x 440 m) extraídos do produto de dados Sentinel 2 L1C . Cada pixel do trecho captura a luz refletida da superfície da Terra em doze bandas de luz visível e infravermelha. Calculamos a média (composição média) dos dados de Sentinel em um período de quatro meses para reduzir a presença de nuvens, sombra de nuvens e outros efeitos transitórios.

Durante esse período, a rede avalia cada trecho em busca de sinais de atividade recente de mineração e, em seguida, a região de interesse é deslocada em 140 m para que a rede faça uma avaliação subsequente. Este processo prossegue em toda a região de interesse. A rede faz 326 milhões de avaliações individuais, que são necessárias para cobrir os 6,7 milhões de quilômetros quadrados da bacia Amazônica, uma vez a cada quatro meses.

O sistema foi desenvolvido para o uso na Amazônia, mas também tem funcionado em outros biomas tropicais.

## Area Estimation

Criar métricas de precisão quantitativa para um sistema como este nem sempre é fácil ou construtivo. Por exemplo, se o sistema afirmasse que não existem minas na bacia amazônica, seria uma afirmação com 99% de precisão, pois uma proporção maior da paisagem permanece não explorada.

Para proporcionar uma medida mais construtiva, fizemos uma validação de uma amostra aleatória das detecções do sistema. Isto nos permite estimar a precisão ou o valor preditivo positivo da ferramenta. Em outras palavras, esta validação nos diz qual a probabilidade de que o polígono marcado como mina seja realmente uma mina. Em nosso último teste, observamos uma precisão de 98,2%. Ou seja: para uma amostra de 500 detecções de minas, você pode esperar ver cerca de 9 classificações errôneas. Além disso, nesta amostra, um terço das falsas detecções ainda representou algum tipo de atividade mineira. Porém, nestes casos, mineração de recursos como a bauxita em vez de ouro.

## Estimativa da área

O objetivo deste trabalho é a detecção dos garimpos em vez de chegar a estimativa de área. Nossa classificação opera em parcelas de 440 m x 440 m. Se a rede determinar que a mineração existe em parte da parcela, então toda a parcela é declarada como uma área de mineração. Isto leva a superestimar de maneira sistemática a área minerada, caso ela seja calculada ingenuamente a partir dos limites do polígono. A construção de um modelo de segmentação, para delimitar os limites da mina seria uma extensão viável deste trabalho.
