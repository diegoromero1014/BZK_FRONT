import React, { Component } from 'react';
import { Doughnut, Chart } from 'react-chartjs-2';

class ChartComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                labels: ['Pendientes', 'Finalizadas'],
                datasets: [{
                    data: [60, 40],
                    backgroundColor: [
                        'rgb(0, 68, 140)',
                    ]
                }]
            }
        }
    }

    componentWillMount() {
        Chart.pluginService.register({
            beforeDraw: chart => {
                if (chart.config.options.elements.center) {
                    const {
                        chart: { ctx },
                        config: {
                            options: {
                                elements: {
                                    center
                                }
                            },
                            data: { datasets }
                        },
                        innerRadius
                    } = chart;

                    let {
                        fontStyle = 'Arial',
                        text = datasets[0].data.reduce((a, b) => a + b, 0),
                        color = '#000',
                        sidePadding = 20
                    } = center;

                    let sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2)
                    //Start with a base font of 30px
                    ctx.font = "30px " + fontStyle;

                    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    let stringWidth = ctx.measureText(text).width;
                    let elementWidth = (innerRadius * 2) - sidePaddingCalculated;

                    // Find out how much the font can grow in width.
                    let widthRatio = elementWidth / stringWidth;
                    let newFontSize = Math.floor(30 * widthRatio);
                    let elementHeight = (innerRadius * 2);

                    // Pick a new font size so it will not be larger than the height of label.
                    let fontSizeToUse = Math.min(newFontSize, elementHeight);

                    //Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse + "px " + fontStyle;
                    ctx.fillStyle = color;

                    //Draw text in center
                    ctx.fillText(text, centerX, centerY);
                }
            }
        });
    }

    render() {
        return (
            <div style={{ width: '50%', height: 800 }}>
                <Doughnut
                    data={this.state.chartData}
                    options={{
                        cutoutPercentage: 85,
                        legend: {
                            labels: {
                                generateLabels(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map((label, i) => {
                                            const meta = chart.getDatasetMeta(0);
                                            const style = meta.controller.getStyle(i);

                                            const value = meta.controller._data[i];

                                            return {
                                                text: label + ' ' + value,
                                                fillStyle: style.backgroundColor,
                                                strokeStyle: style.borderColor,
                                                lineWidth: style.borderWidth,
                                                index: i
                                            };
                                        });
                                    }
                                    return [];
                                }
                            },
                            display: true,
                            position: 'right',
                        },
                        elements: {
                            center: {
                                text: 'Total de tareas 100',
                                color: 'rgb(0, 68, 140)',
                                fontStyle: 'Helvetica',
                                sidePadding: 15
                            }
                        }
                    }}
                />
            </div>
        );
    }
}

export default ChartComponent;