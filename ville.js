module.exports = async function (api) {

    const bdd = await require('./mysql');

    class VilleControler {

        async addVille(nom){
            return await bdd.query(`INSERT INTO villes (nom) VALUES("${nom}")`);
            
        }

        async findByNom(nom) {
            return await bdd.query(`SELECT * FROM villes WHERE nom = "${nom}"`);
        }
    }
    return new VilleControler;
}
