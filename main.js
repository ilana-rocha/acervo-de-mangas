// Pega o formulário pelo ID que coloquei no HTML
const formulario = document.getElementById("formMangas");
// Pega o lugar onde a tabela vai aparecer
const resultado = document.getElementById("resultado");
// Pega o lugar onde vai mostrar mensagens para o usuário
const mensagem = document.getElementById("mensagem");


// Essa função busca os mangás no PHP e mostra eles na página
function carregarMangas() {

    // Faz uma requisição para o index.php
    fetch("index.php")
        .then(resposta => {
            // Se der algum erro na resposta, mostra um erro
            if (!resposta.ok) {
                throw new Error("Não foi possível carregar os mangás.");
            }
            // Transforma a resposta em texto
            return resposta.text();
        })

        .then(dados => {

            // Coloca a tabela que veio do PHP dentro da div resultado
            resultado.innerHTML = dados;

        })

        .catch(erro => {

            // Se der erro, mostra uma mensagem na página
            resultado.innerHTML = "<p>Erro ao carregar os mangás.</p>";
            // Mostro o erro no console para ajudar a identificar o problema
            console.error(erro);
        });
}


// Aqui espera o usuário enviar o formulário
formulario.addEventListener("submit", function (evento) {

    // Impede o comportamento padrão de recarregar a página
    evento.preventDefault();
    // Pega todos os dados preenchidos no formulário
    const dadosFormulario = new FormData(formulario);

    // Envia esses dados para o salvar.php
    fetch("php/salvar.php", {
        method: "POST",
        body: dadosFormulario
    })

        .then(resposta => resposta.text())
        .then(() => {

            // Limpa os campos depois do cadastro
            formulario.reset();
            mensagem.textContent = "Mangá cadastrado com sucesso!";
            // Atualiza a lista para mostrar o novo mangá
            carregarMangas();
        })

        .catch(erro => {

            // Caso aconteça algum problema no cadastro
            mensagem.textContent = "Não foi possível cadastrar o mangá.";
            console.error(erro);
        });
});


// Quando a página abre, já carrega os mangás cadastrados
carregarMangas();