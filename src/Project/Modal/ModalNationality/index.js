import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import './index.css';
import Modal, {ModalContent} from '../../../Components/Modal';
import Button from '../../../Components/Button';
import Resource from '../../../Resource';
import {withRouter} from 'react-router-dom';
import BackToMainMenu from "../../../backToMainMenu";
import {connect} from "react-redux";

class ModalNationality extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            resolve: _ => null,
            reject: _ => null
        }

        this.ref = {
            modal: React.createRef(),
            close: React.createRef()
        };
    }

    componentDidMount() {
        this.props.refer({current: this});
    }

    render() {
        const {state, props} = this;
        const {userDataEntry} = props.base;

        return <Modal
            required={true}
            ref={this.ref.modal}
            name={'ModalNationality'}
            size={'medium'}>
            <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                <div className={'pad-8'}><h3 style={{fontSize: '20px'}}>لطفا ملیت خود را انتخاب کنید.</h3></div>
                <div className={'dis-f'} style={{minHeight: 150}}>
                    <div className={'fb-10 pad-8 dis-f'}>
                        <Button className={'fb-20'} onClick={this.close.bind(this, 'IRANIAN')} theme={'green'}>ایرانی</Button>
                    </div>
                    <div className={'fb-10 pad-8 dis-f'}>
                        <Button className={'fb-20'} onClick={this.close.bind(this, 'FOREIGN')} theme="blue" >اتباع خارجی</Button>
                    </div>
                </div>
                <div className={'pad-8'}>
                    <Button className={'fb-20'} onClick={this.backToMainMenu.bind(this, false)} theme="red">بازگشت {state?.timer}</Button>
                </div>
            </ModalContent>
        </Modal>;
    }

    backToMainMenu() {
        const {props} = this;

        this.close(false);

        setTimeout(_ => {
            props.history.push(Resource.Route.HOME);
        }, 500);
    }

    close(data) {
        const {state} = this;

        BackToMainMenu.clearTimer();

        this.ref.modal.current.close();

        if (typeof data === 'string') {
            state.resolve(data);
        } else {
            state.reject();
        }
    }

    open(data, action) {
        return new Promise((resolve, reject) => {
            BackToMainMenu.setTimer(this);

            this.setState({
                resolve,
                reject,
                data,
                action,
                fields: {},
                error: null
            });

            return this.ref.modal.current.open();
        });
    }
}

const mapStateToProps = state => {
    return {
        base: state.base
    };
};

export default withRouter(connect(mapStateToProps)(ModalNationality));