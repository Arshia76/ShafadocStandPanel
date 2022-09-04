import React from 'react';
import Page from '../../Components/Page';
import './index.css';
import * as Barcode from "react-barcode";
import {connect} from 'react-redux';
import MyComponent from "../../Components/MyComponent";
import moment from "jalali-moment";
import App from "../../App";
import Resource from "../../Resource";
import Main from "../../ElectronLayer/Main";

class ReportReceipt extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            template: null
        };

        console.log(props.base.userDataEntry);
    }

    componentDidMount() {
        super.componentDidMount();

        const {props} = this;
        const {setting} = props;
        const {userDataEntry} = props.base;

        switch (userDataEntry.darmangah) {
            case 'MORNING':
            case 'EVENING':
            case 'FUTURE':
                if (setting.report2LayoutPath) {
                    fetch(setting.report2LayoutPath)
                        .then(response => response.text())
                        .then(template => {
                            this.setState({template});
                        });
                }

                break;
        }

        if (userDataEntry.reciept) {
            if (setting.reportLayoutPath) {
                fetch(setting.reportLayoutPath)
                    .then(response => response.text())
                    .then(template => {
                        this.setState({template});
                    });
            }
        }

        if (userDataEntry.paraclinicPayment) {
            this.setState({
                template:
                    `<div class="dis-f"
                             style="border-bottom: 3px solid rgb(0, 0, 0); display: flex !important; align-items: center !important; padding: 0 !important; margin: 0 !important">
                            <div class="flex ali-e"
                                 style="align-self: flex-end; margin-bottom: 10px !important">

                                <h2 style="margin-bottom: 15px" class="ParaclinicReceipt-black-title ali-c">نام و
                                    نام
                                    خانوادگی:
                                    ${userDataEntry.paraclinicData.pendingReceptions[0].patient_first_name + ' ' + userDataEntry.paraclinicData.pendingReceptions[0].patient_last_name}</h2>
                                <h2 class="ParaclinicReceipt-black-title ali-c">کد ملی:
                                    ${userDataEntry.nationality === 'FOREIGN' ? `${userDataEntry.nationalCode} - اتباع  ` : userDataEntry.nationalCode || ''}</h2>
                            </div>
                        </div>
                        ${
                        userDataEntry.paraclinicData.pendingReceptions.map(item =>
                            `<div class="ParaclinicDetail">
                                    <div class="ParaclinicReceiptDetailContainer">
                                        <div class="ParaclinicReceiptDetail"><label>نوبت:</label><p>${item.turn}</p>
                                        </div>
                                        <div class="ParaclinicReceiptDetail"><label> بیمه:</label>
                                            <p>${item.insurance_name || '---'}</p>
                                        </div>
                                    </div>
                                    <div class="ParaclinicReceiptDetail"><label>نام پزشک معالج:</label>
                                        <p>${item.doctor_full_name}</p></div>
                                    <div class="ParaclinicReceiptDetail"><label>نام پزشک مرکز:</label>
                                        <p>${item.doctor.first_name + ' ' + item.doctor.last_name}</p></div>

                                  
                                    <div class="ParaclinicReceiptDetail"><label>مبلغ پرداخت شده:</label>
                                        <p>${App.formatMoney(item.invoice.payable)}ريال</p>
                                    </div>
                                    
                                     <div class="ParaclinicReceiptDetail"><label>مبلغ خدمات الکترونیکی:</label>
                                        <p>${App.formatMoney(item.invoice.invoice_items[item.invoice.invoice_items.length - 1].total)}ريال</p>
                                    </div>
                                    
                                    <div class="ParaclinicReceiptDetail">
                                        <label>تاریخ و زمان ویزیت:</label>
                                        <p>${item.appointment_date_time}</p>
                                    </div>

                                    <div class="ParaclinicReceiptDetail">
                                        <label>خدمات:</label>
                                    </div>

                                        ${item.reception_items.map(data =>
                                `<div class="ParaclinicReceiptDetail">
                                                <p style="overflow-wrap: break-word">${data.title}</p></div>`).join('')}
                                </div>`).join('')
                    }
                    `
            })
        }

        setTimeout(_ => {
            Main.print({deviceName: setting.printerName})
                .then(_ => {
                    setTimeout(_ => {
                        props.history.push(Resource.Route.HOME);
                    }, (setting.receiptPrint?.duration || 1) * 1000);
                });
        }, 500);
    }

    render() {
        const {props, state} = this;
        const {userDataEntry} = props.base;
        const {setting} = props;
        let template = state.template || '{{all}}';

        const dictionary = {
            hospitalName: setting?.receiptPrint?.hospitalName || '',
            birthDate: userDataEntry.birthDate ? moment(userDataEntry.birthDate).format('jYYYY/jMM/jDD') : '',
            darmangah: {
                MORNING: 'رزرو حضوری درمانگاه صبح',
                EVENING: 'رزرو حضوری درمانگاه عصر',
                FUTURE: 'رزرو حضوری روز‌های آینده'
            }[userDataEntry.darmangah] || '',
            //doctor
            // doctorAvatar: userDataEntry.doctor?.avatar || '',
            doctorCode: userDataEntry.doctor?.code || '',
            doctorDescription: userDataEntry.doctor?.description || '',
            doctorFirstName: userDataEntry.doctor?.firstName || '',
            doctorId: userDataEntry.doctor?.id || '',
            doctorLastName: userDataEntry.doctor?.lastName || '',
            doctorName: userDataEntry.doctor?.name || '',
            doctorResCount: userDataEntry.doctor?.resCount || '',
            doctorSpId: userDataEntry.doctor?.spId || '',
            doctorSpName: userDataEntry.doctor?.spName || '',
            doctorSpSlug: userDataEntry.doctor?.spSlug || '',
            doctorStartTime: userDataEntry.doctor?.startTime ? moment(userDataEntry.doctor.startTime, 'HH:mm:ss').format('HH:mm') : '',
            doctorTId: userDataEntry.doctor?.tId || '',
            doctorType: userDataEntry.doctor?.type || '',
            fatherName: userDataEntry.fatherName || '',
            firstName: userDataEntry.firstName || '',
            gender: userDataEntry.gender || '',
            hasForeignInsurance: userDataEntry.hasForeignInsurance || '',
            hid: userDataEntry.hid || '',
            lastName: userDataEntry.lastName || '',
            mobile: userDataEntry.mobile || '',
            nationalCode: userDataEntry.nationality === 'FOREIGN' ? `${userDataEntry.nationalCode} - اتباع  ` : userDataEntry.nationalCode || '',
            nationality: {FOREIGN: 'اتباع', IRANIAN: 'ایرانی'}[userDataEntry.nationality] || '',
            //payment
            paymentDataPriceAmount: userDataEntry.paymentData.priceAmount ? App.formatMoney(userDataEntry.paymentData.priceAmount) : 0,
            paymentDataChargeAmount: userDataEntry.reciept ? setting.chargeAmount ? userDataEntry.paymentData.chargeAmount ? App.formatMoney(userDataEntry.paymentData.chargeAmount) : 0 : 0 : userDataEntry.paymentData.chargeAmount ? App.formatMoney(userDataEntry.paymentData.chargeAmount) : 0,
            paymentDataChargePin: userDataEntry.paymentData.chargePin || '',
            paymentDataPricePin: userDataEntry.paymentData.pricePin || '',
            paymentDataPayed: userDataEntry.paymentData.priceAmount && userDataEntry.paymentData.chargeAmount ? App.formatMoney(parseInt(userDataEntry.paymentData.priceAmount || 0) + parseInt(userDataEntry.paymentData.chargeAmount || 0)) : '',
            reserveDate: userDataEntry.reserveDate ? moment(userDataEntry.reserveDate).format('jYYYY/jMM/jDD') : '',
            //reserveTime
            reserveTimeCapacity: userDataEntry.reserveTime.capacity || '',
            reserveTimeDate: userDataEntry.reserveTime.date ? moment(userDataEntry.reserveTime.date).format('jYYYY/jMM/jDD') : '',
            reserveTimeDescription: userDataEntry.reserveTime.description || '',
            reserveTimeDocId: userDataEntry.reserveTime.docId || '',
            reserveTimeId: userDataEntry.reserveTime.id || '',
            reserveTimeNodeId: userDataEntry.reserveTime.nodeId || '',
            reserveTimeStatus: userDataEntry.reserveTime.status || '',
            reserveTimeTime: userDataEntry.reserveTime.time ? moment(userDataEntry.reserveTime.time, 'HH:mm:ss').format('HH:mm') : '',
            reserveTimeToTime: userDataEntry.reserveTime.toTime ? moment(userDataEntry.reserveTime.toTime, 'HH:mm:ss').format('HH:mm') : '',
            reserveTimeTqId: userDataEntry.reserveTime.tqId || '',
            reserveTimeType: userDataEntry.reserveTime.type || '',
            samadCode: userDataEntry.samadCode || '',
            insuranceId: userDataEntry.shafadocInsurance.id || '',
            insuranceName: userDataEntry.shafadocInsurance.name || '',
            insuranceNumber: userDataEntry.shafadocInsurance.number || '',
            insuranceInsurer: userDataEntry.shafadocInsurance.insurer || '',
            // speciality
            // specialityIcon: userDataEntry.speciality?.icon || '',
            specialityId: userDataEntry.speciality?.id || '',
            specialityTitle: userDataEntry.speciality?.title || '',
            transactionId: userDataEntry.transactionId || '',
            turnNo: userDataEntry.turnNo || '',
            resCount: userDataEntry.resCount || '',
            startDailyResNo: userDataEntry.startDailyResNo || '',
            localDailyResNo: userDataEntry.localDailyResNo || '',
            currentDate: moment().format('jYYYY/jMM/jDD'),
            currentTime: moment().format('HH:mm'),

            //internet res
            internetResInfoTurnNo: userDataEntry?.internetResInfo?.turnNo || '',
            internetResInfoDocType: userDataEntry?.internetResInfo?.doc_type || '',
            internetResInfoDocName: userDataEntry?.internetResInfo?.docName || '',
            internetResInfoDocFamily: userDataEntry?.internetResInfo?.docFamily || '',
            internetResInfoSpName: userDataEntry?.internetResInfo?.sp_name || '',
            internetResInfoTransactionTime: userDataEntry?.internetResInfo?.transactionTime || '',
            internetResInfoTransactionDate: userDataEntry?.internetResInfo?.transactionDate || '',
            internetResInfoAppointmentTime: userDataEntry?.internetResInfo?.appointmentTime || '',
            internetResInfoAppointmentDate: userDataEntry?.internetResInfo?.appointmentDate || '',
            internetResInfoPatientName: userDataEntry?.internetResInfo?.patientName || '',
            internetResInfoPatientFamily: userDataEntry?.internetResInfo?.patientFamily || '',
            internetResInfoInsuranceName: userDataEntry?.internetResInfo?.insuranceName || '',
            internetResInfoInsuranceID: userDataEntry?.internetResInfo?.insuranceID || '',
            internetResInfoPaymentAmount: userDataEntry?.paymentData?.priceAmount || 0,
            internetResInfoChargeAmount: setting.chargeAmount ? userDataEntry?.paymentData?.chargeAmount : 0,
        }

        if (!userDataEntry.paraclinicPayment) {
            for (const item of Object.entries(dictionary)) {
                const rgx = new RegExp(`\{\{${item[0]}\}\}`, 'ig');
                template = template.replace(rgx, item[1]);
            }

            const rgx = new RegExp(`\{\{all\}\}`, 'ig');
            if (rgx.test(template))
                template = this.allTable(Object.entries(dictionary));
        }

        return <Page className={'ReportReceipt'} id={'ReportReceipt'} style={{
            marginRight: parseInt(setting.receiptPrint.margin.right),
            marginLeft: parseInt(setting.receiptPrint.margin.left),
            marginTop: parseInt(setting.receiptPrint.margin.top),
            marginBottom: parseInt(setting.receiptPrint.margin.bottom)
        }}>
            <div dangerouslySetInnerHTML={{__html: template}}/>
            {setting.receiptPrint.description &&
            <p className={'ReportReceipt-prompt'}>{setting.receiptPrint.description}</p>}
            {userDataEntry.hid && userDataEntry.hid.length < 30 ?
                <Barcode height={50} fontSize={13} value={userDataEntry.hid}/> : null}
        </Page>;
    }

    allTable(entries) {
        return `
        <table style="font-size: 15px; direction: ltr; text-align: start;width: 100%">
            ${entries.map(item => `
            <tr>
                <td>${item[0]}</td>
                <td>${item[1]}</td>
            </tr>
            `).join('')}
        </table>`;
    }
}

const mapStateToProps = state => {
    return {
        base: state.base,
        setting: state.setting
    };
};

export default connect(mapStateToProps)(ReportReceipt);