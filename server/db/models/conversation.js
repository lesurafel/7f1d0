const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
	users: {
		type: Sequelize.STRING,
		unique: true,
		set(value) {
			this.setDataValue("users", value.split(",").sort().join(","));
		}
	}
});

// find conversation given users(string) Ids
Conversation.findConversation = async function (usersId) {
	const newUsersId = usersId.split(",").sort().join(",");
	const conversation = await Conversation.findOne({
		where: {
			users: newUsersId
		}
	});

	// return conversation or null if it doesn't exist
	return conversation;
};

module.exports = Conversation;
