*/casos* 

_Comando_: `/casos <args?>`
_Descrição_: Captura dados relativos ao Estado e cidade configuradas previamente com os comandos `/uf <uf>` e `/cidade <cidade>`.

_Argumentos_: Caso nenhum argumento for dado, o comando retornará uma mensagem com o número de casos confirmados no município/estado estabelecido, a porcentagem de casos para cada cem mil habitantes e o nómero de óbitos. É importante resaltar que se não houver dados, ou a cidade não corresponder com o estado, o comando retornará uma mensagem de erro. Caso um argumento for dado, dentre os suportados (`confirmados porcentagem óbitos lista gráfico`), o comando retornará mensagens específicas.

_Exemplos_:

1) Retornando número de casos: `/casos` ou `/casos confirmados`
2) Retornando a porcentagem de casos para cada 100 mil habitantes: `/casos porcentagem`
3) Retornando o número de óbitos: `/casos óbitos`
4) Retornando uma lista de casos confirmados discriminados pelo par `dia: caso`: `/casos lista`
5) Retornando um gráfico com os casos confirmados: `/casosx gráfico`
