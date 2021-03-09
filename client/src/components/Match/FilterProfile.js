import React from 'react';
import { withRouter } from 'react-router';
import { Button, Form, Col } from 'react-bootstrap';
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { filterByAge, filterByScore, filterByLocalisation } from '../../utils/filterUtils';

toast.configure();

const FilterProfileComponent = (props) => {

  const search = props.search;
  const setSearch = props.setSearch;

  const users = props.users;
  const setUsers = props.setUsers;


  const { score, localisation, age } = search;


  const SliderWithTooltip = createSliderWithTooltip(Slider.Range);

  const onChange = (name) => (event) => {
    try {
      setSearch({ ...search,  [name] : [event[0], event[1]] })
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleFilter = (event, users) => {
    const array = [];
    for (const userList of users)
      for (const user of userList)
        array.push(user);
    console.log(score, localisation, age);
    let filteredArray = filterByScore(array, score[0], score[1]);
    filteredArray = filterByLocalisation(filteredArray, localisation[0], localisation[1]);
    filteredArray = filterByAge(filteredArray, age[0], age[1]);
    let result = [];
    while (filteredArray.length)
      result.push(filteredArray.splice(0, 5));
    setUsers(result);
    toast.success("Utilisateurs filtrés avec succès !");
  };

  return (
    <Form>

      <Form.Label><h3>Filtrer les profils</h3></Form.Label>

      <Form.Row className="px-4 py-4">
        <Form.Group as={Col}>
          <Form.Label>Age</Form.Label>
          <SliderWithTooltip
            min={18}
            max={100}
            value={[age[0], age[1]]}
            marks={{ '18' : 18, '100': 100 }}
            tipFormatter={(v) => `${v}ans`}
            onChange={ onChange("age") }
          />
        </Form.Group>
      </Form.Row>

      <Form.Row className="px-4 py-4">
        <Form.Group as={Col}>
          <Form.Label>Distance</Form.Label>
          <SliderWithTooltip
            min={0}
            max={1000}
            value={[localisation[0], localisation[1]]}
            marks={{ '0' : 0, '1000': 1000 }}
            tipFormatter={(v) => `${v}km`}
            onChange={ onChange("localisation") }
          />
        </Form.Group>
      </Form.Row>

      <Form.Row className="px-4 py-4">
        <Form.Group as={Col}>
          <Form.Label>Popularité</Form.Label>
          <SliderWithTooltip
            min={0}
            max={1000}
            value={[score[0], score[1]]}
            marks={{ '0' : 0, '1000': 1000 }}
            tipFormatter={(v) => `${v} points`}
            onChange={ onChange('score') }
          />
        </Form.Group>
      </Form.Row>

      <Button
        className="text-uppercase mx-4 mb-4"
        variant="outline-info"
        style={{ letterSpacing: "1px", fontWeight: "bold" }}
        onClick={ (e) => handleFilter(e, users) }
      >
        Filtrer
      </Button>

    </Form>
  );
}

const FilterProfile = withRouter(FilterProfileComponent);

export default FilterProfile;
