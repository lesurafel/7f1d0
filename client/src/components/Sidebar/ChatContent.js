import React from 'react';
import { Badge, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: '#9CADC8',
    letterSpacing: -0.17,
  },
  unreadMessages: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    marginRight: 25,
  },
  unreadMessagesPreviewText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
}));

const ChatContent = ({ conversation, openedChatUser }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;
  const unreadMessages = conversation.id && conversation.unreadMessages;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            conversation.id &&
            unreadMessages !== 0 &&
            conversation.otherUser.id !== openedChatUser
              ? classes.unreadMessagesPreviewText
              : classes.previewText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      {conversation.id &&
        unreadMessages !== 0 &&
        conversation.otherUser.id !== openedChatUser && (
          <Box>
            <Badge
              classes={{ badge: classes.unreadMessages }}
              badgeContent={unreadMessages}
            ></Badge>
          </Box>
        )}
    </Box>
  );
};

export default ChatContent;
