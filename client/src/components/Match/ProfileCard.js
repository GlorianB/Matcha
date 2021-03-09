import React from 'react';
import { Container, Row, Col, Card, Carousel, Image } from 'react-bootstrap';
import { withRouter, useHistory } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { postLike } from '../../api/like/handleLikes';

import './ProfileCard.scss';


const ProfileCardComponent = (props) => {

  const socket = props.socket;

  const { user, users, setUsers } = props;
  user.images = [user.image, user.image1, user.image2, user.image3, user.image4]

  const history = useHistory();

  const handleImageError = (event) => {
    event.target.src = process.env.PUBLIC_URL + '/default_picture.png';
  }

  const handleLike = async (event) => {
    event.stopPropagation();
    const like = await postLike(user.login);
    const parseLike = await like.json();
    if (parseLike !== "OK")
      return toast.error("Erreur lors de l'ajout de like");
    let array = [];
    for (const userList of users)
      for (const usr of userList)
        array.push(usr);
    array = array.filter(elem => JSON.stringify(elem) !== JSON.stringify(user));
    const result = [];
    while(array.length)
      result.push(array.splice(0, 5))
    setUsers(result);
    toast.success("Utilisateur liké avec succès");
    socket.emit('like', user.login, props.login);
  };

  const handleRedirect = async (event) => {
    const link = `/user/${user.login}`;
    history.push(link);
  };

  return (
    <Container className='ProfileCard'>
      <Card style={{ width: '18rem' }}>
        <Carousel>
          {user.images.map((value,  index) => {
            if (!value)
              return null;
            return (
              <Carousel.Item key={'user' + index}>
                <Image className='card__carousel--image' src={ user.images[index] } onError={ (e) => handleImageError(e) } thumbnail onClick={ (e) => handleRedirect(e) }/>
              </Carousel.Item>
            );
          })}
        </Carousel>
        <Card.Body>
          <Row>
            <Col xs={10}>
              <Card.Title>{user.login}</Card.Title>
              <Card.Subtitle>{user.firstname} {user.lastname}</Card.Subtitle>
              <Card.Subtitle> {user.age} ans</Card.Subtitle>
              <Card.Text>
              </Card.Text>
            </Col>
            <Col className="ProfileCard__like">
              <FontAwesomeIcon icon="heart" className='like__icon' onClick={ (e) => handleLike(e) }/>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );

};

const ProfileCard = withRouter(ProfileCardComponent);

export default ProfileCard;
