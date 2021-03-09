import React, { Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//components
import ChatMessage from './ChatMessage';

//css
import './ChatBox.scss'

toast.configure();

const ChatBoxComponent = (props) => {

  const messages = props.messages;
  const currentUser = props.currentUser;

  return (
    <Fragment>
    {
      Array.isArray(messages) ?
      <Container fluid className='Chatbox__container'>
        { messages.map((message, index) => {
          return <ChatMessage key={'message' + index} user_login={message.user_login} user_image={message.user_image} message_content={message.message_content} message_date={message.message_date} currentUser={currentUser}/>
        }) }
      </Container>
      :
      <Container fluid className='Chatbox__container'>
      <p>Fais le premier pas !</p>
      </Container>
    }
    </Fragment>
  );
}

const ChatBox = withRouter(ChatBoxComponent);

export default ChatBox;
