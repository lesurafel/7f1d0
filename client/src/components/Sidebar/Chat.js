import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({
  conversation,
  setActiveChat,
  updateUnreadMessage,
  openedChatUser,
}) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  useEffect(() => {
    if (
      conversation.unreadMessages &&
      openedChatUser.current === conversation.otherUser.id &&
      !conversation.groupConversation
    ) {
      updateUnreadMessage(conversation);
    }
  }, [conversation, openedChatUser, updateUnreadMessage]);

  const handleClick = async (conversation) => {
    openedChatUser.current = conversation.otherUser.id;
    if (conversation.unreadMessages && !conversation.groupConversation) {
      updateUnreadMessage(conversation);
    }
    await setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent
        conversation={conversation}
        openedChatUser={openedChatUser.current}
      />
    </Box>
  );
};

export default Chat;
