const db = require("../db");

const UserToConversation = db.define("userToConversation", {});

// find user member given conversation Ids
UserToConversation.findUserMember = async function (convoId) {
	const userToConversation = await UserToConversation.findOne({
		where: {
			conversationId: convoId
		}
	});

	// return user member or null if it doesn't exist
	return userToConversation;
};

module.exports = UserToConversation;
