const catalogoResultado = document.getElementById("catalogoResultado");

async function carregarCatalogo() {
    try {
        const resposta = await fetch("http://127.0.0.1:5000/mangas");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os mangás.");
        }

        const mangas = await resposta.json();

        catalogoResultado.innerHTML = "";

        if (mangas.length === 0) {
            catalogoResultado.innerHTML = "<p>Nenhum mangá cadastrado.</p>";
            return;
        }

        mangas.forEach(manga => {
            const item = document.createElement("div");
            item.className = "manga-item";

            const nome = document.createElement("h3");
            nome.textContent = manga.nome;

            const autor = document.createElement("p");
            autor.textContent = `Autor: ${manga.autor}`;

            const genero = document.createElement("p");
            genero.textContent = `Gênero: ${manga.genero}`;

            const volumes = document.createElement("p");
            volumes.textContent = `Volumes: ${manga.volumes}`;

            item.append(nome, autor, genero, volumes);
            catalogoResultado.appendChild(item);
        });

    } catch (erro) {
        catalogoResultado.innerHTML =
            "<p>Erro ao carregar o catálogo. Verifique se a API Flask está ligada.</p>";

        console.error("Erro:", erro);
    }
}

carregarCatalogo();
