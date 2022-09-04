import Resource from "./Resource";
import {modals} from "./Components/Modal";

let interval = null;
let timer = window.setting?.backToMainMenuDuration || null;
let duration = null;
let context = null;

class BackToMainMenu {
    static clearTimer() {
        try {
            clearInterval(interval);
        } catch (e) {
        }
    }

    static resetTimer() {
        timer = duration || window.setting?.backToMainMenuDuration || null;

        context.setState({timer: timer || ''});
    }

    static setTimer(ctx, time) {
        duration = time;
        timer = duration || window.setting?.backToMainMenuDuration || null;
        context = ctx;


        if (timer) {
            context.setState({timer: timer || ''});

            interval = setInterval(_ => {
                context.setState({timer: (--timer) || ''});

                if (timer <= 0) {
                    context.props.history.push(Resource.Route.HOME);

                    //clearing modal queue list
                    modals.splice(0, modals.length);

                    // setTimeout(_ => {
                    this.clearTimer();
                    // }, 1000);
                }
            }, 1000);
        } else {
            context.setState({timer: ''});
        }
    }
}

export default BackToMainMenu