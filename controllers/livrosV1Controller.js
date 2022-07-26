const { Livro } = require("../models");
const { Op } = require("sequelize");
const countriesApi = require("../services/Countries");

const livrosV1Controller = {
    showAllBooks: async (req, res) => {
        const books = await Livro.findAll();

        return res.status(200).json(books);
    },

    showOneBook: async (req, res) => {
        try {
            const { id } = req.params;

            const book = await Livro.findByPk(id, { raw: true });

            const pais = await countriesApi.getByAlphaCode("br");

            Object.assign(book, {
                bandeira: pais[0].flags.png
            })

            if(!book) {
                return res.status(404).json({error: true, message: "O livro não foi encontrado"});
            }

            return res.status(200).json(book)
        } catch(error){
            console.log(error);
            return res.status(500).json({error: true, message: "Sistema indisponível, tente novamente mais tarde!"})
        }
        
    },

    store: async (req, res) => {
        try {
            const { titulo, quantidade_paginas, autor, ano_lancamento, estoque } = req.body;

            const verificarSeExiste = await Livro.findOne({
                where: {
                    [Op.and]: [{ titulo }, { autor }]
                }
            });

            if (verificarSeExiste) {
                return res.status(422).json({ message: "Livro já cadastrado" });
            }

            const novoLivro = await Livro.create({
                titulo,
                quantidade_paginas,
                autor,
                ano_lancamento,
                estoque
            });

            return res.status(201).json({ message: "Livro cadastrado com sucesso", livro: novoLivro });
        }catch(error){
            console.log(error);
            return res.status(500).json("Servidor Indisponível");
        }
    },

    edit: async (req, res) => {
        try {

            const { id } = req.params;
            const { titulo, quantidade_paginas, autor, ano_lancamento, estoque } = req.body;

            const livro = await Livro.findByPk(id);

            if (!livro) { return res.status(404).json({ error: "Livro não encontrado" }) };

            await Livro.update({
                titulo,
                quantidade_paginas,
                autor,
                ano_lancamento,
                estoque
            }, { where: { id } })

            const livroAtualizado = await Livro.findByPk(id);

            return res.status(200).json(livroAtualizado);

        } catch (error) {
            console.log(error);
            return res.status(500).json("Servidor Indisponível");
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const book = await Livro.findByPk(id);

            if(!book){
                return res.status(404).json({message: "Livro não encontrado"});
            }

            await Livro.destroy({where: {id}});

            return res.status(204).json();
        }catch (error){
            console.log(error);
            return res.status(500).json("Servidor Indisponível");
        }
    }

}

module.exports = livrosV1Controller;