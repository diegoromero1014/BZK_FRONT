import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Label, Segment } from "semantic-ui-react";
import ToolTip from './../toolTip/toolTipComponent';

const RecentSearchBox = ({recordsRecentSearch, deleteSearch, applyRecentSearch}) => {
  const renderSearches = _ => {
    return recordsRecentSearch.map(({id, name, isSelected}) => (
      <ToolTip
        text={name}
      >
        <Label key={id} style={{margin: "2px"}} color={isSelected ? 'blue' : null}>
          <span style={{cursor: 'pointer'}} onClick={() => applyRecentSearch(id)}>
            {name.substring(0, 30).concat("...")}
          </span>
          <Icon
            key={id}
            name="delete"
            onClick={() => deleteSearch(id)}
          />
        </Label>
      </ToolTip>
    ));
  }
  return (
    <Segment style={{padding: "10px", width: '100%'}}>
      <div style={{display: "flex"}}>
        <h4 style={{margin: "3px"}}>Búsquedas recientes:</h4>
        <div style={{paddingLeft: "5px", paddingRight: "5px"}}>
          {renderSearches()}
        </div>
      </div>
    </Segment>
  );
}
RecentSearchBox.propTypes = {
  deleteSearch: PropTypes.func.isRequired,
  applyRecentSearch: PropTypes.func.isRequired,
  recordsRecentSearch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })
}
export default RecentSearchBox;