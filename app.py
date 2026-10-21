
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


def conectar_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="acervo_mangas"
    )


# GET: listar os mangás cadastrados
@app.route("/mangas", methods=["GET"])
def listar_mangas():
    conexao = None
    cursor = None

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor(dictionary=True)

        cursor.execute(
            "SELECT id, nome, autor, genero, volumes FROM mangas"
        )
        mangas = cursor.fetchall()

        return jsonify(mangas), 200

    except mysql.connector.Error as erro:
        return jsonify({"erro": str(erro)}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()


# POST: cadastrar um novo mangá
@app.route("/mangas", methods=["POST"])
def cadastrar_manga():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "Envie os dados em formato JSON."}), 400

    campos = ["nome", "autor", "genero", "volumes"]

    if any(campo not in dados for campo in campos):
        return jsonify({"erro": "Preencha todos os campos."}), 400

    conexao = None
    cursor = None

    try:
        volumes = int(dados["volumes"])

        conexao = conectar_banco()
        cursor = conexao.cursor()

        sql = """
            INSERT INTO mangas (nome, autor, genero, volumes)
            VALUES (%s, %s, %s, %s)
        """

        valores = (
            dados["nome"],
            dados["autor"],
            dados["genero"],
            volumes
        )

        cursor.execute(sql, valores)
        conexao.commit()

        return jsonify({
            "mensagem": "Mangá cadastrado com sucesso!",
            "id": cursor.lastrowid
        }), 201

    except (mysql.connector.Error, ValueError) as erro:
        if conexao and conexao.is_connected():
            conexao.rollback()

        return jsonify({"erro": str(erro)}), 400

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
