import React from 'react';
import { Table } from 'semantic-ui-react';
import ToolTip from '../toolTip/toolTipComponent';

let selectedRecord;

const ItemList = ({ data, handleDelete, handleEdit, handleOnSelect, showCheck, title, show, isEditable }) => {

    if (!show) { selectedRecord = null; }

    if (data.length) {
        return (
            <Table basic>
                <Table.Body>
                    {
                        data.sort((a, b) => a.order - b.order).map((element, index) =>
                            <Table.Row key={index} disabled={(index === selectedRecord && show) || !isEditable}>
                                <Table.Cell textAlign='left' style={{ width: 10 }} verticalAlign='middle'>
                                    {showCheck && handleOnSelect ?
                                        <ToolTip text={'Asociar'}>
                                            <input type="checkbox" name="select" id="select" defaultChecked={element.associated} onClick={event => handleOnSelect(element, event)} />
                                        </ToolTip>
                                        :

                                        handleEdit &&
                                        <ToolTip text={'Editar'}>
                                            <i style={{ cursor: 'pointer' }} className="pencil icon" onClick={() => {
                                                handleEdit(element);
                                                selectedRecord = index;
                                            }} />
                                        </ToolTip>
                                    }

                                </Table.Cell>
                                <Table.Cell
                                    textAlign='left'
                                    style={handleEdit ? { cursor: 'pointer', textAlign: 'justify', whiteSpace: 'pre-line' } : { textAlign: 'justify', whiteSpace: 'pre-line' }}
                                    onClick={() => {
                                        if (handleEdit) {
                                            handleEdit(element);
                                            selectedRecord = index;
                                        }
                                    }} >
                                    {element.text}
                                </Table.Cell>
                                {handleDelete &&
                                    <Table.Cell textAlign='right' verticalAlign='middle' style={{ width: 10 }}>
                                        <ToolTip text={'Eliminar'}>
                                            <i className="trash icon" onClick={() => handleDelete(element)} />
                                        </ToolTip>
                                    </Table.Cell>
                                }
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        )

    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', border: '1px solid #e1e1e1', color: '#3f3f3f', borderRadius: 3, }}>
                <p>{`No se han adicionado ${title}`}</p>
            </div>
        )
    }


};

export default ItemList;