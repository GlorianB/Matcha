import React, { Fragment, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//api
import { sendMessage } from '../../api/chat/handleChat';


//components


//css
import './ChatInput.scss'

toast.configure();

const ChatInputComponent = (props) => {

  const socket = props.socket;
  const login = props.login;

  const [messageInput, setMessageInput] = useState('');


  const currentUser = props.currentUser;

  const fetchMessages = props.fetchMessages;
  const setMessages = props.setMessages;


  const onChangeMessageInput = (event) => {
    setMessageInput(event.target.value);
  };

  const onSubmitForm = async (event) => {
    if (!messageInput.length)
      return toast.error('Le message est vide');
    try {
      const response = await sendMessage(currentUser, messageInput);
      const parseRes = await response.json();
      if (parseRes !== "OK")
        return toast.error("Erreur lors de l'ajout du message");

      const messages = await fetchMessages(currentUser);
      const parseMessages = await messages.json();

      setMessages(parseMessages);
      setMessageInput('');
      socket.emit('chat message', currentUser, login);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Fragment>
      <Form.Group controlId="formBasicMessage" className='ChatInput__body' fluid='true'>
        <Form.Control name="message__content" type="text" placeholder="Entre ton message" onChange={ (e) => onChangeMessageInput(e) } value={ messageInput }/>
        <Button variant="primary" type="submit" onClick={ (e) => onSubmitForm(e) }>
          Envoyer
        </Button>
        </Form.Group>
    </Fragment>
  );
}

const ChatInput = withRouter(ChatInputComponent);

export default ChatInput;
