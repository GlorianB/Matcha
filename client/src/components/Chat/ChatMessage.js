import React, { Fragment } from 'react';
import { Image } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

//components


//css
import './ChatMessage.scss'

toast.configure();

const ChatMessageComponent = (props) => {
  const { user_login, user_image, message_content, message_date, currentUser } = props;

  return (
    <Fragment>
      {
        user_login === currentUser ?
          <div className='message__body--other'>
            <Image src={ user_image } roundedCircle className='message__image'></Image>
            <section className="message__content--other">
              { message_content }
            </section>
            <span className="message__date">{ moment(message_date).locale('fr').fromNow() }</span>
          </div>
        :
          <div className='message__body--user'>
            <section className="message__content--user">
              { message_content }
            </section>
            <span className="message__date">{ moment(message_date).locale('fr').fromNow() }</span>
          </div>
      }
    </Fragment>
  );
}

const ChatMessage = withRouter(ChatMessageComponent);

export default ChatMessage;
