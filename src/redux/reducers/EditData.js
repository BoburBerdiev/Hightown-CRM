import {EDIT_DATA} from "../../shared/constants/ActionTypes";


const INIT_STATE = {
    editId:localStorage.getItem('editDataId') || ''
};

const editDataReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case EDIT_DATA: {
            return {
                ...state,
                editId: action.payload
            };
        }
        default:
            return state;
    }
};
export default editDataReducer;
