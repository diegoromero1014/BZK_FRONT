import React, {Component, PropTypes} from 'react';
import {XYPlot, XAxis, YAxis, VerticalGridLines, VerticalBarSeries, HorizontalGridLines, LineSeries, Crosshair} from 'react-vis';
import numeral from 'numeral';
import _ from 'lodash';

const labelsFn = (labels, fnToExtend, context) => {
  return _.map(labels, (label, index) => {
    return fnToExtend.bind(context, index);
  });
}

class BarSerires extends Component{
  constructor(props) {
    super(props);

    this._crosshairValues = [];
    this._mapBarSeries = this._mapBarSeries.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._formatCrosshairItems = this._formatCrosshairItems.bind(this);
    this.state = {
      crosshairValues: [],
      _onNearestXs: this._onNearestX.bind(this, 0)
    };
  }

  componentWillReceiveProps(nextProps){
    const {labels} = nextProps;
    this.setState({
      _onNearestXs: labelsFn(labels, this._onNearestX, this)
    });
  }

  _mapBarSeries(items, idx) {
    return <VerticalBarSeries
        onNearestX={this.state._onNearestXs[idx]}
        key={idx+1}
        data={items}
      />
  }

  _onNearestX(seriesIndex, value) {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = value;
    this.setState({crosshairValues: this._crosshairValues});
  }

  _formatCrosshairTitle(values) {
    return {
      title: 'X',
      value: values[0].x
    };
  }

  _formatCrosshairItems(values) {
    const {labels} = this.props;
    return values.map((v, i) => {
      return {
        title: `${labels[i]}`,
        value: v.y + " - Registros: " + v.z
      };
    });
  }

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(seriesIndex, value) {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = value;
    value.y = numeral(value.y).format('0,000');
    this.setState({crosshairValues: this._crosshairValues});
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this._crosshairValues = [];
    this.setState({crosshairValues: this._crosshairValues});
  }

  render(){
    const {items, defaultData} = this.props;
    return(
      <div style={{overflowX: 'auto'}}>
        <XYPlot
          onMouseLeave={this._onMouseLeave}
          margin={{left:80, top: 20, right: 20, bottom: 40}}
          xType="ordinal"
          width={900}
          height={400}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          {items === defaultData ?
            <VerticalBarSeries
                onNearestX={this.state._onNearestXs[0]}
                data={items}
              /> :
            items.map(this._mapBarSeries)
          }
          <Crosshair
            itemsFormat={this._formatCrosshairItems}
            titleFormat={this._formatCrosshairTitle}
            values={this.state.crosshairValues}/>
        </XYPlot>
      </div>
    );
  }
}

BarSerires.PropTypes = {
  labels: PropTypes.array.isRequred,
  items: PropTypes.array.isRequired
};

export default (BarSerires);
