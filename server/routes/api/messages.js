const router = require("express").Router();
const {
	Conversation,
	Message,
	GroupConversation,
	UserToConversation
} = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
	try {
		if (!req.user) {
			return res.sendStatus(401);
		}
		const senderId = req.user.id;
		const {
			recipientId,
			text,
			conversationId,
			sender,
			conversationName = null
		} = req.body;

		// if we already know conversation id, we can save time and just add it to message and return
		if (conversationId) {
			const message = await Message.create({ senderId, text, conversationId });
			return res.json({ message, sender });
		}
		// if we don't have conversation id, find a conversation to make sure it doesn't already exist
		const usersId = `${recipientId},${senderId}`;
		let conversation = await Conversation.findConversation(usersId);

		// group conversation members must be greater than 2
		if (!conversation && conversationName && usersId <= 2) return res.sendStatus(404);

		if (!conversation) {
			// create conversation
			conversation = await Conversation.create({
				users: usersId
			});
			if (onlineUsers.includes(sender.id)) {
				sender.online = true;
			}

			const arrUserId = usersId.split(",");
			arrUserId.forEach(async (userId) => {
				await UserToConversation.create({
					conversationId: conversation.id,
					userId: userId
				});
			});

			if (conversationName) {
				// create group conversation
				await GroupConversation.create({
					conversationId: conversation.id,
					conversationName: conversationName,
					groupAdmin: senderId
				});
			}
		}
		const message = await Message.create({
			senderId,
			text,
			conversationId: conversation.id
		});
		res.json({ message, sender });
	} catch (error) {
		next(error);
	}
});

// Update all unread message to read for active conversation.
router.patch("/", async (req, res, next) => {
	try {
		if (!req.user) {
			return res.sendStatus(401);
		}
		const { conversationId, senderId } = req.body;

		// protect the route against unauthorized users
		const conversation = await Conversation.findConversation(
			`${senderId},${req.user.id}`
		);

		if (conversation.id !== conversationId) {
			return res.sendStatus(403);
		}

		await Message.update(
			{ receiverHasRead: true },
			{
				where: {
					conversationId,
					senderId,
					receiverHasRead: false
				}
			}
		);
		return res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
