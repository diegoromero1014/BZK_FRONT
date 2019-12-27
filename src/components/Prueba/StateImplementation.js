import React from 'react';

import ListOfElements from './ListOfElements';

export default function makeStateImplementation(title, renderFields, renderElements) {
    return class StateImplementation extends React.Component {
        state = {
            elements : []
        }
    
        updateElements = (elements) => {
            this.setState({
                elements
            })
        }

        render() {
            return (
                <ListOfElements 
                    title={title}
                    renderAddSection={renderFields}
                    elements={this.state.elements}
                    updateElements={this.updateElements}
                    renderElement={renderElements}
                />
            )
        }
    }
}