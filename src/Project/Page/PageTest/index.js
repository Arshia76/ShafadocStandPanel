import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import './index.css';
import Button from '../../../Components/Button';
import testIcon from '../../../Resource/Image/pack/clicker-white.svg';
import ModalInsurBox from '../../Modal/ModalInsureBox';

class PageTest extends MyComponent {
    constructor (props) {
        super(props);

        this.ref = {
            modal: React.createRef(),
            modal2: React.createRef(),
            modal3: React.createRef()
        };
    }

    render () {
        return (
            <Page className={'PageTest'} id={'PageTest'}>
                <Button icon={testIcon} theme={'yellow'} onClick={this.buttonClickHandler.bind(this)}/>
                {/* <ModalNumberKeyboard refer={ref=>this.ref.modal=ref}/> */}
                {/* <ModalNationality ref={this.ref.modal2} onSuccess={data=>alert(data)}/> */}
                <ModalInsurBox refer={ref=>this.ref.modal3=ref} onSuccess={data=>alert(data)} />
            </Page>
        );
    }

    buttonClickHandler () {
        // this.ref.modal.current.open();
        // this.ref.modal2.current.open();
        this.ref.modal3.current.open();
    }
}

export default PageTest;