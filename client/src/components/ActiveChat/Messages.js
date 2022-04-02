import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { conversation, userId } = props;
  const { messages, otherUser, allUser, groupConversation } = conversation;
  let otherUserCopy = otherUser;

  const findUser = (message) => {
    return allUser.find((user) => user.id === message.senderId);
  };

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        if (groupConversation) otherUserCopy = findUser(message);

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUserCopy}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
