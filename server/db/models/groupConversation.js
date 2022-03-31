const Sequelize = require("sequelize");
const db = require("../db");

const GroupConversation = db.define("group_conversation", {
	conversationName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	groupAdmin: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

// find conversation given conversation Ids
GroupConversation.findGroupConversation = async function (convoId) {
	const groupConversation = await GroupConversation.findOne({
		where: {
			conversationId: convoId
		}
	});

	// return conversation or null if it doesn't exist
	return groupConversation;
};

module.exports = GroupConversation;
