import React, { Fragment, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//components
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';

//css
import './Match.scss'

//api
import checkComplete from '../../api/match/complete';
import fetchMatch from '../../api/match/fetchMatch';

toast.configure();

const MatchComponent = (props) => {

  const socket = props.socket;

  const [isComplete, setIsComplete] = useState(false);

  const [search, setSearch] = useState({
    selectedTags: [],
    commonTags: [],
    age: [18, 100],
    localisation: [0, 0],
    score: [0, 0]
  });

  const [users, setUsers] = useState([]);

  const isComp = async () => {
    await checkComplete(setIsComplete);
  };

  const checkMatch = async (body) => {
    const response = await fetchMatch(body);

    const users = await response.json();
    setMatch(users);
  };

  const getSearch = async () => {
    await checkMatch({ ...search, 'applySearch' : true })
    toast.success("Recherche effectuée avec succès !");
  };

  const setMatch = (users) => {
    setUsers(users);
  };

  useEffect(() => {
    isComp();
    const getMatch = async () => {
      await checkMatch({ 'applySearch' : false });
    };
    getMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    isComplete ?
      <Fragment>
        <Container fluid className='main-matchComponent'>
         <Row>
          <Col xs={2}>
            <Sidebar users={users} setUsers={setUsers} search={search} setSearch={setSearch} getSearch={getSearch}/>
          </Col>
          <Col xs={10}>
            <p> Nombre d'utilisateurs trouvés: {users.length} </p>
            { users.map((value, index) => {
              return (
                <Row key={'users' + index}>
                  { value.map((user, i) => {
                    return (
                      <Col key={'user' + i}>
                        <ProfileCard user={user} users={users} setUsers={setUsers} socket={socket} login={props.login}/>
                      </Col>
                    );
                  }) }
                </Row>
              );
            }) }
          </Col>
         </Row>
       </Container>
      </Fragment>
    :
      <Fragment>
        <Container fluid>
          <Row>
            <Col xs={10}>
              <h1>Tu dois d'abord completer ton profile !</h1>
            </Col>
          </Row>
        </Container>
      </Fragment>
  );

};

const Match = withRouter(MatchComponent);

export default Match;
