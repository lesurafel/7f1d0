const db = require("../db");

const UserGroup = db.define("user_group", {});

// find user member given conversation Ids
UserGroup.findUserMember = async function (convoId) {
	const userMember = await UserGroup.findOne({
		where: {
			conversationId: convoId
		}
	});

	// return user member or null if it doesn't exist
	return userMember;
};

module.exports = UserGroup;
