const axios = require('axios');

const countriesApi = axios.create({
    baseURL: 'https://restcountries.com/v3.1/',
});

const methods = {
    getByAlphaCode: async (code) =>{
        try {
            const response = await countriesApi.get(`alpha/${code}`)
            if(response.status !== 200){
                throw new Error("A requisição não deu certo")
            }
            return response.data;
        }catch(error){
            console.log(error);
        }
    }
}

// methods.getByAlphaCode('br');
module.exports = methods;