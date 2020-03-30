import React, { Component } from "react";
import moment from "moment";
import GridComponent from "../grid/component";
import { MODAL_TITLE } from "./constants";
import { MODULE_TASKS } from "../../constantsGlobal";
import _ from "lodash";
import { VIEW_TASK_ADMIN } from "../modal/constants";

class ListMyTasksComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: "",
      order: "",
      orderA: "inline-block",
      orderD: "none"
    };
  }

  componentDidMount() {
    const { handleTaskByClientsFind, mode } = this.props;
    handleTaskByClientsFind(0, mode);
  }

  _orderColumn(orderTask) {
    const { orderColumn, mode } = this.props;
    if (orderTask === 1) {
      this.setState({ orderA: "none", orderD: "inline-block" });
    } else {
      this.setState({ orderA: "inline-block", orderD: "none" });
    }
    orderColumn(orderTask, mode);
  }

  _renderCellView = data => {
    const { updateBothTabs } = this.props;
    return _.forOwn(data, function(value) {
      _.set(value, "idTypeClient", value.clientIdentification);
      _.set(value, "idNumberClient", value.clientTypeIdentification);
      _.set(value, "actions", {
        actionView: true,
        id: value,
        object: {commercialReport:{isConfidential:value.confidentiality}},
        idClient: value.idClient,
        urlServer: "./component",
        component: VIEW_TASK_ADMIN,
        actionEdit: true
      });
      let dateTaskFormat = moment(value.finalDate).locale("es");
      _.set(
        value,
        "dateTaskFormat",
        dateTaskFormat.format("DD") +
          " " +
          dateTaskFormat.format("MMM") +
          " " +
          dateTaskFormat.format("YYYY")
      );
      _.set(value, "responsible", value.responsible);
      _.set(value, "assignedBy", value.assignedBy);
      _.set(value, "changeStateTask", {
        idTask: value.id,
        idStatus: value.statusId,
        permissionEdit: true,
        updateBothTabs: updateBothTabs
      });
      let isFinalized =
        value.statusTask === "Cancelada" || value.statusTask === "Cerrada";
      _.set(value, "trafficLightIndicator", {
        days: value.workDaysToClose,
        isFinalized: isFinalized
      });
      _.set(value, "commercialReport.isConfidential", value.confidentiality);
    });
  };

  _renderHeaders = () => {
    return [
      {
        title: "Tipo de documento",
        key: "idTypeClient",
        style: { width: "230px" }
      },
      {
        title: "Número documento",
        key: "idNumberClient",
        style: { width: "200px" }
      },
      {
        title: "Nombre/Razón social",
        key: "clientName",
        style: { width: "300px" }
      },
      {
        title: "Asignada por",
        key: "assignedBy"
      },
      {
        title: "Responsable",
        key: "responsible"
      },
      {
        title: "",
        style: { width: "1px" },
        key: "trafficLightIndicator"
      },
      {
        title: "Fecha de cierre",
        key: "dateTaskFormat",
        style: { width: "200px" },
        orderColumn: (
          <span>
            <i
              className="caret down icon"
              style={{ cursor: "pointer", display: this.state.orderD }}
              onClick={() => this._orderColumn(0, "finalDate")}
            ></i>
            <i
              className="caret up icon"
              style={{ cursor: "pointer", display: this.state.orderA }}
              onClick={() => this._orderColumn(1, "finalDate")}
            ></i>
          </span>
        )
      },
      {
        title: "Estado",
        key: "changeStateTask"
      },
      {
        title: "",
        style: { width: "50px" },
        key: "commercialReport.isConfidential"
      },
      {
        title: "Ver",
        style: { width: "50px" },
        key: "actions"
      }
    ];
  };

  render() {
    const { tasks, mode } = this.props;
    return (
      <div>
        <GridComponent key={mode}
          headers={this._renderHeaders}
          data={this._renderCellView(tasks)}
          modalTitle={MODAL_TITLE}
        />
      </div>
    );
  }
}

export default ListMyTasksComponent;