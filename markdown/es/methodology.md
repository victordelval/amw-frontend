# Metodología

Resumen
El detector de minas es un modelo estadístico y computacional conocido como red neuronal artificial, que entrenamos para discriminar las minas de otros terrenos alimentándolo con ejemplos etiquetados a mano de minas y otras características clave tal y como aparecen en las imágenes satelitales del Sentinel-2. Esta red neuronal convolucional ligera (haz clic aquí para saber más) funciona con parches de datos de 44 x 44 píxeles (440 m x 440 m) extraídos del producto de datos Sentinel 2 L1C. Cada píxel del parche capta la luz reflejada por la superficie de la Tierra en doce bandas de luz visible e infrarroja. Promediamos los datos de Sentinel a lo largo de un período de cuatro meses para reducir la presencia de nubes, la sombra de las nubes y otros efectos transitorios.

Durante el tiempo de ejecución, la red evalúa cada parche en busca de signos de actividad minera reciente y, a continuación, la región de interés se desplaza 140 m para que la red realice una evaluación posterior. Este proceso se lleva a cabo en toda la región de interés. La red realiza 326 millones de evaluaciones individuales, necesarias para cubrir los 6,7 millones de kilómetros cuadrados de la cuenca amazónica una vez cada cuatro meses.

El sistema se desarrolló para su uso en la Amazonía, pero también se ha visto que funciona en otros biomas tropicales.

Precisión de detección
Crear métricas de precisión cuantitativa para un sistema como éste no siempre es sencillo ni útil. Por ejemplo, si el sistema afirmara que no hay ninguna mina en la cuenca del Amazonas, tendría una precisión superior al 99%, porque una gran proporción del paisaje sigue sin estar minado.

Para proporcionar uma medida mais construtiva, validamos uma subamostra aleatória das detecções do sistema. Isto nos permite estimar o que é conhecido como a precisão ou o valor preditivo positivo para o classificador. Em essência, ele nos diz a probabilidade de que a caixa marcada como mina seja realmente uma mina. Em nossa última corrida, vemos uma precisão de 98,2%. Para uma amostra de 500 detecções de minas, você pode esperar ver cerca de 9 classificações errôneas. Em nossa amostra, um terço das falsas detecções ainda identificou atividade mineira, mas mineração para materiais como bauxita em vez de ouro.

Estimación de área
El objetivo de este trabajo es la detección de minas más que la estimación de la superficie, y nuestra clasificación opera en parcelas de 440 m x 440 m. Si la red determina que existe minería dentro de la parcela, se declara que toda la parcela es una mina. Esto conduce a una sobreestimación sistemática del área minada si se calcula ingenuamente a partir de los límites de los polígonos. La construcción de un modelo de segmentación para delinear los límites de las minas sería una extensión viable de este trabajo.