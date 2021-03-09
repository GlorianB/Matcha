import React, { Fragment, useState, useEffect, } from 'react';
import { Accordion, Alert, Badge, Carousel, Container, Card, Button, Image, Row, Col } from 'react-bootstrap';
import ReactStoreIndicator from 'react-score-indicator';
import { useHistory, withRouter, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import * as jwt from 'jsonwebtoken';


import { getLikes, checkLike, checkAlreadyLike, postLike, deleteLike } from '../../api/like/handleLikes';
import { checkBlock, postBlock, deleteBlock } from '../../api/blocked/handleBlock';
import { checkVisit, postVisit } from '../../api/visit/handleVisits';
import { checkContact } from '../../api/contacts/handleContacts';



import './User.scss';


//api
import { getSelf, getUserProfile } from '../../api/user/handleProfile';
import { fetchUserTags, fetchTagsByLogin } from '../../api/tags/handleTags';


const UserComponent = (props) => {

  const socket = props.socket;

  const { param_login } = useParams();

  const [user, setUser] = useState({
    login : '',
    firstname : '',
    lastname : '',
    age : 0,
    genre : '',
    orientation : '',
    bio : '',
    score : '0',
    lastlogin : null,
    latitude : 0,
    longitude : 0
  });

  const [images, setImages] = useState({
    image : '',
    image1 : '',
    image2 : '',
    image3 : '',
    image4 : ''
  });

  const [tags, setTags] = useState([]);

  const [likeList, setLikeList] = useState([]);

  const [visitList, setVisitList] = useState([]);

  const [profileCompleted, setProfileCompleted] = useState(false);

  const [alreadyLike, setAlreadyLike] = useState(false);

  const [like, setLike] = useState(false);

  const [blocked, setBlocked] = useState(false);

  const [contact, setContact] = useState(false);

  toast.configure();
  const history = useHistory();


  const { login, firstname, lastname, age, genre, orientation, bio, score, lastlogin } = user;

  const userImages = [images.image, images.image1, images.image2, images.image3, images.image4];

  const handleImageError = (event) => {
    event.target.src = process.env.PUBLIC_URL + '/default_picture.png';
  }

  const handleLike = async (event) => {
    event.stopPropagation();
    if (like) {
      await delLike(param_login);
      socket.emit('unlike', user.login, props.login);
    }
    else {
      await addLike(param_login);
      socket.emit('like', user.login, props.login);
    }
  };

  const addLike = async (login) => {
    const like = await postLike(login);
    const parseLike = await like.json();
    if (parseLike !== "OK")
      return toast.error("Erreur lors de l'ajout de like");
    setLike(true);
    return toast.success("Utilisateur liké avec succès");
  };

  const delLike = async (login) => {
    const like = await deleteLike(login);
    const parseLike = await like.json();
    if (parseLike !== "OK")
      return toast.error("Erreur lors de la suppression de like");
    setLike(false);
    return toast.success("Utilisateur unliké avec succès");
  };


  const handleBlock = async (event) => {
    if (blocked)
      await delBlock(param_login);
    else
      await addBlock(param_login);
  };

  const addBlock = async (login) => {
    const block = await postBlock(login);
    const parseBlock = await block.json();
    if (parseBlock !== "OK")
      return toast.error("Erreur lors du blocage de cet utilisateur");
    setBlocked(true);
    setLike(false);
    return toast.success("Utilisateur bloqué avec succès");
  };

  const delBlock = async (login) => {
    const block = await deleteBlock(login);
    const parseBlock = await block.json();
    if (parseBlock !== "OK")
      return toast.error("Erreur lors du deblocage de l'utilisateur");
    setBlocked(false);
    return toast.success("Utilisateur débloqué avec succès");
  };

  const handleReport = (event) => {
    toast.success("Le compte a été signalé");
  }

  const getAlreadyLike = async () => {
    try {
      const response = await checkAlreadyLike(param_login);

      const parseRes = await response.json();
      setAlreadyLike(parseRes);
    } catch (e) {
      console.error('error getAlreadyLike');
    }
  };

  const getLike = async () => {
    try {
      const response = await checkLike(param_login);

      const parseRes = await response.json();
      setLike(parseRes);
    } catch (e) {
      console.error('error getLike');
    }
  };

  const getBlock = async () => {
    try {
      const response = await checkBlock(param_login);

      const parseRes = await response.json();
      setBlocked(parseRes);
    } catch (e) {
      console.error('error getBlock');
    }
  };

  const getContact = async () => {
    try {
      const response = await checkContact(param_login);

      const parseRes = await response.json();
      setContact(parseRes);
    } catch (e) {
      console.error('error getContact');
    }
  };

  const addVisit = async () => {
    try {
      const response = await postVisit(param_login);
      const parseRes = await response.json();
      if (parseRes === 'OK')
        socket.emit('visit', param_login, props.login);
      else
        console.error('error addVisit');
    } catch (e) {
      console.error('error addVisit');
    }
  };

  const getUser = async () => {
    const response = (param_login === 'self') ? await getSelf() : await getUserProfile(param_login);
    const user = await response.json();

    if (user === 'error') {
      history.push('/');
      return toast.error("Cet utilisateur n'existe pas");
    }

    //convert date

    setUser({ login : user.user_login, firstname : user.user_firstname,
      lastname : user.user_lastname, age : user.user_age, genre : user.user_genre, orientation : user.user_orientation,
      bio : user.user_bio, score : user.user_score, lastlogin : user.user_lastlogin, latitude : user.user_latitude, longitude : user.user_longitude });

    if (user.user_image)
      setProfileCompleted(true);
    setImages({ image : user.user_image, image1 : user.user_image1, image2 : user.user_image2, image3 : user.user_image3, image4 : user.user_image4 });

    const tagsResponse = (param_login === 'self') ? await fetchUserTags() : await fetchTagsByLogin(param_login);
    const parseTagsResponse = await tagsResponse.json();
    if (parseTagsResponse && parseTagsResponse.constructor === Array)
      setTags(parseTagsResponse);

    await getVisits();
    await getAllLikes();
  };

  const getVisits = async () => {
    try {
      const response = await checkVisit();
      const parseRes = await response.json();

      const result = parseRes.splice(-5);
      setVisitList(result);
    } catch (e) {
      console.error(e);
    }
  };

  const getAllLikes = async () => {
    try {
      const response = await getLikes();
      const parseRes = await response.json();

      const result = parseRes.splice(-5);
      setLikeList(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUser = async () => {
    const token = localStorage.getItem('jwt');
    const result = jwt.decode(token);
    const user_login = result.user.user_login;
    if (user_login === param_login)
      history.push('/user/self')
    await getUser();
  };

  useEffect(() => {
    handleUser();

    // const interval = setInterval(() => {
    //   handleUser();
    // }, 3000);

    if (param_login !== 'self') {
      getAlreadyLike();
      getLike();
      getBlock();
      addVisit();
      getContact();
    }

    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    !blocked ?
      <Fragment>
        <Container fluid className="userprofile">
        {alreadyLike && param_login !== 'self' ?
          <Alert variant="success" onClose={() => setAlreadyLike(false)} dismissible>
            <Alert.Heading> {param_login} vous kiffe !</Alert.Heading>
            <p>
              { !contact ? 'Likez le/la en retour !' : 'Vous et {param_login} avez matché' }
            </p>
        </Alert>
        :
          null
        }
          <h1>{ login }</h1>
          <section>
            <ReactStoreIndicator
              value={score}
              maxValue={1000000}
            />
          </section>
          <section>
            <Carousel>
              {userImages.map((value,  index) => {
                if (!value)
                  return null;
                return (
                  <Carousel.Item key={'carousel' + index}>
                    <Image className='card__carousel--image' src={ userImages[index] } onError={ (e) => handleImageError(e) } thumbnail/>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </section>
          <p>{ lastlogin ? "Derniere connexion: " + moment(lastlogin).locale('fr').fromNow() : 'En ligne' }</p>
          <p>Nom : { lastname }</p>
          <p>Prenom : { firstname }</p>
          <p>Age : { age }</p>
          <p>Ville : test</p>
          <p>Sexe : { genre }</p>
          <p>Orientation : { orientation }</p>
          <p>bio : { bio }</p>
          <h1>Interets de { login }</h1>
          <section className='tags__section'>
            {tags.length ? null : <p>{ login } n'a pas encore ajouté de tags</p>}
            {tags.map((value, index) => {
              if (!value)
                return null;
              return (
                <h2 key={'tags' + index} className='tag'>
                  <Badge variant='primary'>{value.label}</Badge>
                </h2>
              );
            })}
          </section>
          <section className='actions__section'>
            {
              param_login === 'self' ?
                null
              :
              <>
                <h1>Actions</h1>
                <Row>
                  { profileCompleted ? <Col><p>Like</p><FontAwesomeIcon icon="heart" className={ like ? 'like__icon--activated' : 'like__icon'} onClick={ (e) => handleLike(e) } /></Col> : null }
                  <Col>
                    <p>Report</p>
                    <FontAwesomeIcon icon="flag" className='flag__icon' onClick={ (e) => handleReport(e) }/>
                  </Col>
                  <Col>
                    <p>Bloquer</p>
                    <FontAwesomeIcon icon="times-circle" className={ blocked ? 'block__icon--activated' : 'block__icon'} onClick={ (e) => handleBlock(e) }/>
                  </Col>
                </Row>
              </>
            }
          </section>
          {param_login === 'self' ?
            <Accordion defaultActiveKey="0" className='consultContainer'>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Consulter mes 5 derniers likes
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {likeList.length ? null : <p>Vous n'avez pas encore de likes</p>}
                    {likeList.map((liker_name, index) => {
                      return <p key={'liker' + index}><Link to={'/user/' + liker_name}>{liker_name}</Link></p>
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Consulter mes 5 dernieres visites
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    {visitList.length ? null : <p>Vous n'avez pas encore de visites</p>}
                    {visitList.map((visiter_name, index) => {
                      return <p key={'visiter' + index}><Link to={'/user/' + visiter_name}>{visiter_name}</Link></p>
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          :
            null
          }
        </Container>
      </Fragment>
    :
      <Fragment>
        <Container fluid className="userprofile">
          <h1>Vous avez bloqué cet utilisateur</h1>
          <Row>
            <Col>
              <Button variant='danger' onClick={ (e) => handleBlock(e) }>Débloqué?</Button>
            </Col>
          </Row>
        </Container>
      </Fragment>
  );

};

const User = withRouter(UserComponent);

export default User;
