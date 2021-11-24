module.exports = async function (api) {

    const bdd = await require('./mysql');

    class UserControler {

        async list() {
            const users = await bdd.query('SELECT * FROM users');

            return users;
        }
    }

    const user = new UserControler();

    api.get('/users', async (req, res) => {

        res.send(user.list());
    });

    return UserControler;
}
