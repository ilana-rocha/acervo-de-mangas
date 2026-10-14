// Seleciona o espaço onde a tabela será exibida
const catalogoResultado = document.getElementById("catalogoResultado");

// Busca os registros cadastrados no banco de dados
fetch("index.php")
    .then(resposta => resposta.text())
    .then(dados => {
        catalogoResultado.innerHTML = dados;
    })
    .catch(erro => {
        catalogoResultado.innerHTML = "<p>Erro ao carregar o catálogo.</p>";
        console.error(erro);
    });
