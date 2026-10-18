
// BUSCA DE MANGÁS COM A API OPEN LIBRARY

const formBusca = document.getElementById("formBusca");
const campoBusca = document.getElementById("nomeManga");
const listaMangas = document.getElementById("mangas");
const mensagemBusca = document.getElementById("mensagemBusca");
const botaoBuscar = document.getElementById("botaoBuscar");

// Buscar mangás na API
async function buscarMangas(evento) {
    evento.preventDefault();

    const nome = campoBusca.value.trim();

    listaMangas.innerHTML = "";
    mensagemBusca.textContent = "";

    if (nome === "") {
        mensagemBusca.textContent = "Digite o nome de um mangá!";
        return;
    }

    botaoBuscar.disabled = true;
    botaoBuscar.textContent = "Buscando...";
    mensagemBusca.textContent = "Procurando mangás...";

    try {
        // Nova API: Open Library
        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(nome)}&fields=key,title,author_name,cover_i,first_publish_year&limit=6`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro na requisição");
        }

        // Converter a resposta em JSON
        const dados = await resposta.json();

        listaMangas.innerHTML = "";
        mensagemBusca.textContent = "";

        // Verificar se encontrou resultados
        if (!dados.docs || dados.docs.length === 0) {
            mensagemBusca.textContent = "Nenhum mangá encontrado!";
            return;
        }

        // Criar os cards
        dados.docs.forEach(manga => {
            const card = document.createElement("div");
            card.classList.add("card-manga");

            // Capa
            if (manga.cover_i) {
                const imagem = document.createElement("img");

                imagem.src = `https://covers.openlibrary.org/b/id/${manga.cover_i}-M.jpg`;
                imagem.alt = `Capa de ${manga.title}`;
                imagem.loading = "lazy";

                card.appendChild(imagem);
            }

            // Título
            const titulo = document.createElement("h3");
            titulo.textContent = manga.title;

            // Autor
            const autor = document.createElement("p");
            autor.textContent = "Autor: " +
                (manga.author_name?.join(", ") || "Não informado");

            // Ano
            const ano = document.createElement("p");
            ano.textContent = "Ano: " +
                (manga.first_publish_year || "Não informado");

            card.appendChild(titulo);
            card.appendChild(autor);
            card.appendChild(ano);

            listaMangas.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro na API:", erro);

        mensagemBusca.textContent =
            "Não foi possível realizar a pesquisa. Tente novamente.";

    } finally {
        // Ativar o botão novamente
        botaoBuscar.disabled = false;
        botaoBuscar.textContent = "Buscar mangás";
    }
}

// Ativar busca
if (formBusca) {
    formBusca.addEventListener("submit", buscarMangas);
}


// CADASTRO DE MANGÁS

const formMangas = document.getElementById("formMangas");
const resultado = document.getElementById("resultado");
const mensagemCadastro = document.getElementById("mensagemCadastro");

// Recuperar mangás salvos
let mangasCadastrados = [];

try {
    mangasCadastrados = JSON.parse(
        localStorage.getItem("mangasCadastrados") || "[]"
    );
} catch (erro) {
    console.error("Erro ao carregar mangás:", erro);
    mangasCadastrados = [];
}

// Salvar mangás no navegador
function salvarMangas() {
    localStorage.setItem(
        "mangasCadastrados",
        JSON.stringify(mangasCadastrados)
    );
}

// Mostrar mangás cadastrados
function mostrarMangas() {
    if (!resultado) {
        return;
    }

    resultado.innerHTML = "";

    if (mangasCadastrados.length === 0) {
        resultado.textContent = "Nenhum mangá cadastrado ainda.";
        return;
    }

    mangasCadastrados.forEach((manga, indice) => {
        const card = document.createElement("div");
        card.classList.add("manga-cadastrado");

        const titulo = document.createElement("h3");
        titulo.textContent = manga.nome;

        const autor = document.createElement("p");
        autor.textContent = `Autor: ${manga.autor}`;

        const genero = document.createElement("p");
        genero.textContent = `Gênero: ${manga.genero}`;

        const volumes = document.createElement("p");
        volumes.textContent = `Volumes: ${manga.volumes}`;

        // Botão excluir
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("botao-excluir");

        botaoExcluir.addEventListener("click", () => {
            mangasCadastrados.splice(indice, 1);
            salvarMangas();
            mostrarMangas();
        });

        card.appendChild(titulo);
        card.appendChild(autor);
        card.appendChild(genero);
        card.appendChild(volumes);
        card.appendChild(botaoExcluir);

        resultado.appendChild(card);
    });
}

// Cadastrar um mangá
function cadastrarManga(evento) {
    evento.preventDefault();

    const manga = {
        nome: document.getElementById("nome").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        volumes: document.getElementById("volumes").value
    };

    mangasCadastrados.push(manga);

    salvarMangas();
    mostrarMangas();

    mensagemCadastro.textContent = "Mangá cadastrado com sucesso!";

    formMangas.reset();
}

// Ativar cadastro
if (formMangas) {
    formMangas.addEventListener("submit", cadastrarManga);
}

// Mostrar mangás ao abrir o site
if (resultado) {
    mostrarMangas();
}
