import React, { PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react';

const DropdownComponent = ({ data, icon = 'ellipsis vertical', options }) => {

    const buildOptions = () => options.map(({ icon, text, onClick }, index) => (
        <Dropdown.Item
            icon={icon ? icon : null}
            key={index}
            text={text} 
            onClick={() => onClick && onClick(data)}
            style={{ borderBottom: '1px solid rgba(34,36,38,.1)' }}
        />
    ));

    return (
        <Dropdown icon={icon} labeled button>
            <Dropdown.Menu>
                {buildOptions()}
            </Dropdown.Menu>
        </Dropdown>
    );
};

DropdownComponent.PropTypes = {
    data: PropTypes.object.isRequired,
    icon: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            icon: PropTypes.string,
            onClick: PropTypes.func.isRequired,
        })
    ).isRequired,
}

export default DropdownComponent;