import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Modal, {ModalContent} from '../../../Components/Modal';
import Button from '../../../Components/Button';
import Resource from '../../../Resource';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import BackToMainMenu from "../../../backToMainMenu";

class ModalForeignInsurance extends MyComponent {
    constructor(props) {
        super(props);

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
        const {setting} = props;

        return <Modal
            required={true}
            ref={this.ref.modal}
            name={'ModalForeignInsurance'}
            size={'medium'}>
            <ModalContent onClick={_=>BackToMainMenu.resetTimer()}>
                {setting.foreignClientPrevent ?
                    <div className={'pad-8'}><h3 style={{fontSize: '30px', padding: '20px'}}>{setting.foreignClientPrevent}</h3></div> :
                    <React.Fragment>
                        <div className={'fb-20 pad-8'}><h3 style={{fontSize: '20px'}}>لطفا وضعیت پوشش بیمه‌ای خود را انتخاب کنید.</h3></div>
                        <div className={'dis-f'} style={{minHeight: 150}}>
                            <div className={'fb-10 pad-8 dis-f'}>
                                <Button className={'fb-20'} onClick={this.close.bind(this, true)} theme={'blue'}>دارای بیمه</Button>
                            </div>
                            <div className={'fb-10 pad-8 dis-f'}>
                                <Button className={'fb-20'} onClick={this.close.bind(this, false)} theme={'green'}>بدون بیمه</Button>
                            </div>
                        </div>
                    </React.Fragment>}
                <div className={'pad-8'}>
                    <Button className={'fb-20'} onClick={this.backToMainMenu.bind(this, false)} theme="red">بازگشت {state?.timer}</Button>
                </div>
            </ModalContent>
        </Modal>;
    }

    backToMainMenu() {
        const {props} = this;

        this.close('don\'t success');

        setTimeout(_ => {
            props.history.push(Resource.Route.HOME);
        }, 500);
    }

    close(success) {
        BackToMainMenu.clearTimer();

        this.ref.modal.current.close();

        if (typeof success === 'boolean')
            this.props.onSuccess(success);
    }

    open(data, action) {
        BackToMainMenu.setTimer(this);

        this.setState({
            data,
            action,
            fields: {},
            error: null
        });

        return this.ref.modal.current.open();
    }
}

const mapStateToProps = state => {
    return {
        setting: state.setting
    };
};

export default withRouter(connect(mapStateToProps)(ModalForeignInsurance));