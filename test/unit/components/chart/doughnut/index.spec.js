import thunk from "redux-thunk";
import DoughnutComponent from "../../../../../src/components/chart/doughnut";
let defaultProps = {};

let chart = {
    chart: {
        ctx: {
            measureText: sinon.stub().resolves({ width: 10 }),
            fillText: sinon.stub()
        },
    },
    config: {
        options: {
            elements: {
                center: {
                    text: `Total tareas 100`,
                    display: true
                }
            }
        },
        data: {
            datasets: [50, 50]
        }
    },
    chartArea: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
    data: {
        labels: ['Finalizadas', 'Pendientes'],
        datasets: [
            {
                data: [50, 50],
                backgroundColor: [
                    '#00448c',
                ]
            }
        ]
    },
    getDatasetMeta: () => {
        return {
            controller: {
                getStyle: () => ({ backgroundColor: 1 }),
                _data: [0, 1]
            }
        }
    }
}

describe('Chart doughnut test', () => {
    beforeEach(() => {

        defaultProps.elements = {
            center: {
                text: `Total tareas 100`,
                display: true
            }
        }

        defaultProps.data = {
            labels: ['Finalizadas', 'Pendientes'],
            datasets: [
                {
                    data: [50, 50],
                    backgroundColor: [
                        '#00448c',
                    ]
                }
            ]
        }
    });

    it('Should render component', () => {
        itRenders(<DoughnutComponent {...defaultProps} />);
    });

    describe('Test actions', () => {
        it('handleBeforeDraw', () => {
            const wrapper = itRenders(<DoughnutComponent {...defaultProps} />);

            wrapper.instance().handleBeforeDraw(chart);
        });

        it('handleBeforeDraw when center is undefined', () => {
            const wrapper = itRenders(<DoughnutComponent {...defaultProps} />);

            chart.config.options.elements = {}

            wrapper.instance().handleBeforeDraw(chart);
        });

        it('handleBeforeDraw when display is false', () => {
            const wrapper = itRenders(<DoughnutComponent {...defaultProps} />);

            chart.config.options.elements = {
                center: {
                    display: false
                }
            }

            wrapper.instance().handleBeforeDraw(chart);
        });

        it('handleGenerateLabels', () => {
            const wrapper = itRenders(<DoughnutComponent {...defaultProps} />);
            wrapper.instance().handleGenerateLabels(chart);
        });

        it('handleGenerateLabels when labels is empty', () => {
            const wrapper = itRenders(<DoughnutComponent {...defaultProps} />);

            chart.data.labels = [];

            wrapper.instance().handleGenerateLabels(chart);
        });
    });
});