const router = require("express").Router();
const { User, Conversation, Message, GroupConversation } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
	try {
		if (!req.user) {
			return res.sendStatus(401);
		}
		const userId = req.user.id;
		const conversations = await Conversation.findAll({
			where: {
				users: {
					[Op.substring]: userId
				}
			},
			attributes: ["id"],
			order: [[Message, "createdAt", "DESC"]],
			include: [
				{
					model: GroupConversation,
					attributes: ["id", "conversationName", "groupAdmin"]
				},
				{ model: Message },
				{
					model: User,
					as: "allUser",
					where: {
						id: { [Op.ne]: userId }
					},
					attributes: ["id", "username", "photoUrl"],
					required: false
				}
			]
		});

		for (let i = 0; i < conversations.length; i++) {
			const convo = conversations[i];
			const convoJSON = convo.toJSON();

			// set property for online status of the other user
			if (convoJSON.allUser.length === 1) {
				convoJSON.otherUser = convoJSON.allUser[0];
				delete convoJSON.allUser;
				if (onlineUsers.includes(convoJSON.otherUser.id)) {
					convoJSON.otherUser.online = true;
				} else {
					convoJSON.otherUser.online = false;
				}
			} else {
				convoJSON.otherUser = {
					username: convoJSON.groupConversation.conversationName
				};
				for (let i = 0; i < convoJSON.allUser.length; i++) {
					if (onlineUsers.includes(convoJSON.allUser[i].id)) {
						convoJSON.otherUser.online = true;
						break;
					} else {
						convoJSON.otherUser.online = false;
					}
				}
			}

			// set properties for notification count and latest message preview
			convoJSON.latestMessageText = convoJSON.messages[0].text;
			convoJSON.messages = convoJSON.messages.reverse();

			// set properties for total unread message
			convoJSON.unreadMessages = convoJSON.messages.reduce((totalUnread, unreadConvo) => {
				if (!unreadConvo.receiverHasRead && unreadConvo.senderId !== req.user.id)
					return totalUnread + 1;
				return totalUnread;
			}, 0);

			conversations[i] = convoJSON;
		}

		res.json(conversations);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
