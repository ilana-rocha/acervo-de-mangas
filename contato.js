// Seleciona o formulário de contato
const formularioContato = document.getElementById("formContato");
const mensagemContato = document.getElementById("mensagemContato");

// Valida o formulário quando ele é enviado
formularioContato.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("contatoNome").value.trim();
    const email = document.getElementById("contatoEmail").value.trim();
    const mensagem = document.getElementById("contatoMensagem").value.trim();

    if (nome === "" || email === "" || mensagem === "") {
        mensagemContato.textContent = "Preencha todos os campos.";
        return;
    }

    mensagemContato.textContent = "Mensagem enviada com sucesso!";
    formularioContato.reset();
});
