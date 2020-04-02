export const buildDataStructure = (labels, data) => ({
    elements: {
        center: {
            text: `Total tareas ${data.reduce((a, b) => a + b, 0)}`,
            display: Array.isArray(data) && data.length
        }
    },
    data: {
        labels,
        datasets: [
            {
                data,
                backgroundColor: [
                    '#00448c',
                ]
            }
        ]
    }
});