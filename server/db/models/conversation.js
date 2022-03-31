const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
	usersId: Sequelize.ARRAY(Sequelize.INTEGER)
});

// find conversation given array of user Ids

Conversation.findConversation = async function (userId) {
	const conversation = await Conversation.findOne({
		where: {
			[Op.and]: [
				{ usersId: { [Op.contains]: userId } },
				{ usersId: { [Op.contained]: userId } }
			]
		}
	});

	// return conversation or null if it doesn't exist
	return conversation;
};

module.exports = Conversation;
