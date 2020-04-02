import React, { Component } from 'react';
import { Doughnut, Chart } from 'react-chartjs-2';

class DoughnutComponent extends Component {

    static defaultProps = {
        elements: {
            center: {
                color: '#00448c',
                fontStyle: 'Helvetica',
                sidePadding: 15,
                display: true
            }
        },
        data: {
            labels: [],
            datasets: []
        }
    }

    componentWillMount() {
        Chart.pluginService.register({ beforeDraw: this.handleBeforeDraw });
    }

    handleBeforeDraw = chart => {
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

            if (center.display) {
                let {
                    fontStyle = 'Arial',
                    text = datasets[0].data.reduce((a, b) => a + b, 0),
                    color = '#00448c',
                    sidePadding = 20
                } = center;

                let sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2)
                ctx.font = "30px " + fontStyle;

                let stringWidth = ctx.measureText(text).width;
                let elementWidth = (innerRadius * 2) - sidePaddingCalculated;

                let widthRatio = elementWidth / stringWidth;
                let newFontSize = Math.floor(30 * widthRatio);
                let elementHeight = (innerRadius * 2);

                let fontSizeToUse = Math.min(newFontSize, elementHeight);

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.font = fontSizeToUse + "px " + fontStyle;
                ctx.fillStyle = color;

                ctx.fillText(text, centerX, centerY);
            }
        }
    }

    render() {
        const { data, elements } = this.props;

        return (
            <div>
                <Doughnut
                    data={data}
                    options={{
                        cutoutPercentage: 88,
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
                        elements: elements
                    }}
                />
            </div>
        );
    }
}

export default DoughnutComponent;