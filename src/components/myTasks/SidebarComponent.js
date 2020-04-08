import React from "react";
import Sidebar from "react-sidebar";
import AdvancedFilters from './AdvancedFilters';


class SidebarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.styles = {
            sidebar: {background: "white", width: "450px"},
            root: {position: 'initial'},
            content: {position: 'initial'}
        }
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    render() {
        const {dispatchFilters, getDefaultFilters} = this.props;
        return (
            <div>
                <Sidebar
                    sidebar={
                        <div>
                            <AdvancedFilters getDefaultFilters={getDefaultFilters} dispatchFilters={dispatchFilters} doneFilter={this.onSetSidebarOpen}/>
                        </div>
                    }
                    open={this.state.sidebarOpen}
                    styles={this.styles}
                    pullRight={true}
                />

                <div
                    style={{textAlign: "right"}}>
                    <button id="btnFilter"
                            className="btn"
                            title="Filtrar"
                            type="button"
                            style={{backgroundColor: "#e0e0d1"}}
                            onClick={() => this.onSetSidebarOpen(true)}>
                        <i className="filter icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                        Filtrar
                    </button>
                </div>

            </div>

        );
    }

}

export default SidebarComponent;