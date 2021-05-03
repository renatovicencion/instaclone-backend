const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(user, SECRET_KEY, expiresIn) {
    const { id, name, email, username } = user;
    const payload = {
        id,
        name,
        email,
        username,
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input) {

    const newUser = input;

    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username, password } = newUser;

    // Revisamos si el email está en uso
    const foundEmail = await User.findOne({ email });

    if (foundEmail) throw new Error("El email ya está en uso.");

    // Revisamos si el username está en uso
    const foundUsername = await User.findOne( { username });
    if (foundUsername) throw new Error("El nombre de usuario ya está en uso.");

    // Encriptar.
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(newUser);
        user.save();
        return user;
    } catch (error) {
        console.log(error);
    }
    return null;

}

async function login(input) {
    const { email, password } = input;

    const userFound = await User.findOne({ email: email.toLowerCase() });
    if (!userFound) throw new Error("Error en el email o contraseña.");

    const passwordSuccess = await bcryptjs.compare(password, userFound.password);
    if (!passwordSuccess) throw new Error("Error en el email o contraseña.");

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "24h"),
    };
}

async function getUser(id, username) {
    let user = null;

    if (id) user = await User.findById(id);

    if (username) user = await User.findOne({username});

    if (!user) throw new Error("El usuario no existe.");

    return user;
}

module.exports = {
    register,
    login,
    getUser,
}