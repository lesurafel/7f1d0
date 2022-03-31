const Conversation = require("./conversation");
const UserGroup = require("./userGroup");
const GroupConversation = require("./groupConversation");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(UserGroup);
Conversation.hasMany(UserGroup);
Conversation.hasOne(GroupConversation);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Conversation);
GroupConversation.belongsTo(Conversation);
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
	User,
	Conversation,
	GroupConversation,
	UserGroup,
	Message
};
