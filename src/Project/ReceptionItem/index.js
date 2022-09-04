import React from 'react';
import MyComponent from "../../Components/MyComponent";
import './index.css'
import App from "../../App";

class ReceptionItem extends MyComponent {

    render() {
        const {props} = this
        return (
            <div className={'ReceptionItem'}>
                <div className={'ReceptionItem-row'} id={'service'} style={{flexDirection: 'column', alignItems: 'flex-start'}}>

                    <span style={{fontWeight: 500, color: 'black'}}>خدمات:</span>
                    {props.reception_items.map(item => <span
                    >{item.title}</span>)}

                </div>

                <div className={'ReceptionItem-row'} style={{marginTop: '10px'}}>
                    <span> <span style={{
                        fontWeight: 500,
                        color: 'black'
                    }}>پزشک تجویز کننده:</span> {props.doctor.full_name}</span>
                    <span>/</span>
                    <span> <span
                        style={{fontWeight: 500, color: 'black'}}>پزشک معالج:</span> {props.doctor_full_name}</span>
                    <span style={{
                        fontSize: '30px',
                        marginRight: 'auto',
                        fontWeight: 500,
                        color: 'black'
                    }}>{App.formatMoney(props.invoice.payable)} ریال </span>
                </div>


            </div>
        )
    }
}

export default ReceptionItem;