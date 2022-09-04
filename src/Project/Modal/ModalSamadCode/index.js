/* eslint eqeqeq: off */
import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import './index.css';
import Modal, {ModalContent} from '../../../Components/Modal';
import Button from '../../../Components/Button';
import Resource from '../../../Resource';
import Input from '../../../Components/Input';
import {connect} from 'react-redux';
import {addNationalCode, updateUserDataEntry} from '../../../Redux/Actions/base';
import App from '../../../App';
import Notif from '../../../Components/Notif';
import moment from 'jalali-moment';
import BackToMainMenu from "../../../backToMainMenu";
import {withRouter} from "react-router-dom";

class ModalSamadCode extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {fields: {}};

        this.ref = {
            modal: React.createRef(),
            insert: React.createRef(),
            close: React.createRef(),
            input: React.createRef()
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.refer({current: this});
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.timer === 1)
            this.backToMainMenu();
        return true;
    }

    render() {
        const {state} = this;
        const {fields} = state;

        return <Modal ref={this.ref.modal}
                      name={'ModalSamadCode'}
                      size={'medium'}
                      required={true}
                      error={state.error}>
            <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                <div className={'row'}><h3 style={{fontSize: '20px'}}>لطفا کد رهگیری بیمار را وارد نمایید.</h3></div>
                <div className={'dis-f'}>
                    <div className="fb-8 dis-f pad-4">
                        <Button className={'fb-20'} theme="red" title={'پاک کردن'} onClick={this.clear.bind(this)} ref={this.ref.clear}/>
                    </div>
                    <Input ref={this.ref.input} className={'input fb-12 pad-4'} align={'center'} direction={'ltr'} type="number" value={fields.code} style={{fontSize: '30px'}} onChange={this.setField.bind(this, 'code')}/>
                </div>
                <div className={'dis-f'} style={{flexDirection: 'column', width: '100%'}}>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '3')} theme="blue">3</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '2')} theme="blue">2</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '1')} theme="blue">1</Button>
                    </div>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '6')} theme="blue">6</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '5')} theme="blue">5</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '4')} theme="blue">4</Button>
                    </div>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '9')} theme="blue">9</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '8')} theme="blue">8</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '7')} theme="blue">7</Button>
                    </div>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '0')} theme="blue">0</Button>
                        <Button className={'flex mar-4'} onClick={this.submit.bind(this)} theme="yellow">ثبت</Button>
                        <Button className={'flex mar-4'} onClick={this.backToMainMenu.bind(this)} theme="red">بازگشت</Button>
                    </div>
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

    clear() {
        const fields = {...this.state.fields};

        fields.code = (fields.code || '').toString().slice(0, -1);

        this.setState({fields});
    }

    close(success) {
        BackToMainMenu.clearTimer();

        this.ref.modal.current.close();

        if (success === true)
            this.props.onSuccess(this.state.fields.code);
    }

    insert($char) {
        const fields = {...this.state.fields};

        fields.code = (fields.code || '') + $char;

        this.setState({fields});
    }

    open(data, action) {
        BackToMainMenu.setTimer(this);

        this.setState({
            data,
            action,
            fields: {},
            error: null
        });

        return this.ref.modal.current.open()
            .then(_ => {
                setTimeout(_ => {
                    if (this.ref.input.current)
                        this.ref.input.current.focus();
                }, 500);
            });
    }

    submit() {
        const code = this.state.fields.code;

        if (!code) {
            new Notif({message: 'کد رهگیری بیمار را وارد کنید.', theme: 'error'}).show();
            return;
        }

        this.props.updateUserDataEntry({samadCode: code});

        this.close(true);
    }
}

const mapStateToProps = state => {
    return {
        base: state.base,
        setting: state.setting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addNationalCode: nationalCode => dispatch(addNationalCode(nationalCode)),
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalSamadCode));