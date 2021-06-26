const Comment = require("./../models/comment");

function addComment(input, context) {
    try {
        const comment = new Comment({
            idPublication: input.idPublication,
            idUser: context.user.id,
            comment: input.comment,
        });
        comment.save();
        return comment;
    } catch (error) {
        console.log(error);
    }
    return null;
};

async function getComments(idPublication) {
    const result = await Comment.find({ idPublication }).populate("idUser");
    
    return result;
};

module.exports = {
    addComment,
    getComments,
}