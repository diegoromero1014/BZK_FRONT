import React from 'react';
import { Table } from 'semantic-ui-react';
import ToolTip from '../toolTip/toolTipComponent';

const ItemList = ({ data, handleDelete, handleEdit }) => {
    
    if(data.length) { 
        return (
            <Table basic>
                <Table.Body>
                    {
                        data.sort((a, b) => a.order - b.order).map((element, index) =>
                            <Table.Row key={index}>
                                <Table.Cell style={{ cursor: 'pointer' }} onClick={() => {
                                    handleEdit(element);
                                }} >{element.text}</Table.Cell>
                                <Table.Cell textAlign='right'>
                                    <ToolTip text={'Eliminar'}>
                                        <i className="trash icon" onClick={() => handleDelete(element)} />
                                    </ToolTip>
                                </Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        )
        
    } else {
        return ( 
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', border: '1px solid #e1e1e1', color: '#3f3f3f', borderRadius: 3,}}>
                <p>Aún no se han adicionado items a la lista</p> 
            </div>
        )
    }

    
};

export default ItemList;