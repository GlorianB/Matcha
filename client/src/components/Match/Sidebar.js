import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import SearchProfile from './SearchProfile';
import FilterProfile from './FilterProfile';


import { sortByAge, sortByLocalisation, sortByTags, sortByScore } from '../../utils/sortUtils';


import './Sidebar.scss';

toast.configure();

const SidebarComponent = (props) => {

  const users = props.users;
  const setUsers = props.setUsers;

  const search = props.search;
  const setSearch = props.setSearch;

  const handleSort = (event, users, sortAlgo) => {
    const array = [];
    for (const userList of users)
      for (const user of userList)
        array.push(user);
    const sortedArray = array.slice().sort(sortAlgo);
    let result = [];
    while (sortedArray.length)
      result.push(sortedArray.splice(0, 5));
    setUsers(result);
    toast.success("Utilisateurs triés avec succès !")
  };


  return (
    <Fragment>
      <ProSidebar>
        <Menu iconShape="square">
        <SubMenu title="Recherche avancée">
          <SearchProfile search={props.search} setSearch={props.setSearch} getSearch={props.getSearch}/>
        </SubMenu>
          <SubMenu title="Trier">
            <MenuItem><Button variant='outline-info' onClick={(e) => handleSort(e, users, sortByAge)}>Par age</Button></MenuItem>
            <MenuItem><Button variant='outline-info' onClick={(e) => handleSort(e, users, sortByLocalisation)}>Par localisation</Button></MenuItem>
            <MenuItem><Button variant='outline-info' onClick={(e) => handleSort(e, users, sortByTags)}>Par tags en commun</Button></MenuItem>
            <MenuItem><Button variant='outline-info' onClick={(e) => handleSort(e, users, sortByScore)}>Par popularité</Button></MenuItem>
          </SubMenu>
          <SubMenu title="Filtrer">
            <FilterProfile search={search} setSearch={setSearch} users={users} setUsers={setUsers}/>
          </SubMenu>
        </Menu>
      </ProSidebar>
    </Fragment>
  );

};

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
