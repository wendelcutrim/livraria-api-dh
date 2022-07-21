const { Livro } = require("../models");

const livrosV1Controller = {
    showAllBooks: async (req, res) => {
        const books = await Livro.findAll();

        return res.status(200).json(books);
    },

    showOneBook: async (req, res) => {
        try {
            const { id } = req.params;

            const book = await Livro.findByPk(id);

            if(!book) {
                return res.status(404).json({error: true, message: "O livro não foi encontrado"});
            }

            return res.status(200).json(book)
        } catch(error){
            console.log(error);
            return res.status(500).json({error: true, message: "Sistema indisponível, tente novamente mais tarde!"})
        }
        
    },

    store: (req, res) => {
        const data = req.body;

        return res.status(201).json(data)
    }
}

module.exports = livrosV1Controller;