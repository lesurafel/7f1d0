const Conversation = require("./conversation");
const UserToConversation = require("./userToConversation");
const GroupConversation = require("./groupConversation");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(UserToConversation);
User.belongsToMany(Conversation, {
	through: "userToConversation",
	as: "conversations",
	foreignKey: "userId"
});

Conversation.hasMany(UserToConversation);
Conversation.belongsToMany(User, {
	through: "userToConversation",
	as: "allUser",
	foreignKey: "conversationId"
});

Conversation.hasOne(GroupConversation);
GroupConversation.belongsTo(Conversation);

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

module.exports = {
	User,
	Conversation,
	GroupConversation,
	UserToConversation,
	Message
};
