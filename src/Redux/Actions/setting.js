export const UPDATE_SETTING = 'UPDATE_SETTING';

export const updateSetting = props => {
    return {
        type: UPDATE_SETTING,
        ...props
    };
};