const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require('./../utils/aws-upload-image');

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

async function updateAvatar(file, context) {
    const { id } = context.user;
    const { createReadStream, mimetype, filename } = await file;

    
    
    const fileNameCut = filename.split(".")[0];
    const extension = mimetype.split("/")[1];
    const imageName = `avatar/${fileNameCut}${id}.${extension}`;
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, imageName);
        await User.findByIdAndUpdate(id, { avatar: result });
        
        return {
            status: true,
            urlAvatar: result,
        }
    } catch (error) {
        return {
            status: false,
            urlAvatar: null
        }
    }
}

async function deleteAvatar(context) {
    const { id } = context.user;

    try {
        await User.findByIdAndUpdate(id, { avatar: "" });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    register,
    login,
    getUser,
    updateAvatar,
    deleteAvatar,
}