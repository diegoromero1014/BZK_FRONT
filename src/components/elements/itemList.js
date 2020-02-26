import React from 'react';
import { Table } from 'semantic-ui-react';
import ToolTip from '../toolTip/toolTipComponent';

const ItemList = ({ data, handleDelete, handleEdit, handleOnSelect, showCheck, title, show, isEditable, selectedRecord }) => {

    if (data.length) {
        return (
            <Table basic>
                <Table.Body>
                    {
                        data.sort((a, b) => a.order - b.order).map((element, index) =>
                            <Table.Row key={index} disabled={(index === selectedRecord && show) || !isEditable}>
                                {showCheck && handleOnSelect &&
                                    <Table.Cell textAlign='left' style={{ width: 5 }} verticalAlign='middle'>
                                        <ToolTip text={!element.associated ? 'Asociar' : 'Desasociar' }>
                                            <input
                                                type="checkbox"
                                                name="select"
                                                id="select"
                                                checked={element.associated}
                                                onClick={event => handleOnSelect(element, event)}
                                                style={{ marginTop: 5 }}
                                            />
                                        </ToolTip>
                                    </Table.Cell>
                                }

                                {handleEdit &&
                                    <Table.Cell textAlign='left' style={{ width: 5 }} verticalAlign='middle'>
                                        <ToolTip text={'Editar'}>
                                            <i style={{ cursor: 'pointer' }} className="pencil icon" onClick={() => {
                                                handleEdit(element, index);
                                            }} />
                                        </ToolTip>
                                    </Table.Cell>
                                }
                                <Table.Cell
                                    textAlign='left'
                                    style={handleEdit ? { cursor: 'pointer', textAlign: 'justify', whiteSpace: 'pre-line' } : { textAlign: 'justify', whiteSpace: 'pre-line' }}
                                    onClick={() => {
                                        if (handleEdit) {
                                            handleEdit(element, index);
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
                <p>{`No se han ${showCheck ? 'asociado' : 'adicionado'} ${title}`}</p>
            </div>
        )
    }


};

export default ItemList;