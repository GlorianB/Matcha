import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Button, Form, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import makeAnimated from "react-select/animated";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";

import { getCommonTags } from '../../api/tags/handleTags';

const SearchProfileComponent = (props) => {

  const search = props.search;
  const setSearch = props.setSearch;
  const getSearch = props.getSearch;

  const { selectedTags, commonTags, age, localisation, score } = search;


  const SliderWithTooltip = createSliderWithTooltip(Slider.Range);

  const readCommonTags = async () => {
    const response = await getCommonTags();
    const commonTags = await response.json();
    const tags = [];
    for (const tag of commonTags)
      tags.push({ value: tag.tag_name, label: tag.tag_name })
    setSearch({ ...search, commonTags : tags });
  };

  const onChangeTags = (selectOption, selectAction) => {
    try {
      const {action, option, removedValue} = selectAction;
      if (action === 'select-option')
        setSearch({ ...search, 'selectedTags' : [ ...selectedTags , option] });
      else if (action === 'remove-value') {
        const newTagList = selectedTags.filter(tag => tag !== removedValue);
        setSearch({ ...search, selectedTags : newTagList });
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const onChange = (name) => (event) => {
    try {
      setSearch({ ...search,  [name] : [event[0], event[1]] })
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    readCommonTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form>

      <Form.Label><h3>Rechercher des profils</h3></Form.Label>

      <Form.Row className="px-4 py-4">
        <Form.Group as={Col}>
          <Form.Label>Tags</Form.Label>
            <AsyncSelect
              isMulti
              cacheOptions
              components={ () => makeAnimated() }
              value={ selectedTags }
              defaultOptions={ commonTags }
              onChange={ (selectOption, selectAction) => onChangeTags(selectOption, selectAction) }
            />
        </Form.Group>
      </Form.Row>

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
        onClick={getSearch}
      >
        Valider
      </Button>

    </Form>
  );
}

const SearchProfile = withRouter(SearchProfileComponent);

export default SearchProfile;
