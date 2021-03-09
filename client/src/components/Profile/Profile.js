import React, { Fragment, useState, useEffect } from 'react';
import { Container, Form, Modal, Button, Image, Row, Col } from 'react-bootstrap';
import { withRouter } from "react-router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.scss'
import makeAnimated from 'react-select/animated';
import ReactStoreIndicator from 'react-score-indicator'
import AsyncSelect from 'react-select/async';
import { useHistory } from 'react-router-dom';



//components import
import Map from './Map';


//api import
import { getSelf, postSelf, updatePassword, updateUserPosition, fetchUserPos } from '../../api/user/handleProfile';
import { fetchTags, fetchUserTags, deleteUsertag, addTag } from '../../api/tags/handleTags';
import { addProfileImage, addSecondaryImage } from '../../api/image/uploadImage';


const ProfileComponent = (props) => {

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);

  const [inputs, setInputs] = useState({
    image : '',
    login : '',
    firstname : '',
    lastname : '',
    email : '',
    age : '',
    genre : '',
    orientation : '',
    bio : '',
    locpreference : false,
    tags : [],
    score : 0,
    latitude : 0.0,
    longitude : 0.0
  });

  const [imageInputs, setImageInputs] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  const [passwordInputs, setPasswordInputs] = useState({
    password : '',
    confirmPassword : ''
  });

  const [newTagInput, setNewTagInput] = useState('');

  const [tagListInput, setTagListInput] = useState([]);

  const [showMap, setShowMap] = useState(true);



  const default_image_path = 'https://image.flaticon.com/icons/png/512/1177/1177577.png';

  const { image, login, firstname, lastname, email, age, genre, orientation, bio, locpreference, tags, score, latitude, longitude } = inputs;

  const { image1, image2, image3, image4 } = imageInputs;

  const { password, confirmPassword } = passwordInputs;

  const newTag = newTagInput;
  const tagList = tagListInput;

  const location = props.location;

  const history = useHistory();

  useEffect(() => {
    getUser();
    handleToastHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeInput = (event) => {
    setInputs({ ...inputs , [event.target.name] : (event.target.name === 'locpreference' ? event.target.checked : event.target.value) });
  };

  const onChangeInputPassword = (event) => {
    setPasswordInputs({ ...passwordInputs , [event.target.name] : event.target.value });
  };

  const onChangeInputTag = (event) => {
    setNewTagInput(event.target.value);
  }

  const onSubmitForm = async (event) => {
    event.preventDefault();
    const body = { login, firstname, lastname, email, age, genre, orientation, bio, locpreference, tagList };
    try {
      const response = await postSelf(body);

      const user = await response.json();
      if (user === 'OK') {
        toast.success("Profil mis a jour ! Vous pouvez matcher");
        setShowMap(locpreference);
      }
      else
        toast.error(user);
    } catch (e) {
      console.error(e.message)
    }
  };

  const onPasswordChange = async (event) => {
    event.preventDefault();
    const body = { password, confirmPassword };
    try {
      const response = await updatePassword(body);

      const user = await response.json();
      if (user === "OK")
        toast.success("Le mot de passe a été modifié");
      else
        toast.error(user);
      setPasswordInputs({ 'password' : '', 'confirmPassword' : '' });
    } catch (e) {
      console.error(e.message);
    } finally {
      setShowModal(false);
    }
  };

  const onSubmitTag = async (event) => {
    event.preventDefault();
    const body = { newTag };
    try {
      const tmp = { value: newTag.trim(), label: newTag.trim() };

      if (tags.includes(tmp))
        return toast.error("Ce tag existe deja");

      const response = await addTag(body);

      const parseRes = await response.json();
      if (parseRes === 'OK') {
        let tags_array = [ ...tags ];
        tags_array.push({'value' : newTag, 'label' : newTag});

        setNewTagInput('');
        setInputs({ ...inputs, tags: tags_array });

        toast.success("Nouveau tag ajouté avec succes !");
      }
      else
        toast.error(parseRes);
    } catch (e) {
      console.error(e.message)
    }
  };

  const onChangeTagList = async (selectOption, selectAction) => {
    try {
      const {action, option, removedValue} = selectAction;
      if (action === 'select-option') {
        setTagListInput([...tagList, option]);
      }
      else if (action === 'remove-value') {
        const body = { 'tag' : removedValue };

        const response = await deleteUsertag(login, body);

        const parseRes = await response.json();
        if (parseRes === 'OK') {
          const newTagList = tagList.filter(tag => tag !== removedValue);
          setTagListInput(newTagList);
          toast.success('Tag supprimé avec succes');
        }
        else
          toast.error('Probleme rencontré lors de la suppression de tags')
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const getUser = async () => {
    try {
      const response = await getSelf();

      const user = await response.json();

      // handle tags
      const parseTagsResponse = await getTags();
      let parseTags = await parseTagsResponse.json();

      // handle array
      let tags_array = [];

      for (const tags of parseTags)
        tags_array.push({'value' : tags.tag_name, 'label' : tags.tag_name});

      //handle inputs
      setInputs({
        ...inputs, image : user.user_image, login : user.user_login, firstname : user.user_firstname,
        lastname : user.user_lastname, email : user.user_email, age : (user.user_age ? user.user_age : 18), genre : (user.user_genre ? user.user_genre : 'homme'),
        orientation : (user.user_orientation ? user.user_orientation : 'hetero'), bio : user.user_bio, locpreference : user.user_locpreference, tags : tags_array, score : user.user_score, latitude : user.user_latitude, longitude : user.user_longitude
      });


      setImageInputs({
        ...imageInputs, image1 : user.user_image1, image2 : user.user_image2, image3 : user.user_image3, image4 : user.user_image4
      });

      const usertags = await getUserTags();
      if (usertags.constructor === Array)
        setTagListInput(usertags);

      setShowMap(user.user_locpreference);

    } catch (e) {
      console.error(e);
    }
  };


  const getTags = async () => {
    try {
      const response = await fetchTags();

      return response;
    } catch (e) {
      console.error(e.message);
    }
  };

  const getUserTags = async () => {
    try {
      const response = await fetchUserTags();

      const parseRes = response.json();
      return parseRes;
    } catch (e) {
      console.error(e.message)
    }
  };

  const getUserPosition = async () => {
    try {
      const response = await fetchUserPos();
      const parseRes = await response.json();
      return  parseRes;
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleCloseModal = () => {
    setPasswordInputs({
      password : '',
      confirmPassword : ''
    });
    setShowModal(false);
  };

  const handleImageError = (event) => {
    event.target.src = default_image_path;
  }

  const handleUploadImage = async (event) => {
    const newImage = event.target.files[0];
    const newImageName = event.target.name;

    if (newImage) {
      try {
        const fd = new FormData();
        fd.append('photoProfile', newImage);

        const response = await addProfileImage(fd);

        const parseRes = await response.json();
        if (parseRes === "OK") {
          const imageUrl = `http://localhost:8000/image/${login}/${newImageName}`;
          setInputs({ ...inputs, image : imageUrl });
          toast.success("Ajout de l'image en cours");
          setTimeout(() => {
            window.location = '/user/self/';
          }, 5000);
        }
        else
          toast.error(parseRes);
      } catch (e) {
        console.error(e.message)
      }
    }
  };

  const handleToastHistory = () => {
    if (location.state) {
      if (location.state.toast_register_success)
        toast.success(location.state.toast_register_success);
      else if (location.state.toast_register_failure)
          toast.error(location.state.toast_register_failure);
      history.push({
        pathname: '/',
      });
    }
  }

  const handleUploadSecondaryImage = async (event) => {
    const newImage = event.target.files[0];
    const newImageName = event.target.name;
    const numeroImage = newImageName.slice(-1);

    if (newImage) {
      try {
        const fd = new FormData();
        fd.append(newImageName, newImage);

        const response = await addSecondaryImage(numeroImage, fd);

        const parseRes = await response.json();
        if (parseRes === "OK") {
          const imageUrl = `http://localhost:8000/image/${login}/photo/${numeroImage}`;
          setImageInputs({ ...imageInputs, ["photo" + numeroImage] : imageUrl });
          toast.success("Ajout de l'image en cours");
          setTimeout(() => {
            window.location = '/user/self/';
          }, 5000);
        }
        else
          toast.error(parseRes);
      } catch (e) {
        console.error(e.message)
      }
    }
  };

  return (
    <Fragment>
      <Container>
        <Row>
          <h1>Profile</h1>
        </Row>
        <Row>
          <Col xs={6} md={{ span: 6, offset: 0 }} className='imageUpload'>
            <h2>Bonjour {login} !</h2>
          </Col>
          <Col xs={6} md={{ span: 6, offset: 3 }} className='imageUpload'>
            <ReactStoreIndicator
              value={score}
              maxValue={1000000}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={{ span: 6, offset: 5 }} className='imageUpload'>
            <label htmlFor="single" className="imgProfile mb-0">
              <Image src={image ? image : default_image_path} roundedCircle className='profile_img' onError={ handleImageError }/>
            </label>
            <input
              type="file"
              name="photoProfile"
              id="single"
              onChange={(e) => handleUploadImage(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col className='imageUpload mt-5'>
            <label htmlFor="photo1" className="imgProfile mb-0">
              <Image src={image1 ? image1 : default_image_path} roundedCircle className='profile_img' onError={ handleImageError }/>
            </label>
            <input
              type="file"
              name="photo1"
              id="photo1"
              onChange={(e) => handleUploadSecondaryImage(e)}
            />
          </Col>
          <Col className='imageUpload mt-5'>
            <label htmlFor="photo2" className="imgProfile mb-0">
              <Image src={image2 ? image2 : default_image_path} roundedCircle className='profile_img' onError={ handleImageError }/>
            </label>
            <input
              type="file"
              name="photo2"
              id="photo2"
              onChange={(e) => handleUploadSecondaryImage(e)}
            />
          </Col>
          <Col className='imageUpload mt-5'>
            <label htmlFor="photo3" className="imgProfile mb-0">
              <Image src={image3 ? image3 : default_image_path} roundedCircle className='profile_img' onError={ handleImageError }/>
            </label>
            <input
              type="file"
              name="photo3"
              id="photo3"
              onChange={(e) => handleUploadSecondaryImage(e)}
            />
          </Col>
          <Col className='imageUpload mt-5'>
            <label htmlFor="photo4" className="imgProfile mb-0">
              <Image src={image4 ? image4 : default_image_path} roundedCircle className='profile_img' onError={ handleImageError }/>
            </label>
            <input
              type="file"
              name="photo4"
              id="photo4"
              onChange={(e) => handleUploadSecondaryImage(e)}
            />
          </Col>
        </Row>
      </Container>
      <section className='container my-5'>
        <Form.Label>Login</Form.Label>
        <Form.Group>
          <Form.Control name='login' type="text" placeholder="Ton login" value={ login } onChange={(e) => onChangeInput(e)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Prenom</Form.Label>
          <Form.Control name='firstname' type="text" placeholder="Ton prenom" value={ firstname } onChange={(e) => onChangeInput(e)} />
        </Form.Group>

        <Form.Group >
          <Form.Label>Nom</Form.Label>
          <Form.Control name='lastname' type="text" placeholder="Ton nom" value={ lastname } onChange={(e) => onChangeInput(e)} />
        </Form.Group>

        <Form.Group >
          <Form.Label>Email</Form.Label>
          <Form.Control name='email' type="email" placeholder="Ton email" value={ email } onChange={(e) => onChangeInput(e)} />
            <Form.Text className="text-muted">
              On ne partegera jamais votre adresse email.
            </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Age</Form.Label>
            <Form.Control name='age' type="range" min="18" max="100" value={ age } onChange={(e) => onChangeInput(e)} className="slider" id="myRange" />
            <Form.Text className="text-muted">
              {age ? age : 18}
            </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Genre</Form.Label>
          <Form.Control as='select' name='genre' value={ genre } onChange={(e) => onChangeInput(e)}>
            <option value='homme'>Homme</option>
            <option value='femme'>Femme</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBasicOrientation">
          <Form.Label>Orientation</Form.Label>
          <Form.Control as='select' name='orientation' value={ orientation } onChange={(e) => onChangeInput(e)}>
            <option value='hetero'>Hetero</option>
            <option value='gay'>Gay</option>
            <option value='bi'>Bi</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBasicBio">
          <Form.Label>Description</Form.Label>
          <Form.Control as='textarea' name='bio' placeholder='Description de vous' value={bio} onChange={(e) => onChangeInput(e)}>
          </Form.Control>
        </Form.Group>

        <Button variant="warning" onClick={handleShowModal} className='my-5'>
          Modifier le mot de passe
        </Button>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modification du mot de passe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control name='password' type="password" placeholder="Ton nouveau mdp" value={password} onChange={(e) => onChangeInputPassword(e)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirmer mot de passe</Form.Label>
              <Form.Control name='confirmPassword' type="password" placeholder="Confirme ton nouveau mdp" value={confirmPassword} onChange={(e) => onChangeInputPassword(e)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button variant="primary" onClick={onPasswordChange}>
              Valider
            </Button>
          </Modal.Footer>
        </Modal>
        <Form.Group>
          <Form.Label>Tags</Form.Label>
          <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions={tags}
          value={ tagList }
          components={ () => makeAnimated() }
          onChange={ (selectOption, selectAction) => onChangeTagList(selectOption, selectAction) }
          />
        </Form.Group>
        <Form.Group controlId="formBasicSendTag">
          <Form.Label>Ajouter un tag</Form.Label>
          <Form.Control name='newTag' type="text" placeholder="Ajoute un nouveau tag" value={ newTag } onChange={ (e) => onChangeInputTag(e) }/>
          <button className='btn btn-primary my-3' onClick={(e) => onSubmitTag(e)}>Ajouter un tag</button>

        </Form.Group>
        <Form.Group>
          <Form.Check
            name='locpreference'
            type="switch"
            id="custom-switch"
            label="Activer la localisation"
            checked={locpreference}
            onChange= {(e) => onChangeInput(e)}/>
        </Form.Group>
        { showMap ? <Map getPosition={getUserPosition} updatePosition={updateUserPosition} userLatitude={latitude} userLongitude={longitude}/> : null }
      </section>
      <button className='btn btn-success btn-block my-5' onClick={(e) => onSubmitForm(e)}>Modifier le profile</button>
    </Fragment>
  );

};

const Profile = withRouter(ProfileComponent);

export default Profile;
