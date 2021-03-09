import React, { Fragment, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//components
import ContactList from './ContactList';
import ChatBox from './ChatBox';
import ChatInput from './ChatInput';

//api

import { fetchContacts } from '../../api/contacts/handleContacts';

import { fetchMessages } from '../../api/chat/handleChat';


//css
import './Chat.scss'

toast.configure();

const ChatComponent = (props) => {

  const socket = props.socket;


  const [isComplete, setIsComplete] = useState(false);

  const [currentUser, setCurrentUser] = useState('');

  const [contacts, setContacts] = useState([]);

  const [messages, setMessages] = useState([]);


  const getContacts = async () => {
    const response = await fetchContacts();
    const parseRes = await response.json();


    if (parseRes.length) {
      setContacts(parseRes);
      const current = parseRes[0].user_login;
      setIsComplete(true);
      setCurrentUser(current);
      const messages = await fetchMessages(current);
      const parseMessages = await messages.json();
      if (Array.isArray(parseMessages))
        setMessages(parseMessages);
    }
  };

  socket.on('new message', (sender_login) => {
    getContacts();
  });

  useEffect(() => {
    getContacts();
  }, []);

  return (
    isComplete ?
      <Fragment>
        <Container className='Chat__container'>
          <Row className='Chat__body'>
            <Col xs={3} className='contactList mr-0'>
              <ContactList contacts={contacts} currentUser={currentUser} setCurrentUser={setCurrentUser} setMessages={setMessages} fetchMessages={fetchMessages} socket={socket}/>
            </Col>
            <Col xs={9} className='Chat__side-right'>
              <Row className='chatbox'>
                <ChatBox currentUser={currentUser} messages={messages} setMessages={setMessages} socket={socket}/>
              </Row>
              <Row className='chatinput'>
                <ChatInput currentUser={currentUser} fetchMessages={fetchMessages} setMessages={setMessages} socket={socket}/>
              </Row>
            </Col>
          </Row>
        </Container>
      </Fragment>
    :
      <Fragment>
        <Container fluid>
          <Row>
            <Col xs={10}>
              <h1>Tu dois d'abord ajouter des contacts !</h1>
            </Col>
          </Row>
        </Container>
      </Fragment>
  );
}

const Chat = withRouter(ChatComponent);

export default Chat;
