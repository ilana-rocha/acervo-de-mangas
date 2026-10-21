const API_URL = "http://127.0.0.1:5000/mangas";

const formBusca = document.getElementById("formBusca");
const campoBusca = document.getElementById("nomeManga");
const listaMangas = document.getElementById("mangas");
const mensagemBusca = document.getElementById("mensagemBusca");
const botaoBuscar = document.getElementById("botaoBuscar");

async function buscarMangas(evento) {
    evento.preventDefault();

    const nome = campoBusca.value.trim();

    listaMangas.innerHTML = "";
    mensagemBusca.textContent = "";

    if (!nome) {
        mensagemBusca.textContent = "Digite o nome de um mangá!";
        return;
    }

    botaoBuscar.disabled = true;
    botaoBuscar.textContent = "Buscando...";
    mensagemBusca.textContent = "Procurando mangás...";

    try {
        const url =
            `https://openlibrary.org/search.json?title=${encodeURIComponent(nome)}&fields=key,title,author_name,cover_i,first_publish_year&limit=6`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro na pesquisa.");
        }

        const dados = await resposta.json();

        if (!dados.docs || dados.docs.length === 0) {
            mensagemBusca.textContent = "Nenhum mangá encontrado!";
            return;
        }

        dados.docs.forEach(manga => {
            const card = document.createElement("div");
            card.classList.add("card-manga");

            if (manga.cover_i) {
                const imagem = document.createElement("img");
                imagem.src =
                    `https://covers.openlibrary.org/b/id/${manga.cover_i}-M.jpg`;
                imagem.alt = `Capa de ${manga.title}`;
                imagem.loading = "lazy";
                card.appendChild(imagem);
            }

            const titulo = document.createElement("h3");
            titulo.textContent = manga.title;

            const autor = document.createElement("p");
            autor.textContent =
                "Autor: " + (manga.author_name?.join(", ") || "Não informado");

            const ano = document.createElement("p");
            ano.textContent =
                "Ano: " + (manga.first_publish_year || "Não informado");

            card.append(titulo, autor, ano);
            listaMangas.appendChild(card);
        });

        mensagemBusca.textContent = "";

    } catch (erro) {
        console.error("Erro na busca:", erro);
        mensagemBusca.textContent =
            "Não foi possível realizar a pesquisa. Tente novamente.";

    } finally {
        botaoBuscar.disabled = false;
        botaoBuscar.textContent = "Buscar mangás";
    }
}

if (formBusca) {
    formBusca.addEventListener("submit", buscarMangas);
}


// ========================================
// CADASTRO E LISTAGEM PELA API FLASK
// ========================================

const formMangas = document.getElementById("formMangas");
const resultado = document.getElementById("resultado");
const mensagemCadastro = document.getElementById("mensagemCadastro");


// Buscar os mangás armazenados no MySQL
async function carregarMangas() {
    if (!resultado) return;

    resultado.textContent = "Carregando mangás...";

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os mangás.");
        }

        const mangas = await resposta.json();

        resultado.innerHTML = "";

        if (mangas.length === 0) {
            resultado.textContent = "Nenhum mangá cadastrado ainda.";
            return;
        }

        mangas.forEach(manga => {
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

            card.append(titulo, autor, genero, volumes);
            resultado.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar mangás:", erro);
        resultado.textContent =
            "Erro ao carregar os mangás. Confira se a API Flask está ligada.";
    }
}


// Enviar um novo mangá para a API
async function cadastrarManga(evento) {
    evento.preventDefault();

    const manga = {
        nome: document.getElementById("nome").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        volumes: Number(document.getElementById("volumes").value)
    };

    if (
        !manga.nome ||
        !manga.autor ||
        !manga.genero ||
        !Number.isInteger(manga.volumes) ||
        manga.volumes < 1
    ) {
        mensagemCadastro.textContent =
            "Preencha todos os campos corretamente.";
        return;
    }

    const botao = formMangas.querySelector('button[type="submit"]');
    botao.disabled = true;
    mensagemCadastro.textContent = "Cadastrando mangá...";

    try {
        // LOG 1: conferir os dados que serão enviados
        console.log("Enviando mangá:", manga);

        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(manga)
        });

        // LOG 2: conferir o status HTTP
        console.log("Status HTTP:", resposta.status);

        const dados = await resposta.json();

        // LOG 3: conferir a resposta recebida do Flask
        console.log("Resposta do Flask:", dados);

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao cadastrar o mangá.");
        }

        mensagemCadastro.textContent =
            "Mangá cadastrado com sucesso!";

        formMangas.reset();

        // Atualiza a listagem sem recarregar a página
        await carregarMangas();

    } catch (erro) {
        console.error("Erro no cadastro:", erro);

        mensagemCadastro.textContent =
            `Não foi possível cadastrar: ${erro.message}`;

    } finally {
        botao.disabled = false;
    }
}

if (formMangas) {
    formMangas.addEventListener("submit", cadastrarManga);
}


// Carregar a listagem ao abrir a página
carregarMangas();
