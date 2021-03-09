import React, { Fragment } from 'react';
import { Container, Image } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//components


//api

//css
import './ContactList.scss'

toast.configure();

const ContactListComponent = (props) => {

  const contacts = props.contacts;
  const currentUser = props.currentUser;

  const setCurrentUser = props.setCurrentUser;
  const fetchMessages = props.fetchMessages;
  const setMessages = props.setMessages;


  const onClickContact = async (event) => {
    const newCurrentUser = event.currentTarget.getAttribute('name');

    const messages = await fetchMessages(newCurrentUser);
    const parseMessages = await messages.json();

    setMessages(parseMessages);

    setCurrentUser(newCurrentUser);
  }


  return (
    <Fragment>
      <aside>
      { contacts.map((contact, index) => {
        return (
          <Container key={'contact' + index} name={contact.user_login} className={contact.user_login === currentUser ? 'contact__container--active' : 'contact__container'} onClick={ (e) => onClickContact(e) }>
            <Container className='contact__people'>
              <Image src={contact.user_image} roundedCircle className='contact__image'></Image>
              <Container className='contact__credentials'>
                <h5>{contact.user_firstname} {contact.user_lastname}</h5>
                <p>Tchatte avec {contact.user_login} !</p>
              </Container>
            </Container>
          </Container>
        );
      }) }
      </aside>
    </Fragment>
  );
}

const ContactList = withRouter(ContactListComponent);

export default ContactList;
